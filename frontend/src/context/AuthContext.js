import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('client')) || null;
    } catch {
      return null;
    }
  });

  const [prestataire, setPrestataire] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('prestataire')) || null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('admin')) || null;
    } catch {
      return null;
    }
  });

  const loginClient = (userData) => {
    sessionStorage.removeItem('prestataire');
    sessionStorage.removeItem('admin');
    sessionStorage.setItem('client', JSON.stringify(userData));
    setClient(userData);
  };

  const loginPrestataire = (userData) => {
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('admin');
    sessionStorage.setItem('prestataire', JSON.stringify(userData));
    setPrestataire(userData);
  };

  const loginAdmin = (userData) => {
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('prestataire');
    sessionStorage.setItem('admin', JSON.stringify(userData));
    setAdmin(userData);
  };

  const INACTIVITY_TIMEOUT = 3600000;
  let inactivityTimer;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      setClient(null);
      setPrestataire(null);
      setAdmin(null);
      sessionStorage.removeItem('client');
      sessionStorage.removeItem('prestataire');
      sessionStorage.removeItem('admin');
      alert('Vous avez été déconnecté pour inactivité.');
      window.location.href = '/login';
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (client || prestataire || admin) {
      resetTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
    }

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [client, prestataire, admin]);

  return (
    <AuthContext.Provider
      value={{
        client,
        setClient,
        prestataire,
        setPrestataire,
        admin,
        setAdmin,
        loginClient,
        loginPrestataire,
        loginAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
