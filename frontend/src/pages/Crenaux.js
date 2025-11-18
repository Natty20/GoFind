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
  const [selectedHour, setSelectedHour] = useState('7h-12h');

  useEffect(() => {
    const available = getAvailableHours(selectedDate);
    if (!available.includes(selectedHour)) {
      setSelectedHour(available[0] || ''); // Choisit la première dispo
    }
  }, [selectedDate]);

  const hours = ['7h-12h', '12h-17h', '17h-22h'];
  const [client, setClient] = useState(null);

  useEffect(() => {
    const storedClient = JSON.parse(sessionStorage.getItem('client'));
    if (storedClient) {
      setClient(storedClient);
    }
  }, []);

  useEffect(() => {
    if (!prestataire) {
      const fetchPrestataire = async () => {
        try {
          const response = await axios.get(
            `https://gofind-v9ee.onrender.com/api/prestataires/${id}`
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
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (client.role === 'admin' || client.role === 'prestataire') {
      alert('Seuls les clients peuvent prendre un rendez-vous.');
      return;
    }

    navigate('/confirmation', {
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

  const getAvailableHours = (date) => {
    const now = new Date();
    const availableHours = [];

    hours.forEach((hour) => {
      const [startHourStr, endHourStr] = hour.split('-');
      const startHour = parseInt(startHourStr);
      const endHour = parseInt(endHourStr);

      // Si c'est aujourd'hui et que la plage est déjà passée, on l'ignore
      if (
        date.toDateString() === now.toDateString() &&
        endHour <= now.getHours()
      ) {
        return;
      }

      availableHours.push(hour);
    });

    return availableHours;
  };

  return (
    <main className="crenaux">
      {prestataire && (
        <div className="profile">
          <img
            src={
              prestataire.profilePicture ||
              'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt={prestataire.nom}
            className="profile-picture"
          />
          <h1>{prestataire.nom}</h1>
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

      <div className="date-picker">
        <h2 className="tittles">Sélectionner Une Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="custom-datepicker"
          minDate={new Date()}
        />

        <h3 className="tittles">Sélectionner Une Heure</h3>
        <div className="time-slots">
          {getAvailableHours(selectedDate).map((hour, index) => (
            <button
              key={index}
              className={selectedHour === hour ? 'hour selected' : 'hour'}
              onClick={() => setSelectedHour(hour)}
            >
              {hour}
            </button>
          ))}
        </div>

        <button className="crenaux btn-secondary" onClick={handleConfirmHour}>
          Choisissez l&#39;horaire
        </button>
      </div>
    </main>
  );
}

export default Crenaux;
