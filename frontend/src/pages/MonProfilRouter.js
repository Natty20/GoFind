// import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MonProfilRouter = () => {
  const { client, prestataire, admin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (client) {
      navigate('/profil-client');
    } else if (prestataire) {
      navigate('/profil-prestataire');
    } else if (admin) {
      navigate('/dashboard');
    } else {
      navigate('/choix_compte');
    }
  }, [client, prestataire, admin, navigate]);

  return null;
};

export default MonProfilRouter;
