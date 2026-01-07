import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Admin/Edit.css';

const API = 'https://gofind-v9ee.onrender.com/api';

/* =======================
   CityInput (IDENTIQUE ADD)
======================= */
const CityInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(value || '');

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          val
        )}&type=municipality&limit=6`
      );
      const data = await res.json();
      setSuggestions(data.features.map((f) => f.properties.city));
    } catch {
      setSuggestions([]);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input value={query} onChange={handleInputChange} />
      {suggestions.length > 0 && (
        <ul className="city-suggestions">
          {suggestions.map((city, i) => (
            <li
              key={i}
              onClick={() => {
                setQuery(city);
                onChange(city);
                setSuggestions([]);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CityInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

/* =======================
   MAIN COMPONENT
======================= */
const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const from = location.state?.from || '/dashboard';

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

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${API}/${entity}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const key = Object.keys(data).find((k) => typeof data[k] === 'object');
        setFormData(key ? data[key] : data);
      } catch {
        alert('Erreur chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      let payload = { ...formData };

      /* Upload images */
      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const fd = new FormData();
          fd.append('image', payload[field]);
          const res = await fetch(`${API}/upload/image`, {
            method: 'POST',
            body: fd,
          });
          const data = await res.json();
          payload[field] = data.url;
        }
      }

      /* Réservations → champs autorisés uniquement */
      if (entity === 'reservations') {
        payload = reservationAllowedFields.reduce((acc, f) => {
          if (payload[f] !== undefined) acc[f] = payload[f];
          return acc;
        }, {});
      }

      await fetch(`${API}/${entity}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      alert('✅ Modification réussie');
      navigate(from);
    } catch {
      alert('❌ Erreur modification');
    }
  };

  /* ================= RENDER ================= */
  const renderField = (key, value) => {
    /* Champs cachés */
    if (['_id', '__v', 'password', 'createdAt', 'updatedAt'].includes(key))
      return null;

    /* READ ONLY RULES */
    const readOnlyFields = {
      prestataires: ['selectedPrestations', 'realisations'],
      prestations: ['sousPrestations'],
      sousprestations: ['prestation', 'prestataires'],
    };

    if (readOnlyFields[entity]?.includes(key)) {
      return (
        <div key={key}>
          <label>{key}</label>
          <pre className="readonly-box">{JSON.stringify(value, null, 2)}</pre>
        </div>
      );
    }

    /* Address → CityInput */
    if (
      key === 'address' &&
      (entity === 'clients' || entity === 'prestataires')
    ) {
      return (
        <div key={key}>
          <label>Ville</label>
          <CityInput
            value={value}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, address: val }))
            }
          />
        </div>
      );
    }

    /* Image */
    if (imageFields.includes(key)) {
      return (
        <div key={key}>
          <label>{key}</label>
          <input
            type="file"
            onChange={(e) =>
              setFormData((p) => ({ ...p, [key]: e.target.files[0] }))
            }
          />
          {typeof value === 'string' && (
            <img src={value} alt="" className="preview-img" />
          )}
        </div>
      );
    }

    /* Default */
    return (
      <div key={key}>
        <label>{key}</label>
        <input
          value={value ?? ''}
          onChange={(e) =>
            setFormData((p) => ({ ...p, [key]: e.target.value }))
          }
        />
      </div>
    );
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="admineditpage">
      <h1>Modifier {entity}</h1>

      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([k, v]) => renderField(k, v))}

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
