import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Admin/Edit.css';

const API = 'https://gofind-v9ee.onrender.com/api';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const [allPrestations, setAllPrestations] = useState([]);
  const [allSousPrestations, setAllSousPrestations] = useState([]);

  const token = sessionStorage.getItem('token');

  const entityToEndpoint = {
    admins: 'admin',
    clients: 'auth',
    prestataires: 'prestataires',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    reservations: 'reservations',
  };

  const imageFields = [
    'profilePicture',
    'profileImage',
    'backgroundImage',
    'overlayImage',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = entityToEndpoint[entity];

        const res = await fetch(`${API}/${endpoint}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const dataKey = Object.keys(data).find(
          (k) => typeof data[k] === 'object'
        );
        setFormData(dataKey ? data[dataKey] : data);

        if (
          entity === 'prestataires' ||
          entity === 'prestations' ||
          entity === 'reservations'
        ) {
          const pRes = await fetch(`${API}/prestations`);
          const spRes = await fetch(`${API}/sousprestations`);

          setAllPrestations((await pRes.json()).prestations || []);
          setAllSousPrestations((await spRes.json()).sousPrestations || []);
        }
      } catch (err) {
        alert('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {};

      if (entity === 'reservations') {
        ['date', 'heure', 'etat', 'modePaiement', 'description'].forEach(
          (f) => {
            if (formData[f] !== undefined) payload[f] = formData[f];
          }
        );

        if (new Date(payload.date) < new Date()) {
          return alert('❌ Date passée interdite');
        }
      } else if (entity === 'prestataires') {
        [
          'nom',
          'prenom',
          'email',
          'phone',
          'address',
          'description',
          'profilePicture',
        ].forEach((f) => {
          if (formData[f] !== undefined) payload[f] = formData[f];
        });
      } else if (entity === 'clients') {
        Object.entries(formData).forEach(([k, v]) => {
          if (
            ![
              'password',
              'role',
              '_id',
              '__v',
              'createdAt',
              'updatedAt',
            ].includes(k)
          ) {
            payload[k] = v;
          }
        });
      } else {
        payload = { ...formData };
        delete payload.password;
        delete payload.role;
      }

      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const fd = new FormData();
          fd.append('image', payload[field]);

          const uploadRes = await fetch(`${API}/upload/image`, {
            method: 'POST',
            body: fd,
          });
          const img = await uploadRes.json();
          payload[field] = img.url;
        }
      }

      const endpoint = entityToEndpoint[entity];
      const res = await fetch(`${API}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      alert('✅ Modification réussie');
      navigate(from);
    } catch {
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="admineditpage">
      <h1>Modifier {entity}</h1>

      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => {
          if (
            [
              '_id',
              '__v',
              'password',
              'role',
              'createdAt',
              'updatedAt',
            ].includes(key)
          )
            return null;

          if (
            (entity === 'prestataires' &&
              ['selectedPrestations', 'realisations'].includes(key)) ||
            (entity === 'prestations' && key === 'sousPrestations') ||
            (entity === 'sousprestations' &&
              ['prestation', 'prestataires'].includes(key)) ||
            (entity === 'reservations' &&
              ['client', 'prestataire', 'prestations'].includes(key))
          ) {
            return (
              <div key={key} className="readonly-field">
                <label>{key}</label>
                <pre>{JSON.stringify(value, null, 2)}</pre>
              </div>
            );
          }

          if (imageFields.includes(key)) {
            return (
              <div key={key}>
                <label>{key}</label>
                <input type="file" onChange={(e) => handleFileChange(e, key)} />
                {typeof value === 'string' && (
                  <img src={value} alt="" width={80} />
                )}
              </div>
            );
          }

          return (
            <div key={key}>
              <label>{key}</label>
              <input name={key} value={value ?? ''} onChange={handleChange} />
            </div>
          );
        })}

        <div className="admin-edit-btn">
          <button type="submit" className="btn-secondary">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(from)}
          >
            Retour
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditPage;
