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
  // const [activeTab, setActiveTab] = useState('images');

  useEffect(() => {
    const fetchPrestataire = async () => {
      try {
        const response = await axios.get(
          `https://gofind-v9ee.onrender.com/api/prestataires/${id}`
        );
        setPrestataire(response.data.prestataire);
      } catch (err) {
        setError('Erreur lors du chargement des données du prestataire.');
      }
    };

    const fetchPrestationsEtSousPrestations = async () => {
      try {
        const prestationsRes = await axios.get(
          'https://gofind-v9ee.onrender.com/api/prestations'
        );
        const sousPrestationsRes = await axios.get(
          'https://gofind-v9ee.onrender.com/api/sousprestations'
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
            src={
              prestataire.profilePicture ||
              'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt={prestataire.nom}
            className="provider-image"
          />
          <div className="provider-info">
            <h1>
              {prestataire.nom} {prestataire.prenom}{' '}
            </h1>
            <p className="location">
              {prestataire.address || 'Adresse non renseignée'}
            </p>
            <a href={`mailto:${prestataire.email}`}>
              Email : {prestataire.email}
            </a>
            <p>Téléphone : {prestataire.phone || 'Non renseigné'}</p>
          </div>
        </div>
        <div className="presta-provider-calendar">
          <h2 className="tittles">Prestations proposées</h2>
          {prestataire.selectedPrestations.length > 0 ? (
            prestataire.selectedPrestations.map((prestation, index) => (
              <div key={index} className="prestation-item">
                <p>
                  <strong>
                    {prestation.prestationId.nom ||
                      prestations[prestation.prestationId._id] ||
                      'Prestation inconnue'}
                  </strong>
                </p>
                {prestation.selectedSousPrestations.length > 0 && (
                  <ul>
                    {prestation.selectedSousPrestations.map((ssp, idx) => (
                      <li key={idx}>
                        {ssp.nom ||
                          sousPrestations[ssp._id] ||
                          'Sous-prestation inconnue'}
                      </li>
                    ))}
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
            <button className="btn-secondary">Contacter</button>
          </Link>
        </div>
      </section>

      {prestataire?.description?.length > 0 && (
        <section className="provider-description">
          <h2 className="tittles">À propos</h2>
          <p>{prestataire.description}</p>
        </section>
      )}

      {/* Section Réalisations - uniquement images */}
      {prestataire?.realisations?.length > 0 && (
        <div className="realisation-section">
          <h3>Réalisations</h3>
          <div className="images-grid">
            {prestataire.realisations.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Réalisation ${index + 1}`}
                className="realisation-img"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
