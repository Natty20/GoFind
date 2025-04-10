import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Login from './pages/Login';
import Register from './pages/Register';
import PrestaRegister from './pages/PrestaRegister';
import Navbar from './pages/Navbar';
import HomePage from './pages/HomePage';
import Prestation from './pages/Prestation';
import SousPrestation from './pages/SousPrestation';
import PrestaLogin from './pages/PrestaLogin';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Profil from './pages/Profil';
import Crenaux from './pages/Crenaux';
import Footer from './pages/Footer';
import Message from './pages/Message';
import Confirmation from './pages/Confirmation';
import Paiement from './pages/Paiement';
import Demande from './pages/Demande';
import RdvListe from './pages/RdvListe';
import ProfilClient from './pages/ProfilClient';
import CancelPage from './pages/CancelPage';
import SuccessPage from './pages/SuccessPage';
import AdminAddPage from './pages/AdminAddPage';
import AdminEditPage from './pages/AdminEditPage';
import AdminDetailsPage from './pages/AdminDetailsPage';

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/prestataire_register" element={<PrestaRegister />} />
            <Route path="/prestataire_login" element={<PrestaLogin />} />
            <Route path="/prestation" element={<Prestation />} />
            <Route path="/sous-prestation/:id" element={<SousPrestation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login_admin" element={<AdminLogin />} />
            <Route path="/profil/:id" element={<Profil />} />
            <Route path="/crenaux/:id" element={<Crenaux />} />
            <Route path="/message" element={<Message />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/paiement" element={<Paiement />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/admin/:entity/ajouter" element={<AdminAddPage />} />
            <Route
              path="/admin/:entity/modifier/:id"
              element={<AdminEditPage />}
            />
            <Route
              path="/admin/:entity/details/:id"
              element={<AdminDetailsPage />}
            />

            <Route path="/demande_envoye" element={<Demande />} />
            <Route path="/liste_de_rdv/:id" element={<RdvListe />} />
            <Route path="/mon-profil" element={<ProfilClient />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Routes>
          <Footer />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
