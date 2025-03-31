import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Client/Profil.css';

const ProfilePage = () => {
  const { id } = useParams();
  const [prestataire, setPrestataire] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('images');

  useEffect(() => {
    const fetchPrestataire = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/prestataires/${id}`
        );
        setPrestataire(response.data.prestataire);
      } catch (err) {
        setError('Erreur lors du chargement des données du prestataire.');
      }
    };

    const fetchPrestationsEtSousPrestations = async () => {
      try {
        const prestationsRes = await axios.get(
          'http://localhost:2000/api/prestations'
        );
        const sousPrestationsRes = await axios.get(
          'http://localhost:2000/api/sousprestations'
        );

        const prestationsMap = prestationsRes.data.prestations.reduce(
          (acc, prest) => {
            acc[prest._id] = prest.nom;
            return acc;
          },
          {}
        );

        const sousPrestationsMap =
          sousPrestationsRes.data.sousprestations.reduce((acc, sous) => {
            acc[sous._id] = sous.nom;
            return acc;
          }, {});

        setPrestations(prestationsMap);
        setSousPrestations(sousPrestationsMap);
      } catch (err) {
        setError(
          'Erreur lors du chargement des prestations et sous-prestations.'
        );
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchPrestataire();
      await fetchPrestationsEtSousPrestations();
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!prestataire) return <p className="error">Prestataire non trouvé.</p>;

  return (
    <div className="profile-page">
      <section className="provider-details">
        <div className="details">
          <img
            src={prestataire.profilePicture}
            alt={prestataire.nom}
            className="provider-image"
          />
          <div className="provider-info">
            <h1>{prestataire.nom}</h1>
            <p>{prestataire.address}</p>
            <a href={`mailto:${prestataire.email}`}>{prestataire.email}</a>
          </div>
        </div>
        <div className="provider-calendar">
          <h2>Prestations proposées</h2>
          {prestataire.selectedPrestations.length > 0 ? (
            prestataire.selectedPrestations.map((prestation, index) => (
              <div key={index} className="prestation-item">
                <p>
                  <strong>
                    {prestations[prestation.prestationId] ||
                      'Prestation inconnue'}
                  </strong>
                </p>
                {prestation.selectedSousPrestations.length > 0 && (
                  <ul>
                    {prestation.selectedSousPrestations.map(
                      (sousPrestationId, idx) => (
                        <li key={idx}>
                          {sousPrestations[sousPrestationId] ||
                            'Sous-prestation inconnue'}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p>Aucune prestation trouvée.</p>
          )}
          <Link
            to={`/crenaux/${prestataire._id}`}
            state={{ prestataire, prestations, sousPrestations }}
          >
            <button>Contacter</button>
          </Link>
        </div>
      </section>

      {/* Section Réalisations */}

      <div className="realisation-section">
        <h2>Réalisations</h2>
        <div className="tabs">
          <button
            className={activeTab === 'images' ? 'active' : ''}
            onClick={() => setActiveTab('images')}
          >
            IMAGES
          </button>
          <button
            className={activeTab === 'videos' ? 'active' : ''}
            onClick={() => setActiveTab('videos')}
          >
            VIDÉOS
          </button>
        </div>

        <div className="content">
          {activeTab === 'images' && (
            <div className="images-grid">
              <img src="/images/brush.jpeg" alt=" 1" />
              <img src="/images/champagne.jpeg" alt=" 2" />
              <img src="/images/decor-violet.jpeg" alt=" 3" />
              <img src="/images/evenementielle.jpg" alt=" 4" />
              <img src="/images/decor-marron-vert.jpeg" alt=" 5" />
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="videos-grid">
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
              </video>
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
              </video>
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
              </video>
              <video controls>
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
