import { useState, useEffect } from 'react';
import { Home, Users, Package, Plus, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin/Dashboard.css';

const menuItems = [
  { name: 'admins', icon: <Users size={20} />, endpoint: '/admin' },
  { name: 'clients', icon: <Users size={20} />, endpoint: '/auth/clients' },
  {
    name: 'prestataires',
    icon: <Package size={20} />,
    endpoint: '/prestataires',
  },

  {
    name: 'prestations',
    icon: <Package size={20} />,
    endpoint: '/prestations',
  },
  {
    name: 'sousprestations',
    icon: <Package size={20} />,
    endpoint: '/sousprestations',
  },
];

const entityToEndpoint = {
  clients: 'auth',
  admins: 'admin',
  prestations: 'prestations',
  sousprestations: 'sousprestations',
  prestataires: 'prestataires',
};
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(menuItems[0].name);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const activeItem = menuItems.find((item) => item.name === activeTab);
      if (!activeItem) {
        console.error('❌ Onglet actif non trouvé !');
        return;
      }

      const apiUrl = `https://gofind-v9ee.onrender.com/api${activeItem.endpoint}`;
      const token = sessionStorage.getItem('token');

      if (!token) {
        console.error('❌ Aucun token trouvé dans sessionStorage');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Appel API:', apiUrl);
        console.log('🔐 Token utilisé:', token);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          const arrayKey = Object.keys(result).find((key) =>
            Array.isArray(result[key])
          );
          setData(arrayKey ? result[arrayKey] : []);
        }
      } catch (error) {
        console.error('❌ Erreur de récupération :', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, refresh]);

  const handleAdd = () => {
    navigate(`/admin/${activeTab}/ajouter`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/${activeTab}/modifier/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet élément ?')) return;

    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(
        `https://gofind-v9ee.onrender.com/api/${entityToEndpoint[activeTab]}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Home size={20} />
        <h1 className="sidebar-title">Tableau de bord</h1>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.icon} {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* --- ze main Content --- */}
      <div className="main-content">
        <div className="content-card">
          <div className="content-header">
            <h2 className="content-title">{activeTab}</h2>
            <button className="add-button" onClick={handleAdd}>
              <Plus size={20} /> Ajouter un {activeTab}
            </button>
          </div>

          {loading ? (
            <p className="loading-message">⏳ Chargement...</p>
          ) : (
            <div className="data-list">
              <p>Nombre d&#39;éléments : {data.length}</p>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item, index) => (
                  <div key={item.id || index} className="data-card">
                    <div className="data-info">
                      {activeTab === 'clients' ? (
                        <>
                          <span>
                            <strong>Nom:</strong> {item.nom}
                          </span>
                          <span>
                            <strong>Prénom:</strong> {item.prenom}
                          </span>
                          <span>
                            <strong>Email:</strong> {item.email}
                          </span>
                          <span>
                            <strong>Téléphone:</strong> {item.phone}
                          </span>
                        </>
                      ) : activeTab === 'prestataires' ? (
                        <>
                          <img
                            src={item.profilePicture}
                            alt={item.nom}
                            className="provider-image"
                          />
                          <span>
                            <strong>Nom:</strong> {item.nom}
                          </span>
                          <span>
                            <strong>Prénom:</strong> {item.prenom}
                          </span>
                          <span>
                            <strong>Email:</strong> {item.email}
                          </span>
                          <span>
                            <strong>Téléphone:</strong> {item.phone}
                          </span>
                          <span>
                            <strong>Prestation:</strong> {item.prestation}
                          </span>
                        </>
                      ) : activeTab === 'prestations' ? (
                        <>
                          <img
                            src={item.profileImage}
                            alt={item.shortDescription}
                            className="provider-image"
                          />
                          <span>
                            <strong>Nom:</strong> {item.nom}
                          </span>
                          <span>
                            <strong>Description:</strong>{' '}
                            {item.shortDescription}
                          </span>
                        </>
                      ) : activeTab === 'sousprestations' ? (
                        <>
                          <img
                            src={item.profileImage}
                            alt={item.nom}
                            className="provider-image"
                          />
                          <span>
                            <strong>Nom:</strong> {item.nom}
                          </span>
                          <span>
                            <strong>Titre:</strong> {item.title}
                          </span>
                          <span>
                            <strong>Catégorie:</strong> {item.prestation}
                          </span>
                        </>
                      ) : activeTab === 'admins' ? (
                        <>
                          <span>
                            <strong>Nom:</strong> {item.nom}
                          </span>
                          <span>
                            <strong>Prenom :</strong> {item.prenom}
                          </span>
                          <span>
                            <strong>Email :</strong> {item.email}
                          </span>
                        </>
                      ) : (
                        <span>{JSON.stringify(item, null, 2)}</span>
                      )}
                    </div>

                    <div className="data-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(item._id)}
                        aria-label={`Modifier ${item.nom}`}
                      >
                        <Edit size={16} /> Modifier
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item._id)}
                        aria-label={`Supprimer ${item.nom}`}
                      >
                        <Trash size={16} /> Supprimer
                      </button>
                      <button
                        className="details-button"
                        onClick={() =>
                          navigate(`/admin/${activeTab}/details/${item._id}`)
                        }
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">⚠️ Aucune donnée disponible</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
