import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Package,
  Plus,
  Edit,
  Trash,
  Layers,
  CalendarCheck,
  Star,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import '../styles/Admin/Dashboard.css';

const menuItems = [
  { name: 'admins', icon: <Users size={20} />, endpoint: '/admin' },
  { name: 'clients', icon: <Users size={20} />, endpoint: '/auth/clients' },
  {
    name: 'prestataires',
    icon: <Users size={20} />,
    endpoint: '/prestataires',
  },

  {
    name: 'prestations',
    icon: <Package size={20} />,
    endpoint: '/prestations',
  },
  {
    name: 'sousprestations',
    icon: <Layers size={20} />,
    endpoint: '/sousprestations',
  },
  {
    name: 'reservations',
    icon: <CalendarCheck size={20} />,
    endpoint: '/all',
  },
  {
    name: 'avis',
    icon: <Star size={20} />,
    endpoint: 'avis/public',
  },
];

const entityToEndpoint = {
  clients: 'auth',
  admins: 'admin',
  prestations: 'prestations',
  sousprestations: 'sousprestations',
  prestataires: 'prestataires',
  reservations: 'reservations',
  avis: 'avis',
};
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(menuItems[0].name);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const activeItem = menuItems.find((item) => item.name === activeTab);
      if (!activeItem) {
        setError('❌ Onglet actif non trouvé !');
        return;
      }

      const apiUrl =
        activeTab === 'reservations'
          ? 'https://gofind-v9ee.onrender.com/api/reservations/all'
          : `https://gofind-v9ee.onrender.com/api${activeItem.endpoint}`;

      const token = sessionStorage.getItem('token');

      if (!token) {
        setError('❌ Aucun token trouvé dans sessionStorage');
        setLoading(false);
        return;
      }

      try {
        // console.log('🔐 Token utilisé:', token);

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

        // Cas spécial : l’API des réservations renvoie { reservations: [...] }
        if (activeTab === 'reservations') {
          if (Array.isArray(result)) {
            setData(result);
          } else {
            setData([]);
          }
          return;
        }

        // Comportement normal pour les autres onglets
        if (Array.isArray(result)) {
          setData(result);
        } else {
          const arrayKey = Object.keys(result).find((key) =>
            Array.isArray(result[key])
          );
          setData(arrayKey ? result[arrayKey] : []);
        }
      } catch (error) {
        setError('❌ Erreur lors de la récupération :', error);
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
      setError(' Erreur lors de la suppression :', error);
      alert('❌ Erreur lors de la suppression.');
    }
  };
  const toggleAvisVisibility = async (id) => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(
        `https://gofind-v9ee.onrender.com/api/avis/${id}/visibility`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur visibilité');
      }

      setRefresh(!refresh);
    } catch (error) {
      alert('❌ Impossible de modifier la visibilité');
    }
  };

  return (
    <main className="dashboard-container">
      <section className="sidebar">
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
      </section>

      {/* --- ze main Content --- */}
      <section className="main-content">
        <div className="content-card">
          <div className="content-header">
            <h2 className="content-title">{activeTab}</h2>
            {activeTab !== 'avis' && (
              <button className="dashboard btn-primary" onClick={handleAdd}>
                <Plus size={20} /> Ajouter un {activeTab}
              </button>
            )}
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
                            className="data-info-image"
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
                        </>
                      ) : activeTab === 'prestations' ? (
                        <>
                          <img
                            src={item.profileImage}
                            alt={item.shortDescription}
                            className="admin-provider-image"
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
                            className="admin-prestation-image"
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
                      ) : activeTab === 'reservations' ? (
                        <>
                          <span>
                            <strong>Client :</strong> {item.client?.nom}{' '}
                            {item.client?.prenom}
                          </span>

                          <span>
                            <strong>Téléphone :</strong> {item.client?.phone}
                          </span>

                          <span>
                            <strong>Date :</strong>{' '}
                            {new Date(item.date).toLocaleDateString()}
                          </span>

                          <span>
                            <strong>Heure :</strong> {item.heure}
                          </span>

                          <span>
                            <strong>État :</strong> {item.etat}
                          </span>

                          <span>
                            <strong>Prestation :</strong>
                            {item.prestations
                              ?.map((p) => p.prestationId?.nom)
                              .join(', ')}
                          </span>

                          <span>
                            <strong>Sous-prestations :</strong>
                            {item.prestations
                              ?.flatMap(
                                (p) =>
                                  p.sousPrestations?.map((s) => s.nom) || []
                              )
                              .join(', ')}
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
                      ) : activeTab === 'avis' ? (
                        <>
                          <span>
                            <strong>Auteur :</strong> {item.auteur?.nom}{' '}
                            {item.auteur?.prenom}
                          </span>
                          <span>
                            <strong>Prestataire :</strong>{' '}
                            {item.prestataire?.nom} {item.prestataire?.prenom}
                          </span>

                          <span>
                            <strong>Note :</strong> ⭐ {item.note}/5
                          </span>

                          <span>
                            <strong>Commentaire :</strong> {item.commentaire}
                          </span>

                          <span>
                            <strong>Visibilité :</strong>{' '}
                            {item.visible ? 'Visible' : 'Masqué'}
                          </span>
                          <span>
                            <strong>Date :</strong>{' '}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <span>{JSON.stringify(item, null, 2)}</span>
                      )}
                    </div>

                    <div className="data-actions">
                      {activeTab === 'avis' ? (
                        <>
                          {/* Masquer / Afficher */}
                          <button
                            className="edit-button"
                            onClick={() => toggleAvisVisibility(item._id)}
                          >
                            {item.visible ? 'Masquer' : 'Afficher'}
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash size={16} /> Supprimer
                          </button>

                          <button
                            className="details-button"
                            onClick={() =>
                              navigate(`/admin/avis/details/${item._id}`)
                            }
                          >
                            Voir
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Modifier */}
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(item._id)}
                          >
                            <Edit size={16} /> Modifier
                          </button>

                          {/* Supprimer */}
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash size={16} /> Supprimer
                          </button>

                          {/* Voir */}
                          <button
                            className="details-button"
                            onClick={() =>
                              navigate(
                                `/admin/${activeTab}/details/${item._id}`
                              )
                            }
                          >
                            Voir
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">⚠️ Aucune donnée disponible</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default Dashboard;
