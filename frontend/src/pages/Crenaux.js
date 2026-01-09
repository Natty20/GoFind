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
  const [selectedHour, setSelectedHour] = useState('');
  const [client, setClient] = useState(null);

  // Récupération client depuis sessionStorage
  useEffect(() => {
    const storedClient = JSON.parse(sessionStorage.getItem('client'));
    if (storedClient) setClient(storedClient);
  }, []);

  // Récupération prestataire si non passé en state
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

  // Génère les créneaux horaires toutes les 2h en format HH:mm
  const getAvailableHours = (date) => {
    const hours = [];
    const start = 8; // 08:00
    const end = 20; // 20:00
    const now = new Date();

    for (let h = start; h <= end; h += 2) {
      // Ignorer les créneaux passés si c'est aujourd'hui
      if (date.toDateString() === now.toDateString() && h <= now.getHours())
        continue;

      const hourStr = h.toString().padStart(2, '0') + ':00';
      hours.push(hourStr);
    }
    return hours;
  };

  // Vérifie si l'heure sélectionnée est valide après changement de date
  useEffect(() => {
    const available = getAvailableHours(selectedDate);
    if (!available.includes(selectedHour)) {
      setSelectedHour(available[0] || '');
    }
  }, [selectedDate]);

  // Confirmer la réservation
  const handleConfirmHour = () => {
    if (!client) {
      alert(
        'Vous devez être connecté en tant que pour prendre un rendez-vous.'
      );
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (client.role === 'admin' || client.role === 'prestataire') {
      alert('Seuls les clients peuvent prendre un rendez-vous.');
      return;
    }

    if (!selectedDate || !selectedHour) {
      alert('Veuillez sélectionner une date et une heure.');
      return;
    }

    // Combiner date + heure
    const [hours, minutes] = selectedHour.split(':').map(Number);
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(hours, minutes, 0, 0);

    navigate('/confirmation', {
      state: {
        prestataire,
        client,
        prestations,
        sousPrestations,
        selectedDate: reservationDate.toISOString(),
        selectedHour,
      },
    });
  };

  return (
    <main className="crenaux">
      {prestataire && (
        <div className="crenaux-profile">
          <img
            src={
              prestataire.profilePicture ||
              'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt={prestataire.nom}
            className="crenaux-profile-picture"
          />
          <h1>{prestataire.nom}</h1>
          {prestataire.selectedPrestations.length > 0 ? (
            prestataire.selectedPrestations.map((prestation, index) => (
              <div key={index} className="prestation-item">
                <p>
                  <strong>
                    {prestation.prestationId?.nom || 'Prestation inconnue'}
                  </strong>
                </p>
                {prestation.selectedSousPrestations.length > 0 && (
                  <ul>
                    {prestation.selectedSousPrestations.map((ssp, idx) => (
                      <li key={idx}>
                        {ssp?.nom || 'Sous-prestation inconnue'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p>Aucune prestation trouvée.</p>
          )}
        </div>
      )}

      {/* Sélection date et heure */}
      <div className="date-picker">
        <h2 className="tittles">Sélectionner une Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          className="custom-datepicker"
        />

        <h3 className="tittles">Sélectionner Une Heure</h3>
        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          className="custom-hour-select"
        >
          {getAvailableHours(selectedDate).map((hour, index) => (
            <option key={index} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <button className="crenaux btn-secondary" onClick={handleConfirmHour}>
          Choisissez l&#39;horaire
        </button>
      </div>
    </main>
  );
}

export default Crenaux;
