import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  CreditCard,
  Image,
  Video,
  Settings,
  Plus,
  Edit,
  Trash,
} from 'lucide-react';
import '../styles/Admin/Dashboard.css';

const menuItems = [
  {
    name: 'prestataires',
    icon: <Package size={20} />,
    endpoint: '/prestataires',
  },
  { name: 'clients', icon: <Users size={20} />, endpoint: '/auth/clients' },
  { name: 'admins', icon: <Users size={20} />, endpoint: '/admin' },
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
  {
    name: 'reservations',
    icon: <Package size={20} />,
    endpoint: '/reservations/all',
  },
  { name: 'Paiements', icon: <CreditCard size={20} />, endpoint: '/paiements' },
  { name: 'Images', icon: <Image size={20} />, endpoint: '/images' },
  { name: 'Vidéos', icon: <Video size={20} />, endpoint: '/videos' },
  { name: 'Paramètres', icon: <Settings size={20} />, endpoint: '/parametres' },
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

      const apiUrl = `http://149.202.53.181:2000/api${activeItem.endpoint}`;

      try {
        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Si la réponse est un tableau, on le set direct dans data
        if (Array.isArray(result)) {
          setData(result);
        } else {
          const dataKey = Object.keys(result).find((key) =>
            Array.isArray(result[key])
          );
          setData(dataKey ? result[dataKey] : []);
        }
      } catch (error) {
        console.error('Erreur de récupération :', error);
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
      const response = await fetch(
        `http://149.202.53.181:2000/api${entityToEndpoint}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setRefresh(!refresh);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- Sidebar --- */}
      <div className="sidebar">
        <Home size={20} />
        <h2 className="sidebar-title">Tableau de bord</h2>
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

      {/* --- Main Content --- */}
      <div className="main-content">
        <div className="content-card">
          <div className="content-header">
            <h1 className="content-title">{activeTab}</h1>
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
                            <strong>Email:</strong> {item.email}
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
                      ) : activeTab === 'reservations' ? (
                        <>
                          <span>
                            <strong>Id:</strong> {item._id}
                          </span>
                          <span>
                            <strong>Client:</strong> {item.client}
                          </span>
                          <span>
                            <strong>Prestataire:</strong> {item.prestataire}
                          </span>
                          <span>
                            <strong>Description:</strong> {item.description}
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
