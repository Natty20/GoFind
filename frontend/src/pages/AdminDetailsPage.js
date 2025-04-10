import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminDetailsPage = () => {
  const { entity, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const entityToEndpoint = {
          clients: 'auth',
          admins: 'admin',
          prestations: 'prestations',
          sousprestations: 'sousprestations',
          prestataires: 'prestataires',
        };

        const endpoint = entityToEndpoint[entity] || entity;
        const response = await fetch(
          `http://149.202.53.181:2000/api/${endpoint}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Erreur de récupération');
        const result = await response.json();

        // Trouver la bonne clé contenant l'objet
        const dataKey = Object.keys(result).find(
          (key) => typeof result[key] === 'object'
        );
        setData(dataKey ? result[dataKey] : result);
      } catch (error) {
        console.error(error);
        alert('Erreur de récupération');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Aucune donnée trouvée.</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>
        Détails - {entity} n°{id}
      </h2>
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <strong>{key} :</strong> {String(value)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => navigate(`/admin/${entity}/modifier/${id}`)}
          style={{ marginRight: '1rem', padding: '10px 20px' }}
        >
          Modifier
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '10px 20px' }}
        >
          Retour
        </button>
      </div>
    </div>
  );
};
export default AdminDetailsPage;
