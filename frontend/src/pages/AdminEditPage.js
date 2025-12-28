import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const from = location.state?.from || '/';

  const entityToEndpoint = {
    clients: 'auth',
    admins: 'admin',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires',
    reservations: 'reservations',
  };

  // 🔹 Aplatir un objet
  const flattenObject = (obj, parentKey = '', res = {}) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  };

  // 🔹 Reconstruire l'objet
  const unflattenObject = (flatObj) => {
    const result = {};
    for (let key in flatObj) {
      const keys = key.split('.');
      keys.reduce((acc, k, i) => {
        if (i === keys.length - 1) {
          acc[k] = flatObj[key];
        } else {
          acc[k] = acc[k] || {};
        }
        return acc[k];
      }, result);
    }
    return result;
  };

  // 🔹 Champs modifiables pour une réservation
  const reservationEditableFields = [
    'date',
    'heure',
    'etat',
    'description',
    'modePaiement',
    'prestataire',
  ];

  // 🔹 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const endpoint = entityToEndpoint[entity];

        if (!endpoint) {
          alert('Entité non reconnue');
          return;
        }

        const response = await fetch(
          `https://gofind-v9ee.onrender.com/api/${endpoint}/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error('Erreur de récupération');

        const data = await response.json();
        const dataKey = Object.keys(data).find(
          (key) => typeof data[key] === 'object'
        );
        const rawData = dataKey ? data[dataKey] : data;

        setFormData(flattenObject(rawData));

        // 🔹 Charger les prestataires si réservation
        if (entity === 'reservations') {
          const prestataireRes = await fetch(
            'https://gofind-v9ee.onrender.com/api/prestataires',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (prestataireRes.ok) {
            const prestataireData = await prestataireRes.json();
            setPrestataires(prestataireData.prestataires || []);
          }
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

  // 🔹 Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === 'number') val = Number(value);
    if (type === 'checkbox') val = checked;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];

      let payload = unflattenObject(formData);

      // 🔹 Upload image si c'est un fichier
      if (payload.profilePicture instanceof File) {
        const imageForm = new FormData();
        imageForm.append('image', payload.profilePicture);

        const uploadRes = await fetch(
          'https://gofind-v9ee.onrender.com/api/upload/image',
          {
            method: 'POST',
            body: imageForm,
          }
        );

        if (!uploadRes.ok) throw new Error('Erreur upload image');
        const uploadData = await uploadRes.json();
        payload.profilePicture = uploadData.url; // remplacer par l'URL
      }

      // 🔹 Cas réservation
      if (entity === 'reservations') {
        const filteredPayload = {};
        reservationEditableFields.forEach((field) => {
          if (payload[field] !== undefined)
            filteredPayload[field] = payload[field];
        });

        if (
          filteredPayload.prestataire &&
          typeof filteredPayload.prestataire === 'object'
        ) {
          filteredPayload.prestataire = filteredPayload.prestataire._id;
        }
        payload = filteredPayload;
      }

      const response = await fetch(
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

      if (!response.ok) throw new Error('Erreur de mise à jour');

      setSuccess(true);
      alert('✅ Modification prise en compte!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  // 🔹 Formulaire
  const renderFormFields = () => {
    if (entity === 'reservations') {
      return (
        <>
          {/* Client */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Client</label>
            <input
              type="text"
              disabled
              value={
                typeof formData.client === 'object'
                  ? `${formData.client.prenom} ${formData.client.nom}`
                  : ''
              }
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date?.slice(0, 10) || ''}
              onChange={handleChange}
            />
          </div>

          {/* Heure */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Heure</label>
            <input
              type="time"
              name="heure"
              value={formData.heure || ''}
              onChange={handleChange}
            />
          </div>

          {/* État */}
          <div style={{ marginBottom: '1rem' }}>
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
          </div>

          {/* Paiement */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Mode de paiement</label>
            <select
              name="modePaiement"
              value={formData.modePaiement || ''}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="PayPal">PayPal</option>
              <option value="Carte">Carte</option>
            </select>
          </div>

          {/* Prestataire */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Prestataire</label>
            <select
              name="prestataire"
              value={
                typeof formData.prestataire === 'object'
                  ? formData.prestataire?._id
                  : formData.prestataire || ''
              }
              onChange={handleChange}
            >
              <option value="">— Choisissez —</option>
              {prestataires.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
        </>
      );
    }

    // 🔹 Autres entités
    return Object.entries(formData).map(([key, value]) => {
      if (
        ['_id', 'createdAt', 'updatedAt', '__v', 'password', 'role'].includes(
          key
        )
      )
        return null;

      if (key === 'profilePicture') {
        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label>{key}</label>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {formData.profilePicture && (
              <img
                src={
                  typeof formData.profilePicture === 'string'
                    ? formData.profilePicture
                    : URL.createObjectURL(formData.profilePicture)
                }
                alt="Preview"
                style={{
                  width: '50px',
                  borderRadius: '30px',
                  marginTop: '5px',
                }}
              />
            )}
          </div>
        );
      }

      return (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label>{key}</label>
          <input name={key} value={value ?? ''} onChange={handleChange} />
        </div>
      );
    });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="admineditpage">
      <h1 className="tittle">Modifier {entity}</h1>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <button className="btn-secondary" type="submit">
            Enregistrer
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            Retour
          </button>
          {success && <p style={{ color: 'green' }}>Modification réussie</p>}
        </form>
      </div>
    </section>
  );
};

export default AdminEditPage;
