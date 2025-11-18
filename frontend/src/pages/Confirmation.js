import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Client/Confirmation.css';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    prestataire,
    client,
    selectedDate,
    selectedHour,
    prestations,
    sousPrestations,
  } = location.state || {};
  const [description, setDescription] = useState('');
  const [selectedPrestations, setSelectedPrestations] = useState([]);

  // 🔍 Vérification des données reçues
  // console.log('📌 Données reçues :', location.state);

  // Met à jour `selectedPrestations` avec les données du prestataire sélectionné
  useEffect(() => {
    if (prestataire?.selectedPrestations) {
      const formattedPrestations = prestataire.selectedPrestations.map(
        (prestation) => ({
          prestationId: prestation.prestationId,
          prestationNom:
            prestations?.[prestation.prestationId] || 'Prestation inconnue',
          selectedSousPrestations: prestation.selectedSousPrestations.map(
            (sousPrestationId) => ({
              sousPrestationId,
              sousPrestationNom:
                sousPrestations?.[sousPrestationId] ||
                'Sous-prestation inconnue',
            })
          ),
        })
      );

      setSelectedPrestations(formattedPrestations);
      // console.log('📦 Prestations sélectionnées :', formattedPrestations);
    } else {
      console.warn(
        'Aucune prestation sélectionnée ou prestataire inexistant !'
      );
    }
  }, [prestataire, prestations, sousPrestations]);

  // Fonction pour envoyer les données sélectionnées vers la page de paiement
  const handleConfirm = () => {
    navigate('/paiement', {
      state: {
        prestataire,
        client,
        selectedDate,
        selectedHour,
        prestations: selectedPrestations, // ✅ Envoi des prestations sélectionnées
        description,
        montant: 30,
      },
    });
  };

  return (
    <main className="confirmation-page">
      <div className="confirmation-container">
        <div className="presta-profile">
          <img
            src={prestataire?.profilePicture || '/images/gigi.jpg'}
            alt={prestataire?.nom || 'Prestataire inconnu'}
            className="confirmation-profile-picture"
          />
          <h1 className="tittles">
            {prestataire?.nom || 'Prestataire inconnu'} {prestataire?.prenom}
          </h1>
        </div>

        <div className="note">
          <h2>
            <strong>Note: </strong>Votre demande de Rendez-Vous est maintenant
            en attente
          </h2>
        </div>

        <div className="appointment">
          <div className="appointment-details">
            {selectedPrestations.length > 0 ? (
              selectedPrestations.map((prestation, index) => (
                <div key={index} className="prestation-item">
                  <p>
                    <strong>{prestation.prestationNom}</strong>
                  </p>
                  {prestation.selectedSousPrestations.length > 0 && (
                    <ul>
                      {prestation.selectedSousPrestations.map(
                        (sousPrestation, idx) => (
                          <li key={idx}>{sousPrestation.sousPrestationNom}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p>Aucune prestation trouvée.</p>
            )}
            <p>
              {selectedDate} - {selectedHour}
            </p>
          </div>
        </div>

        <div className="textarea-container">
          <label htmlFor="custom-textarea">Précisions particulières:</label>
          <textarea
            id="custom-textarea"
            className="custom-textarea"
            placeholder="Entrez votre texte ici..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button className="btn-secondary" onClick={handleConfirm}>
          Confirmer et payer
        </button>
      </div>
    </main>
  );
};

export default Confirmation;
