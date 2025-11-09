import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/Client/HomePage.css';

const HomePage = () => {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = 'https://gofind-v9ee.onrender.com/api/prestations';
  // https://gofind-v9ee.onrender.com/api/prestations

  useEffect(() => {
    const fetchPrestations = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const data = await response.json();
        setPrestations(Array.isArray(data) ? data : data.prestations || []);
      } catch (err) {
        console.error('❌ Erreur chargement prestations :', err);
        setError('Erreur lors du chargement des prestations.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestations();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Filtrer les prestations
  const categoriesTop = prestations.filter(
    (p) =>
      p.nom.toLowerCase() === 'événementielle' ||
      p.nom.toLowerCase() === 'beauté'
  );
  const categoriesBottom = prestations.filter(
    (p) =>
      p.nom.toLowerCase() === 'artisanat' ||
      p.nom.toLowerCase() === 'photographie'
  );

  return (
    <div className="homepage">
      <Helmet>
        <title>GoFind - Trouvez et Réservez les Meilleurs Prestataires</title>
        <meta
          name="description"
          content="Trouvez rapidement des prestataires qualifiés autour de vous : décoration, mariage, traiteur, animation, beauté, artisanat et plus encore."
        />
        <meta
          name="keywords"
          content="prestataire, réservation, service, mariage, décoration, traiteur, photographe, artisanat, événementielle, beauté"
        />
      </Helmet>
      <section className="gofind-presentation">
        <img
          src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
          alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
        />
        <h2 className="tittles">Simplifiez votre quotidien grâce à GoFind</h2>
        <p>
          La plateforme qui connecte clients et prestataires qualifiés. Avec
          plus de 20 millions de comptes professionnels sur les réseaux sociaux,
          il est difficile de s’y retrouver. GoFind centralise toutes les
          prestations de service en un seul endroit. Trouvez rapidement des
          prestataires qualifiés autour de vous, comparez les avis, et réservez
          en toute simplicité.
        </p>
        <Link to={'/prestation'}>
          {' '}
          <button className="btn-secondary">
            DÉCOUVRIR NOS PRESTATIONS
          </button>{' '}
        </Link>
      </section>

      {/* Beauté & Événementielle en premier */}
      {categoriesTop.map((presta) => (
        <section
          key={presta._id}
          className={`category ${presta.nom.toLowerCase()}`}
        >
          <h2 className="tittles">{presta.nom.toUpperCase()}</h2>
          <p>{presta.shortDescription}</p>
          <Link to={'/prestation'}>
            <button className="btn-primary">SAVOIR +</button>
            <button className="btn-secondary">RÉSERVER</button>
            <div className="buttons"></div>
          </Link>
          <img
            src={presta.profileImage || '/images/default.jpg'}
            alt={presta.shortDescription}
          />
        </section>
      ))}

      {/* Artisanat & Photographie en bas avec alternance droite/gauche */}
      <div className="artisanat-photographie-container">
        {categoriesBottom.map((presta, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={presta._id} className="artisanat">
              <div className="exeption-container">
                {isEven ? (
                  // Image à gauche, texte à droite
                  <>
                    <div className="artisanat-left">
                      <h2 className="tittles">{presta.nom.toUpperCase()}</h2>
                      <p>{presta.shortDescription}</p>
                      <Link to={'/prestation'}>
                        <button className="btn-primary">SAVOIR +</button>
                        <button className="btn-secondary">RÉSERVER</button>
                        <div className="buttons"></div>
                      </Link>
                      <img
                        src={presta.profileImage || '/images/default.jpg'}
                        alt={presta.shortDescription}
                        className={`${presta.nom.toLowerCase()}-image`}
                      />
                    </div>
                    <div
                      className="artisanat-photographie-right"
                      style={{
                        backgroundImage: `url(${presta.backgroundImage || '/images/default.jpg'})`,
                      }}
                    >
                      <div className="right-overlay">
                        <p>{presta.longDescription}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Image à droite, texte à gauche
                  <>
                    <div
                      className="artisanat-photographie-right"
                      style={{
                        backgroundImage: `url(${presta.backgroundImage || '/images/default.jpg'})`,
                      }}
                    >
                      <div className="right-overlay">
                        <p>{presta.longDescription}</p>
                      </div>
                    </div>
                    <div className="artisanat-left">
                      <h2 className="tittles">{presta.nom.toUpperCase()}</h2>
                      <p>{presta.shortDescription}</p>
                      <Link to={'/prestation'}>
                        <button className="btn-primary">SAVOIR +</button>
                        <button className="btn-secondary">RÉSERVER</button>
                        <div className="buttons"></div>
                      </Link>
                      <img
                        src={presta.profileImage || '/images/default.jpg'}
                        alt={presta.shortDescription}
                        className={`${presta.nom.toLowerCase()}-image`}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Section 6: Comment ça marche */}
      <section className="how-it-works">
        <div className="steps-header">
          <h2>Comment ça marche</h2>
          <p>
            Suivez ces étapes simples pour utiliser notre service facilement et
            efficacement.
          </p>
        </div>

        <div className="steps-container">
          {/* Étape 1 */}
          <div className="step">
            <span className="step-number">- 1 -</span>
            <div className="step-image-container">
              <img
                src="https://cdn.pixabay.com/photo/2022/02/20/21/21/tablet-7025355_1280.jpg"
                alt="Recherchez et trouvez une prestation et un prestataire sur GoFind"
                className="step-image"
              />
            </div>
            <Link to={'/prestation'}>
              {' '}
              <p className="step-description">Choisissez votre prestation</p>
            </Link>
          </div>

          {/* Étape 2 */}
          <div className="step">
            <span className="step-number">- 2 -</span>
            <div className="step-image-container">
              <img
                src="https://cdn.pixabay.com/photo/2017/12/02/14/38/contact-us-2993000_1280.jpg"
                alt="Contactez directement votre prestataire sur GoFind"
                className="step-image"
              />
            </div>
            <Link to={'/profil'}>
              {' '}
              <p className="step-description">Contactez votre prestataire</p>
            </Link>
          </div>

          {/* Étape 3 */}
          <div className="step">
            <span className="step-number">- 3 -</span>
            <div className="step-image-container">
              <img
                src="https://cdn.pixabay.com/photo/2014/03/22/22/17/phone-292994_1280.jpg"
                alt="Discutez avec votre prestataire via le chat GoFind"
                className="step-image"
              />
            </div>
            <Link to={'/message'}>
              {' '}
              <p className="step-description">Discuter dans le GoFind chat</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
