import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Client/Crenaux.css';

function Crenaux() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prestataire, setPrestataire] = useState(
    location.state?.prestataire || null
  );
  const [prestations] = useState(location.state?.prestations || {});
  const [sousPrestations] = useState(location.state?.sousPrestations || {});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('7h-12h (Disponible)');

  const hours = [
    '7h-12h (Disponible)',
    '12h-17h (Disponible)',
    '17h-22h (Disponible)',
  ];
  const [client, setClient] = useState(null);

  useEffect(() => {
    const storedClient = JSON.parse(localStorage.getItem('client'));
    if (storedClient) {
      setClient(storedClient);
    }
  }, []);

  useEffect(() => {
    if (!prestataire) {
      const fetchPrestataire = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2000/api/prestataires/${id}`
          );
          setPrestataire(response.data.prestataire);
        } catch (error) {
          console.error('Erreur lors de la récupération du prestataire', error);
        }
      };
      fetchPrestataire();
    }
  }, [id, prestataire]);

  const handleConfirmHour = () => {
    if (!client) {
      alert('Vous devez être connecté pour prendre un rendez-vous.');
      navigate('/login');
      return;
    }

    if (client.role === 'admin' || client.role === 'prestataire') {
      alert('Seuls les clients peuvent prendre un rendez-vous.');
      return;
    }

    navigate('/message', {
      state: {
        prestataire,
        client,
        prestations,
        sousPrestations,
        selectedDate: selectedDate.toISOString().split('T')[0],
        selectedHour,
      },
    });
  };

  return (
    <div className="App">
      <main>
        {prestataire && (
          <div className="profile">
            <img
              src={prestataire.profilePicture}
              alt={prestataire.nom}
              className="profile-picture"
            />
            <h2>{prestataire.nom}</h2>
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
          </div>
        )}

        <h3>Sélectionner Une Date</h3>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="custom-datepicker"
          minDate={new Date()}
        />

        <h3>Sélectionner Une Heure</h3>
        <div className="time-slots">
          {hours.map((hour, index) => (
            <button
              key={index}
              className={selectedHour === hour ? 'hour selected' : 'hour'}
              onClick={() => setSelectedHour(hour)}
            >
              {hour}
            </button>
          ))}
        </div>

        <button className="choose-time" onClick={handleConfirmHour}>
          Choisissez l&#39;horaire
        </button>
      </main>
    </div>
  );
}

export default Crenaux;
