import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/Client/Prestation.css';

const Prestation = () => {
  const [activeCategory, setActiveCategory] = useState('Événementielle');
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT = 'http://localhost:2000/api/prestations';
  const SOUS_ENDPOINT = 'http://localhost:2000/api/sousprestations';

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.prestations || [];
        setPrestations(data);
      } catch (error) {
        console.error('❌ Erreur chargement prestations :', error);
        setError('Erreur chargement prestations.');
      }
    };

    fetchPrestations();
  }, []);

  useEffect(() => {
    const fetchSousPrestations = async () => {
      try {
        const response = await axios.get(SOUS_ENDPOINT);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.sousprestations || [];
        setSousPrestations(data);
      } catch (error) {
        console.error('❌ Erreur chargement sous-prestations :', error);
        setError('Erreur chargement sous-prestations.');
      } finally {
        setLoading(false);
      }
    };

    fetchSousPrestations();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const prestationActive = prestations.find((presta) => {
    return presta.nom.toLowerCase() === activeCategory.toLowerCase();
  });

  // Récupérer les sous-prestations liées à la prestation active
  const sousPrestationsActive = sousPrestations.filter((sous) => {
    return (
      sous.prestation &&
      sous.prestation.toString() === prestationActive?._id.toString()
    );
  });

  return (
    <main>
      <Helmet>
        <title>
          Nos Prestations - Trouvez le Prestataire Idéal pour Votre Besoin |
          GoFind
        </title>
        <meta
          name="description"
          content="Découvrez nos prestations : beauté, événementiel, artisanat, photographie, décoration, traiteur et bien plus encore. Réservez un professionnel qualifié en quelques clics sur GoFind."
        />
        <meta
          name="keywords"
          content="prestations, service, réservation, beauté, événementiel, artisanat, photographie, décoration, traiteur, animation, mariage, professionnel, prestataire qualifié"
        />
      </Helmet>
      <section className="app">
        <div className="types-categorie">
          {['Événementielle', 'Beauté', 'Artisanat', 'Photographie'].map(
            (cat) => (
              <button
                key={cat}
                className={`categorie ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            )
          )}
        </div>

        <section className="event">
          {prestationActive ? (
            <>
              <div className="hero">
                <img
                  src={prestationActive.profileImage || 'default.jpg'}
                  alt={prestationActive.shortDescription}
                  className="hero-image"
                />
                <div className="hero-text">
                  <p>
                    {prestationActive.longDescription ||
                      'Description indisponible'}
                  </p>
                </div>
              </div>

              <section className="services">
                <h2 className="services-title">
                  DÉCOUVREZ NOS TYPES DE PRESTATION POUR{' '}
                  {activeCategory.toUpperCase()}
                </h2>

                {sousPrestationsActive.length > 0 ? (
                  sousPrestationsActive.map((sous, index) => (
                    <Link to={`/sous-prestation/${sous._id}`} key={sous._id}>
                      <div
                        className={`service-row ${index % 2 !== 0 ? 'reverse' : ''}`}
                      >
                        <img
                          src={sous.profileImage || 'default.jpg'}
                          alt={sous.shortDescription || 'Nom'}
                          className="service-image"
                        />
                        <div className="service-text">
                          <h3>
                            {sous.nom ? sous.nom.toUpperCase() : 'Nom inconnu'}
                          </h3>
                          <p>{sous.longDescription || 'Pas de description'}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>
                    Aucune sous-prestation disponible pour cette prestation.
                  </p>
                )}
              </section>
            </>
          ) : (
            <p className="no-data">
              Aucune prestation disponible pour cette catégorie.
            </p>
          )}
        </section>
      </section>
    </main>
  );
};

export default Prestation;
