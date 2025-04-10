import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminEditPage() {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const entityToEndpoint = {
    clients: 'auth',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires',
  };
  // Fetch de l'élément à modifier
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `http://149.202.53.181:2000/api/${entity}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Erreur de récupération');
        const data = await response.json();

        // Trouver la clé contenant les données
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

  // 2. Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Envoyer les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `http://149.202.53.181:2000/api/${entityToEndpoint}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Erreur de mise à jour');

      alert('✅ Modification réussie !');
      navigate(`/dashboard`);
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  // 4. Formulaire dynamique
  const renderFormFields = () => {
    return Object.entries(formData).map(([key, value]) => {
      // on ne modifie pas les id ou champs système
      if (
        key === 'id' ||
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'password'
      )
        return null;

      return (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>{key}</label>
          <input
            type="text"
            name={key}
            value={value ?? ''}
            onChange={handleChange}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
      );
    });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Modifier un(e) {entity}</h2>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button
          type="submit"
          style={{ marginTop: '1rem', padding: '10px 20px' }}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
