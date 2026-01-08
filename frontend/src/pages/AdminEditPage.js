import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Admin/Edit.css';

const API = 'https://gofind-v9ee.onrender.com/api';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const [allPrestations, setAllPrestations] = useState([]);
  const [allSousPrestations, setAllSousPrestations] = useState([]);

  const from = location.state?.from || '/dashboard';

  const entityToEndpoint = {
    clients: 'auth',
    admins: 'admin',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires',
    reservations: 'reservations',
  };

  const imageFields = [
    'profilePicture',
    'profileImage',
    'backgroundImage',
    'overlayImage',
  ];

  const reservationAllowedFields = [
    'date',
    'heure',
    'etat',
    'modePaiement',
    'description',
  ];

  const readOnlyFieldsByEntity = {
    prestataires: ['selectedPrestations', 'realisations'],
    prestations: ['sousPrestations'],
    sousprestations: ['prestation', 'prestataires'],
  };

  const allowedPrestataireFields = [
    'nom',
    'prenom',
    'email',
    'password',
    'phone',
    'address',
    'profilePicture',
    'description',
  ];

  /* ===================== FETCH ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const endpoint = entityToEndpoint[entity];

        const res = await fetch(`${API}/${endpoint}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erreur chargement');

        const data = await res.json();
        const key = Object.keys(data).find((k) => typeof data[k] === 'object');
        setFormData(key ? data[key] : data);

        if (['prestataires', 'prestations', 'reservations'].includes(entity)) {
          const [pRes, spRes] = await Promise.all([
            fetch(`${API}/prestations`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API}/sousprestations`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const pData = await pRes.json();
          const spData = await spRes.json();

          setAllPrestations(pData.prestations || []);
          setAllSousPrestations(spData.sousPrestations || []);
        }
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, [field]: file }));
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];
      let payload = {};

      if (entity === 'reservations') {
        reservationAllowedFields.forEach((f) => {
          if (formData[f] !== undefined) payload[f] = formData[f];
        });
      } else {
        payload = { ...formData };
      }

      if (entity === 'prestataires') {
        payload = allowedPrestataireFields.reduce((acc, key) => {
          if (payload[key] !== undefined) acc[key] = payload[key];
          return acc;
        }, {});
      }

      // Upload images
      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const imgData = new FormData();
          imgData.append('image', payload[field]);

          const uploadRes = await fetch(`${API}/upload/image`, {
            method: 'POST',
            body: imgData,
          });

          const uploadJson = await uploadRes.json();
          payload[field] = uploadJson.url;
        }
      }

      const res = await fetch(`${API}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');

      alert('✅ Modification réussie');
      navigate(from);
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  /* ===================== RENDER ===================== */
  const renderFormFields = () => {
    const readOnlyFields = readOnlyFieldsByEntity[entity] || [];

    return Object.entries(formData).map(([key, value]) => {
      if (
        ['_id', '__v', 'password', 'role', 'createdAt', 'updatedAt'].includes(
          key
        )
      )
        return null;

      /* ---------- READ ONLY ---------- */
      if (readOnlyFields.includes(key)) {
        // Prestataire → selectedPrestations
        if (key === 'selectedPrestations' && Array.isArray(value)) {
          return (
            <div key={key} className="readonly-field">
              <label>Prestations</label>
              <ul>
                {value.map((item) => {
                  const prestation = allPrestations.find(
                    (p) =>
                      p._id === item.prestationId?.$oid ||
                      p._id === item.prestationId
                  );
                  return (
                    <li key={item._id}>
                      {prestation?.nom || 'Nom inconnu'} :{' '}
                      {item.selectedSousPrestations
                        .map((sId) => {
                          const sous = allSousPrestations.find(
                            (sp) => sp._id === sId?.$oid || sp._id === sId
                          );
                          return sous?.nom || 'Sous-prestation inconnue';
                        })
                        .join(' • ')}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        // Prestation → sousPrestations
        if (key === 'sousPrestations' && Array.isArray(value)) {
          return (
            <div key={key} className="readonly-field">
              <label>Sous-prestations</label>
              <ul>
                {value.map((id) => {
                  const sous = allSousPrestations.find(
                    (sp) => sp._id === id?.$oid || sp._id === id
                  );
                  return (
                    <li key={id}>{sous?.nom || 'Sous-prestation inconnue'}</li>
                  );
                })}
              </ul>
            </div>
          );
        }

        // Sous-prestation → prestation
        if (key === 'prestation') {
          const prestation = allPrestations.find(
            (p) => p._id === value?.$oid || p._id === value
          );
          return (
            <div key={key} className="readonly-field">
              <label>Prestation</label>
              <p>{prestation?.nom || 'Nom inconnu'}</p>
            </div>
          );
        }

        // Générique
        return (
          <div key={key} className="readonly-field">
            <label>{key}</label>
            <p>
              {Array.isArray(value) ? value.length : value || 'Aucune info'}
            </p>
          </div>
        );
      }

      /* ---------- IMAGES ---------- */
      if (imageFields.includes(key)) {
        return (
          <div key={key}>
            <label>{key}</label>
            <input type="file" onChange={(e) => handleFileChange(e, key)} />
            {typeof value === 'string' && (
              <img src={value} alt={key} width={80} />
            )}
          </div>
        );
      }

      /* ---------- OBJETS ---------- */
      if (typeof value === 'object' && value !== null) {
        return (
          <p key={key}>
            <strong>{key} :</strong> information liée
          </p>
        );
      }

      /* ---------- INPUT ---------- */
      return (
        <div key={key}>
          <label>{key}</label>
          <input name={key} value={value ?? ''} onChange={handleChange} />
        </div>
      );
    });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="admineditpage">
      <h1>Modifier {entity}</h1>

      <form onSubmit={handleSubmit}>
        {renderFormFields()}

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
