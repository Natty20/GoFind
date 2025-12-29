import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({});
  const [prestataires, setPrestataires] = useState([]);
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

  const reservationEditableFields = [
    'date',
    'heure',
    'etat',
    'description',
    'modePaiement',
    'prestataire',
  ];

  /* =======================
      UTILS
  ======================= */

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

  const unflattenObject = (flatObj) => {
    const result = {};
    for (let key in flatObj) {
      const keys = key.split('.');
      keys.reduce((acc, k, i) => {
        if (i === keys.length - 1) acc[k] = flatObj[key];
        else acc[k] = acc[k] || {};
        return acc[k];
      }, result);
    }
    return result;
  };

  /* =======================
      FETCH DATA
  ======================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const endpoint = entityToEndpoint[entity];

        if (!endpoint) throw new Error('Entité inconnue');

        const res = await fetch(
          `https://gofind-v9ee.onrender.com/api/${endpoint}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Erreur chargement');

        const data = await res.json();
        const dataKey = Object.keys(data).find(
          (key) => typeof data[key] === 'object'
        );

        const rawData = dataKey ? data[dataKey] : data;
        setFormData(flattenObject(rawData));

        if (entity === 'reservations') {
          const pRes = await fetch(
            'https://gofind-v9ee.onrender.com/api/prestataires',
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (pRes.ok) {
            const pData = await pRes.json();
            setPrestataires(pData.prestataires || []);
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

  /* =======================
      HANDLERS
  ======================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === 'number') val = Number(value);
    if (type === 'checkbox') val = checked;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  /* =======================
      SUBMIT
  ======================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];
      let payload = unflattenObject(formData);

      // 🔹 Upload images
      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const formImg = new FormData();
          formImg.append('image', payload[field]);

          const uploadRes = await fetch(
            'https://gofind-v9ee.onrender.com/api/upload/image',
            {
              method: 'POST',
              body: formImg,
            }
          );

          if (!uploadRes.ok) throw new Error(`Upload ${field} échoué`);
          const uploadData = await uploadRes.json();
          payload[field] = uploadData.url;
        }
      }

      // 🔹 Cas réservation
      if (entity === 'reservations') {
        const filtered = {};
        reservationEditableFields.forEach((f) => {
          if (payload[f] !== undefined) filtered[f] = payload[f];
        });

        if (typeof filtered.prestataire === 'object') {
          filtered.prestataire = filtered.prestataire._id;
        }

        payload = filtered;
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

  /* =======================
      RENDER FORM
  ======================= */

  const renderFormFields = () => {
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

          <label>Prestataire</label>
          <select
            name="prestataire"
            value={formData.prestataire?._id || ''}
            onChange={handleChange}
          >
            <option value="">— Choisir —</option>
            {prestataires.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nom}
              </option>
            ))}
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
          />
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

      if (imageFields.includes(key)) {
        return (
          <div key={key}>
            <label>{key}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, key)}
            />
            {value && (
              <img
                src={value instanceof File ? URL.createObjectURL(value) : value}
                alt={key}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  marginTop: 8,
                  borderRadius: 8,
                }}
              />
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
