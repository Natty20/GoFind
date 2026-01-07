import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Admin/Edit.css';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

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

  /* Champs non modifiables */
  const readOnlyFieldsByEntity = {
    prestataires: ['selectedPrestations', 'realisations'],
    prestations: ['sousPrestations'],
    sousprestations: ['prestation', 'prestataires'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const endpoint = entityToEndpoint[entity];

        const res = await fetch(
          `https://gofind-v9ee.onrender.com/api/${endpoint}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Erreur chargement');

        const data = await res.json();
        const dataKey = Object.keys(data).find(
          (key) => typeof data[key] === 'object'
        );

        setFormData(dataKey ? data[dataKey] : data);
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];
      let payload = {};

      // Cas spécifique réservations
      if (entity === 'reservations') {
        reservationAllowedFields.forEach((f) => {
          if (formData[f] !== undefined) payload[f] = formData[f];
        });
      } else {
        payload = { ...formData };
      }

      // Suppression champs read-only
      const readOnlyFields = readOnlyFieldsByEntity[entity] || [];
      readOnlyFields.forEach((field) => delete payload[field]);

      // Upload images
      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const imgData = new FormData();
          imgData.append('image', payload[field]);

          const uploadRes = await fetch(
            'https://gofind-v9ee.onrender.com/api/upload/image',
            { method: 'POST', body: imgData }
          );

          const uploadJson = await uploadRes.json();
          payload[field] = uploadJson.url;
        }
      }

      const res = await fetch(
        `https://gofind-v9ee.onrender.com/api/${endpoint}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Update failed');

      alert('✅ Modification réussie');
      navigate(from);
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const renderFormFields = () => {
    const readOnlyFields = readOnlyFieldsByEntity[entity] || [];

    /* Cas réservation */
    if (entity === 'reservations') {
      return (
        <>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date?.slice(0, 10) || ''}
            onChange={handleChange}
          />

          <label>Heure</label>
          <input
            type="time"
            name="heure"
            value={formData.heure || ''}
            onChange={handleChange}
          />

          <label>État</label>
          <select
            name="etat"
            value={formData.etat || ''}
            onChange={handleChange}
          >
            <option value="en attente">En attente</option>
            <option value="acceptée">Acceptée</option>
            <option value="déclinée">Déclinée</option>
          </select>

          <label>Mode de paiement</label>
          <select
            name="modePaiement"
            value={formData.modePaiement || ''}
            onChange={handleChange}
          >
            <option value="virement bancaire">Virement bancaire</option>
            <option value="paypal">PayPal</option>
            <option value="Carte via Stripe">Carte via Stripe</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
          />

          <p>
            <strong>Client :</strong> {formData.client?.email}
          </p>
          <p>
            <strong>Prestataire :</strong> {formData.prestataire?.email}
          </p>
        </>
      );
    }

    return Object.entries(formData).map(([key, value]) => {
      if (
        ['_id', '__v', 'password', 'role', 'createdAt', 'updatedAt'].includes(
          key
        )
      )
        return null;

      // Champs read-only affichés
      if (readOnlyFields.includes(key)) {
        return (
          <div key={key} className="readonly-field">
            <label>{key}</label>

            {Array.isArray(value) && value.length > 0 ? (
              <ul>
                {value.map((item, index) => (
                  <li key={index}>
                    {item.nom || item.title || item.email || item._id}
                  </li>
                ))}
              </ul>
            ) : typeof value === 'object' && value !== null ? (
              <p>{value.nom || value.email || value._id}</p>
            ) : (
              <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                Aucune information liée
              </p>
            )}

            <small style={{ opacity: 0.6 }}>Champ non modifiable</small>
          </div>
        );
      }

      // Images
      if (imageFields.includes(key)) {
        return (
          <div key={key}>
            <label>{key}</label>
            <input type="file" onChange={(e) => handleFileChange(e, key)} />
            {value && <img src={value} alt={key} width={80} />}
          </div>
        );
      }

      // Objets génériques
      if (typeof value === 'object') {
        return (
          <p key={key}>
            <strong>{key} :</strong> information liée
          </p>
        );
      }

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
