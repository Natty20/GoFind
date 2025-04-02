import React, { useEffect, useState } from 'react';
import '../styles/Client/Sous-prestation.css';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const SousPrestation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [sousPrestation, setSousPrestation] = useState(null);
  const [prestataires, setPrestataires] = useState([]);
  const [autresSousPrestations, setAutresSousPrestations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSousPrestation(null);
    setPrestataires([]);
    setAutresSousPrestations([]);
    setError(null);
    setLoading(true);

    const fetchSousPrestation = async () => {
      try {
        const response = await axios.get(
          `http://149.202.53.181:2000/api/sousprestations/${id}` // `http://localhost:2000/api/sousprestations/${id}`
        );
        const sousPrestationData = response.data.sousPrestation;
        setSousPrestation(sousPrestationData);

        // verifier la presence de prestataire puis recup les presta lies a cette souspresta
        if (
          Array.isArray(sousPrestationData.prestataires) &&
          sousPrestationData.prestataires.length > 0
        ) {
          // console.log("prestataire trouvés:", sousPrestationData.prestataires);
          fetchPrestataires(sousPrestationData.prestataires);
        } else {
          console.log('aucune prestataire disponible');
        }

        fetchAutresSousPrestations(response.data.sousPrestation.prestation);
      } catch (err) {
        console.error(
          'Erruer lors du chargement de la sous-prestation  : ',
          err
        );
        setError('Erreur lors du chargement de la sous-prestation.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPrestataires = async (prestataireIds) => {
      console.log("Envoi des IDs des prestataires à l'API :", prestataireIds);
      if (!prestataireIds || prestataireIds.length === 0) {
        console.log('aucun id de prestataire reçu!');
        return;
      }

      try {
        const response = await axios.post(
          'http://149.202.53.181:2000/api/prestataires/multiple', // 'http://localhost:2000/api/prestataires/multiple',
          {
            ids: prestataireIds,
          }
        );
        setPrestataires(response.data.prestataires);
      } catch (err) {
        console.error('Erreur lors du chargement de prestataires', err);
        setPrestataires([]);
      }
    };

    const fetchAutresSousPrestations = async (prestationId) => {
      if (!prestationId) return;
      try {
        const response = await axios.get(
          `http://149.202.53.181:2000/api/sousprestations/prestation/${prestationId}` // `http://localhost:2000/api/sousprestations/prestation/${prestationId}`
        );

        // enlever la sous-prestation actuelle
        const filteredPrestations = response.data.sousPrestations.filter(
          (sp) => sp._id !== id
        );
        setAutresSousPrestations(filteredPrestations);
      } catch (err) {
        console.error(
          'Erreur lors du chargement des autres sous-prestations',
          err
        );
      }
    };

    fetchSousPrestation();
  }, [id]);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!sousPrestation)
    return <p className="error">Sous-prestation non trouvée.</p>;

  return (
    <div className="SousPrestation">
      <Helmet>
        <title>
          {' '}
          Découvrez nos Sous-Prestations - Réservez un Prestataire Qualifié |
          GoFind
        </title>
        <meta
          name="description"
          content="Trouvez les meilleurs prestataires pour chaque sous-prestation : maquillage, coiffure, photographie de mariage, décoration florale, traiteur événementiel et bien plus. Réservez facilement sur GoFind."
        />
        <meta
          name="keywords"
          content="sous-prestations, services professionnels, maquillage, coiffure, photographie, décoration, traiteur, mariage, événementiel, prestataire qualifié, réservation en ligne"
        />
      </Helmet>
      {/* Section principale */}
      <section className="main-section">
        <div className="image-container">
          <img
            src={sousPrestation.backgroundImage}
            alt={sousPrestation.shortDescription}
            className="main-image"
          />
        </div>
        <div className="text-container">
          <h2>{sousPrestation.title}</h2>
          <p>{sousPrestation.longDescription}</p>
        </div>
      </section>

      {/* Section des prestataires */}
      <section className="prestataires-section">
        <h3>Découvrez nos prestataires dans {sousPrestation.nom}</h3>
        <div className="prestataires-list">
          {prestataires.length > 0 ? (
            prestataires.map((prestataire) => (
              <div key={prestataire._id} className="prestataire-card">
                <div className="prestataire-image">
                  <img src={prestataire.profilePicture} alt={prestataire.nom} />
                </div>
                <Link to={`/profil/${prestataire._id}`}>
                  <div className="prestataire-info">
                    <h4>{prestataire.nom}</h4>
                    <p>{prestataire.phone}</p>
                    <p>{prestataire.realisations}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucun prestataire trouvé.</p>
          )}
        </div>
      </section>

      {/* Section des autres sous-prestations de la même prestation */}
      <section className="other-categories">
        <h3>Autres prestations dans {sousPrestation.prestation}</h3>
        <div className="categories-list">
          {autresSousPrestations.length > 0 ? (
            autresSousPrestations.map((sousP) => (
              <div key={sousP._id} className="category-card">
                <Link to={`/sous-prestation/${sousP._id}`}>
                  <img
                    src={sousP.profileImage}
                    alt={sousP.shortDescription}
                    className="category-image"
                  />
                  <p>{sousP.nom.toUpperCase()}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucune autre prestation disponible.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SousPrestation;
