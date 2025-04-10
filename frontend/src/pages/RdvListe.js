import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // Exemple d'un contexte d'authentification
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Client/RdvListe.css';

const ListeRendezVous = () => {
  const { user } = useContext(AuthContext);
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { prestataire } = location.state || {};

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const response = await axios.get(
          `http://149.202.53.181:2000/api/reservations/client/${user.clientId}`
        );
        setRendezVous(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          'Une erreur est survenue lors de la récupération des rendez-vous.'
        );
        setLoading(false);
      }
    };

    if (user) {
      fetchRendezVous();
    }
  }, [user]);

  if (loading) {
    return <div>Chargement des rendez-vous...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // séparer les rendez-vous à venir et terminés
  const upcomingRendezVous = rendezVous.filter(
    (rdv) => new Date(rdv.date) > new Date()
  );
  const completedRendezVous = rendezVous.filter(
    (rdv) => new Date(rdv.date) <= new Date()
  );

  return (
    <main className="liste-rdv">
      <div className="liste-rendez-vous-container">
        <h2>Rendez-vous</h2>

        {/* Section des rendez-vous à venir */}
        <div className="upcoming">
          <h3>À venir</h3>
          {upcomingRendezVous.length > 0 ? (
            upcomingRendezVous.map((rdv) => (
              <div key={rdv._id} className="upcoming-appointment">
                <div className="upcoming-appointment-up">
                  <img src="/images/gigi.jpg" alt="Profile" />
                  <div className="presta-info">
                    <h4>{rdv.prestationNom}</h4>
                    <p>{rdv.prestataire.nom}</p>
                  </div>
                  <p className="prix">{rdv.montant}$</p>
                </div>
                <div className="upcoming-appointment-down">
                  <p>{new Date(rdv.date).toLocaleDateString()}</p>
                  <p>{rdv.heure}</p>
                  <div className="upcoming-appointment-paiement">
                    <p>
                      Mode de paiement: <strong>{rdv.modePaiement}</strong>
                    </p>
                  </div>
                </div>
                <div className="upcoming-appointment-buttons">
                  <button className="reporter">Reporter</button>
                  <Link to={`/profil/${prestataire._id}`}>
                    <button className="rdv-terminer-contacter">
                      Contactez-la
                    </button>
                  </Link>
                  <button className="supprimer">Supprimer</button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun rendez-vous à venir.</p>
          )}
        </div>

        {/* Section des rendez-vous terminés */}
        <div className="termines">
          <h3>Terminés</h3>
          {completedRendezVous.length > 0 ? (
            completedRendezVous.map((rdv) => (
              <div key={rdv._id} className="appointment-termines">
                <div className="appointment-termines-up">
                  <img src="/images/gigi.jpg" alt="Profile" />
                  <div className="presta-info">
                    <h4>{rdv.prestationNom}</h4>
                    <p>{rdv.prestataire.nom}</p>
                  </div>
                  <p className="prix">{rdv.montant}$</p>
                </div>
                <div className="appointment-termines-down">
                  <p>Comment s&#39;est passée votre prestation ?</p>
                  <Link to={`/profil/${prestataire._id}`}>
                    <button className="rdv-terminer-contacter">
                      Contactez-la
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun rendez-vous terminé.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ListeRendezVous;
