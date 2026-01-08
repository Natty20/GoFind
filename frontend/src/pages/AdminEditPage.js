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

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const endpoint = entityToEndpoint[entity];

        // Fetch main entity
        const res = await fetch(`${API}/${endpoint}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erreur chargement');
        const data = await res.json();
        const dataKey = Object.keys(data).find(
          (key) => typeof data[key] === 'object'
        );
        setFormData(dataKey ? data[dataKey] : data);

        // Fetch all prestations / sous-prestations pour affichage lisible
        if (entity === 'prestataires' || entity === 'prestations') {
          const prestationsRes = await fetch(`${API}/prestations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const prestationsData = await prestationsRes.json();
          setAllPrestations(prestationsData.prestations || []);

          const sousPrestationsRes = await fetch(`${API}/sousprestations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const sousPrestationsData = await sousPrestationsRes.json();
          setAllSousPrestations(sousPrestationsData.sousPrestations || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];
      let payload = {};

      // Cas réservation → champs autorisés uniquement
      if (entity === 'reservations') {
        reservationAllowedFields.forEach((f) => {
          if (formData[f] !== undefined) payload[f] = formData[f];
        });
      } else {
        payload = { ...formData };
      }

      // Supprimer uniquement les vrais champs non modifiables
      const readOnlyFields = readOnlyFieldsByEntity[entity] || [];
      readOnlyFields.forEach((field) => {
        if (field !== 'selectedPrestations') delete payload[field];
        // selectedPrestations doit rester pour prestataires
      });

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

  /* ===================== RENDER FIELDS ===================== */
  const renderFormFields = () => {
    const readOnlyFields = readOnlyFieldsByEntity[entity] || [];

    // Cas réservations
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
            <strong>Client :</strong>{' '}
            {formData.client?.email || 'Non renseigné'}
          </p>
          <p>
            <strong>Prestataire :</strong>{' '}
            {formData.prestataire?.email || 'Non renseigné'}
          </p>
        </>
      );
    }

    // Champs génériques
    return Object.entries(formData).map(([key, value]) => {
      if (
        ['_id', '__v', 'password', 'role', 'createdAt', 'updatedAt'].includes(
          key
        )
      )
        return null;

      // Champs read-only
      if (readOnlyFields.includes(key)) {
        // Prestataire → noms des prestations
        if (key === 'selectedPrestations' && Array.isArray(value)) {
          return (
            <div key={key} className="readonly-field">
              <label>Prestations</label>
              <ul>
                {value.map((prestationItem) => {
                  const prestation = allPrestations.find(
                    (p) => p._id === prestationItem.prestationId
                  );
                  return (
                    <li key={prestationItem.prestationId}>
                      {prestation?.nom || 'Nom inconnu'} :{' '}
                      {prestationItem.selectedSousPrestations
                        .map((sId) => {
                          const sous = allSousPrestations.find(
                            (sp) => sp._id === sId
                          );
                          return sous?.title || 'Sous-prestation inconnue';
                        })
                        .join(' • ')}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        // Autres read-only
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div key={key} className="readonly-field">
              <label>{key}</label>
              <ul>
                {value.map((item, i) => (
                  <li key={i}>
                    {item.nom || item.title || item.email || item._id}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="readonly-field">
              <label>{key}</label>
              <p>
                {value.nom ||
                  value.title ||
                  value.email ||
                  value._id ||
                  'Aucune info'}
              </p>
            </div>
          );
        }

        return (
          <div key={key} className="readonly-field">
            <label>{key}</label>
            <p>{value ?? 'Aucune info'}</p>
          </div>
        );
      }

      // Images
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

      // Objets simples
      if (typeof value === 'object' && value !== null) {
        return (
          <p key={key}>
            <strong>{key} :</strong> information liée
          </p>
        );
      }

      // Champs normaux
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
