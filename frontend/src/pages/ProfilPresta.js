import React, { useEffect, useState } from 'react';
import '../styles/Prestataire/ProfilPresta.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const ProfilPresta = () => {
  const [prestataire, setPrestataire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allPrestations, setAllPrestations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const prestataireId = sessionStorage.getItem('prestataireId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchPrestataireData = async () => {
      if (!prestataireId) {
        setError('Prestataire non connecté...');
        setLoading(false);
        return;
      }
      try {
        const [prestaRes, prestationsRes] = await Promise.all([
          axios.get(
            `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`https://gofind-v9ee.onrender.com/api/prestations`),
        ]);
        setPrestataire(prestaRes.data.prestataire);
        setFormData(prestaRes.data.prestataire);
        setAllPrestations(prestationsRes.data.prestations);
      } catch (err) {
        setError('Erreur lors du chargement des informations.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrestataireData();
  }, [prestataireId, token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, profilePicture: file });
  };

  const uploadImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.post(
      'https://gofind-v9ee.onrender.com/api/upload/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return res.data.url;
  };

  // Upload Réalisation
  const handleUploadRea = async () => {
    try {
      if (!file) {
        alert('⚠️ Veuillez choisir un fichier avant de valider !');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const uploadRes = await axios.post(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataire._id}/realisations`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPrestataire(uploadRes.data.prestataire);
      setFile(null);
      alert('✅ Réalisation ajoutée avec succès !');
    } catch (err) {
      console.error(
        "Erreur lors de l'ajout de la réalisation :",
        err.response?.data || err
      );
      alert("❌ Impossible d'ajouter la réalisation. Réessayez.");
    }
  };

  // Supprimer une réalisation
  const handleDeleteRea = async (imageUrl) => {
    try {
      const res = await axios.delete(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataire._id}/realisations/${encodeURIComponent(imageUrl)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPrestataire(res.data.prestataire);
      alert('✅ Réalisation supprimée !');
    } catch (err) {
      console.error(
        'Erreur lors de la suppression :',
        err.response?.data || err
      );
      alert('❌ Impossible de supprimer la réalisation.');
    }
  };

  //  Sauvegarde profil
  const handleSave = async () => {
    try {
      let profilePictureUrl = formData.profilePicture;
      if (formData.profilePicture instanceof File) {
        profilePictureUrl = await uploadImageToBackend(formData.profilePicture);
      }

      const payload = {
        nom: formData.nom || prestataire.nom,
        prenom: formData.prenom || prestataire.prenom,
        email: formData.email || prestataire.email,
        phone: formData.phone || prestataire.phone || '',
        address: formData.address || prestataire.address || '',
        description: formData.description || prestataire.description || '',
        profilePicture: profilePictureUrl || prestataire.profilePicture || '',
      };

      const res = await axios.put(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrestataire(res.data.prestataire);
      setFormData(res.data.prestataire);
      setIsEditing(false);
      alert('✅ Profil mis à jour !');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('❌ Impossible de mettre à jour le profil.');
    }
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <main className="compte-presta">
      <section className="info">
        <div className="info-presta">
          <img
            src={
              typeof formData.profilePicture === 'string'
                ? formData.profilePicture
                : URL.createObjectURL(formData.profilePicture) ||
                  'https://www.swendoperio.com/wp-content/uploads/2019/11/person-icon.png'
            }
            alt={`Photo de ${formData.nom} ${formData.prenom}`}
            className="profile-pic"
          />

          {!isEditing ? (
            <div className="presta-names">
              <h1>
                {prestataire.nom} {prestataire.prenom}
              </h1>
              <h2>
                Prestation(s) :{' '}
                {prestataire.selectedPrestations
                  .map((item) => {
                    const prestation = allPrestations.find(
                      (p) => p._id === item.prestationId
                    );
                    return prestation ? prestation.nom : null;
                  })
                  .filter(Boolean)
                  .join(' • ')}
              </h2>
              <p>
                <strong>Email : {prestataire.email}</strong>
              </p>
              <p>Téléphone : {prestataire.phone || 'Non renseigné'}</p>

              <p className="location">
                <FaMapMarkerAlt />{' '}
                {prestataire.address || 'Adresse non renseignée'}
              </p>
              <p className="span">
                {prestataire.realisations?.length || 0} Réalisations
              </p>

              <button
                className="btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
            </div>
          ) : (
            <div className="form-edit">
              <input
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Nom"
              />
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Prénom"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Téléphone"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Présentez votre activité, votre expérience, vos spécialités..."
                rows={5}
                maxLength={1500}
              />

              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
              />
              {formData.profilePicture && (
                <img
                  src={
                    typeof formData.profilePicture === 'string'
                      ? formData.profilePicture
                      : URL.createObjectURL(formData.profilePicture)
                  }
                  alt="Preview"
                  style={{
                    width: '50px',
                    marginTop: '10px',
                    borderRadius: '30px',
                  }}
                />
              )}
              <button className="btn-secondary" onClick={handleSave}>
                Enregistrer
              </button>
              <button
                className="btn-primary"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </section>
      {prestataire?.description?.length > 0 && (
        <section className="presta-description">
          <h2 className="tittles">À propos</h2>
          <p>{prestataire.description}</p>
        </section>
      )}

      <div className="realisations-container">
        <h3 className="tittles">Mes Réalisations</h3>

        {/* Upload d'une nouvelle réalisation */}
        <div className="add-realisation">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="btn-secondary" onClick={handleUploadRea}>
            Ajouter
          </button>
        </div>

        {/* Grille des réalisations existantes */}
        {prestataire?.realisations?.length > 0 ? (
          <div className="images-grid">
            {prestataire.realisations.map((imgUrl, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={imgUrl}
                  alt={`Réalisation ${index + 1}`}
                  className="realisation-img"
                />
                <button
                  className="btn-primary"
                  onClick={() => handleDeleteRea(imgUrl)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune réalisation pour le moment.</p>
        )}
      </div>

      {/* <section className="clients-avis"> <main className="provider-reviews"> <h2>Avis des Clients</h2> <button>supprimer une avis</button> <section className="review"> <div className="review-info"> <img src="/images/gigi.jpg" alt="Prestataire" className="client-image" /> <h3>Gihozo Nathalie</h3> </div> <p> Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh Bhbezyubyu Yzhsuyh... </p> <span>26 Janv, 2024</span> </section> <button>supprimer une avis</button> <section className="review"> <div className="review-info"> <img src="/images/gigi.jpg" alt="Prestataire" className="client-image" /> <h3>Gihozo Nathalie</h3> </div> <p> Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh Bhbezyubyu Yzhsuyh... </p> <span>26 Janv, 2024</span> </section> <button>supprimer une avis</button> <section className="review"> <div className="review-info"> <img src="/images/gigi.jpg" alt="Prestataire" className="client-image" /> <h3>Gihozo Nathalie</h3> </div> <p> Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh Bhbezyubyu Yzhsuyh... </p> <span>26 Janv, 2024</span> </section> <a href="/avis">Voir Tous Les Avis</a> </main> </section> */}
    </main>
  );
};

export default ProfilPresta;
