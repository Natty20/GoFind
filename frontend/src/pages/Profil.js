import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Client/Profil.css';

const ProfilePage = () => {
  const { id } = useParams();
  const [prestataire, setPrestataire] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);
  const [avis, setAvis] = useState([]);
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [note, setNote] = useState(0);
  const [hoverNote, setHoverNote] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const isPrestataire = role === 'prestataire';

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

  useEffect(() => {
    const fetchAvis = async () => {
      if (!id) return;

      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');

      const headers = {};
      if (token && role !== 'prestataire') {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const res = await axios.get(
          `https://gofind-v9ee.onrender.com/api/avis/public`,
          { headers }
        );

        const avisPresta = res.data.avis.filter(
          (a) => a.prestataire?._id === id
        );

        setAvis(avisPresta);
      } catch (err) {
        if (err.response?.status === 403) {
          // Prestataire connecté → pas d'accès aux avis
          setAvis([]);
        } else {
          setError('Erreur lors du chargement des avis');
        }
      }
    };

    fetchAvis();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!prestataire) return <p className="error">Prestataire non trouvé.</p>;

  return (
    <main className="profile-page">
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
          {prestataire.selectedPrestations?.length > 0 ? (
            prestataire.selectedPrestations.map((prestation, index) => (
              <div key={index} className="prestation-item">
                <p>
                  <strong>
                    {prestation.prestationId.nom ||
                      prestations[prestation.prestationId._id] ||
                      'Prestation inconnue'}
                  </strong>
                </p>
                {prestation.selectedSousPrestations?.length > 0 && (
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
          <h3 className="tittles">À propos</h3>
          <p>{prestataire.description}</p>
        </section>
      )}

      {/* Section Réalisations - uniquement images */}
      {prestataire?.realisations?.length > 0 && (
        <section className="realisation-section">
          <h4 className="tittles">Réalisations</h4>
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
        </section>
      )}
      {/* sections des avis de prestataire */}
      {prestataire && !isPrestataire && (
        <section className="clients-avis">
          <div className="provider-reviews">
            <h5 className="tittles">Avis des Clients</h5>

            {avis.length === 0 && (
              <p style={{ color: '#fff' }}>Aucun avis pour le moment.</p>
            )}

            {avis.map((a) => (
              <div className="review" key={a._id}>
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>

                <div className="review-info">
                  <img
                    src={
                      a.auteur?.profilePicture ||
                      'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
                    }
                    alt="Client"
                    className="client-image"
                  />

                  <div>
                    <p>{a.auteur?.prenom}</p>

                    <div className="stars-display">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={i <= a.note ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p>{a.commentaire}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BOUTON AJOUT AVIS */}
      {role === 'client' && (
        <button
          className="btn-secondary"
          style={{ marginTop: '30px' }}
          onClick={() => setShowAvisForm(true)}
        >
          Laisser un avis
        </button>
      )}

      {showAvisForm && (
        <div className="avis-modal">
          <div className="avis-form">
            <h1>Laisser un avis</h1>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={i <= (hoverNote || note) ? 'star filled' : 'star'}
                  onClick={() => setNote(i)}
                  onMouseEnter={() => setHoverNote(i)}
                  onMouseLeave={() => setHoverNote(0)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Votre avis..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={5}
            />

            <div className="avis-actions">
              <button
                className="btn-secondary"
                onClick={async () => {
                  try {
                    const payload = {
                      prestataireId: id,
                      commentaire,
                    };

                    if (note > 0) {
                      payload.note = note;
                    }
                    await axios.post(
                      `https://gofind-v9ee.onrender.com/api/avis`,
                      payload,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );

                    setShowAvisForm(false);
                    setCommentaire('');
                    setNote(0);
                    window.location.reload();
                  } catch (err) {
                    alert("Impossible d'enregistrer votre avis!");
                  }
                }}
              >
                Envoyer
              </button>

              <button
                className="btn-primary"
                onClick={() => setShowAvisForm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
