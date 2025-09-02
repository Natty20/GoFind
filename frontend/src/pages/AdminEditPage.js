import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const entityToEndpoint = {
    clients: 'auth',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires',
    admins: 'admin',
    reservations: 'reservations',
  };

  // 🔹 Fonction récursive pour aplatir un objet en { "client.nom": "xxx" }
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

  // 🔹 Fonction pour reconstruire l'objet imbriqué avant PUT
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

  // 1. Fetch de l'élément à modifier
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

        // 🔹 On aplati pour le formulaire
        setFormData(flattenObject(rawData));
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  // 2. Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === 'number') val = Number(value);
    else if (type === 'checkbox') val = checked;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // 3. Envoyer les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const endpoint = entityToEndpoint[entity];
      if (!endpoint) {
        alert('Entité non reconnue');
        return;
      }

      // 🔹 Reconstruire l'objet original
      const payload = unflattenObject(formData);

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
      alert('✅ Modification réussie !');
      navigate(`/dashboard/${entity}`);
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  // 4. Formulaire dynamique
  const renderFormFields = () => {
    return Object.entries(formData).map(([key, value]) => {
      if (
        key === 'id' ||
        key === '_id' ||
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'password'
      ) {
        return null;
      }

      let inputType = 'text';

      if (typeof value === 'number') inputType = 'number';
      else if (typeof value === 'boolean') inputType = 'checkbox';
      else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        inputType = 'datetime-local';
        value = value.slice(0, 16); // 🔹 Ajuste au format attendu par input
      }

      return (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>{key}</label>
          <input
            type={inputType}
            name={key}
            value={inputType === 'checkbox' ? undefined : (value ?? '')}
            checked={inputType === 'checkbox' ? value : undefined}
            onChange={handleChange}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
      );
    });
  };

  // 5. Affichage du loader
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // 6. Affichage principal
  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Modifier un(e) {entity}</h2>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Enregistrer
          </button>
          <button type="button" onClick={() => navigate('/dashboard')}>
            Retour
          </button>
        </div>
        {success && (
          <p style={{ color: 'green', marginTop: '1rem' }}>
            ✅ Modification réussie !
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminEditPage;
