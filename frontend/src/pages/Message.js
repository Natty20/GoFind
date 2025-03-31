import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Client/Message.css';

const Messages = () => {
  const location = useLocation();
  const {
    prestataire,
    client,
    selectedDate,
    selectedHour,
    prestations,
    sousPrestations,
  } = location.state || {};

  // console.log('📌 Données reçues :', location.state);
  return (
    <div className="messages-container">
      <header className="messages-header">
        <div className="profile-section">
          <img
            src={prestataire?.profilePicture || '/images/default.jpg'}
            alt="profile"
            className="profile-img"
          />
          <span className="role">
            {prestataire?.nom || 'Prestataire inconnu'}
          </span>
        </div>
        <div className="date-section">
          <span className="date">
            <i className="fas fa-calendar-alt"></i>{' '}
            {selectedDate || 'Date non définie'} -{' '}
            {selectedHour || 'Heure non définie'}
          </span>
        </div>
      </header>

      <div className="messages-content">
        <div className="message-received">
          <img
            src={prestataire?.profilePicture || '/images/default.jpg'}
            alt="profile"
            className="profile-img"
          />
          <div className="message-box">Salut {client?.nom || ''}</div>
        </div>
        <div className="message-received">
          <img
            src={prestataire?.profilePicture || '/images/default.jpg'}
            alt="profile"
            className="profile-img"
          />
          <div className="message-box">
            À Quelle Heure Souhaitez-Vous Prendre Rendez-Vous?
          </div>
        </div>
        <div className="message-sent">
          <img
            src={client?.profilePicture || '/images/gigi.jpg'}
            alt="profile"
            className="profile-img"
          />
          <div className="message-box">Salut {prestataire?.nom || ''}</div>
        </div>
      </div>

      <Link
        to={'/confirmation'}
        state={{
          prestataire,
          client,
          prestations,
          sousPrestations,
          selectedDate,
          selectedHour,
        }}
      >
        <button className="confirm-button">Confirmer</button>
      </Link>
    </div>
  );
};

export default Messages;
