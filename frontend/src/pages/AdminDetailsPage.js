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
        const token = sessionStorage.getItem("token");
        const entityToEndpoint = {
          clients: "auth",
          admins: "admin",
          prestations: "prestations",
          sousprestations: "sousprestations",
          prestataires: "prestataires",
          reservations: "reservations",
        };

        // const endpoint = entityToEndpoint[entity] || entity;
        const response = await fetch(
          `https://gofind-v9ee.onrender.com/api/${entityToEndpoint}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erreur de récupération");
        const result = await response.json();

        // Trouver l'objet principal
        const dataKey = Object.keys(result).find(
          (key) => typeof result[key] === "object"
        );
        setData(dataKey ? result[dataKey] : result);
      } catch (error) {
        console.error(error);
        alert("Erreur de récupération");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Aucune donnée trouvée.</p>;

  // Fonction récursive pour afficher les objets et tableaux
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === "object" && value !== null) {
      return (
        <div style={{ marginLeft: "1rem", padding: "0.5rem", borderLeft: "2px solid #ddd" }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={{ marginBottom: "5px" }}>
              <strong>{k}:</strong> {renderValue(v)}
            </div>
          ))}
        </div>
      );
    }
    return String(value);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>
        Détails - {entity} n°{id}
      </h2>
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <strong>{key} :</strong> {renderValue(value)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate(`/admin/${entity}/modifier/${id}`)}
          style={{
            marginRight: "1rem",
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Modifier
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default AdminDetailsPage;
