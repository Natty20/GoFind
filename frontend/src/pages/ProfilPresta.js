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

  // const [activeTab, setActiveTab] = useState('images');
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const prestataireId = sessionStorage.getItem('prestataireId');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchPrestataireData = async () => {
      if (!prestataireId) {
        setError('Prestataire non connecté...');
        setLoading(false);
        return;
      }
      if (prestataire) return;

      try {
        const [prestaRes, prestationsRes] = await Promise.all([
          axios.get(
            `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
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
  }, [prestataireId, prestataire]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        profilePicture: formData.profilePicture,
      };

      // si mot de passe rempli → on ajoute au payload
      // if (formData.password && formData.password.trim() !== '') {
      //   payload.password = formData.password;
      // }

      const res = await axios.put(
        `https://gofind-v9ee.onrender.com/api/prestataires/${prestataireId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPrestataire(res.data.prestataire); // mettre à jour l'état local
      setIsEditing(false);
      alert('Information(s) mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      alert('❌ Impossible de mettre à jour votre profil.');
    }
  };

  const sousPrestationsChoisies = [];
  prestataire?.selectedPrestations.forEach((item) => {
    const prestation = allPrestations.find((p) => p._id === item.prestationId);
    if (!prestation) return;

    item.selectedSousPrestations.forEach((sousId) => {
      const sous = prestation.sousPrestations.find((s) => s._id === sousId);
      if (sous) {
        sousPrestationsChoisies.push({
          prestationNom: prestation.nom,
          sousId: sous._id,
          sousNom: sous.title,
          description: sous.longDescription,
          prix: sous.prix || '',
        });
      }
    });
  });

  const addTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, inputValue]);
      setInputValue('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTask();
  };

  if (loading) return <p>Chargement des informations...</p>;
  if (error)
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <main className="compte-presta">
      <section className="info">
        <div className="info-presta">
          <img
            src={formData.profilePicture || 'https://via.placeholder.com/80'}
            alt={`Photo de profil de ${formData.nom} ${formData.prenom}`}
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
              <p className="span">32 Réalisations</p>
              <p className="location">
                <FaMapMarkerAlt />{' '}
                {prestataire.address || 'Adresse non renseignée'}
              </p>
              <p>
                <strong>Email : {prestataire.email}</strong>
              </p>
              <p>Téléphone : {prestataire.phone || 'Non renseigné'}</p>
              <div className="description">
                <h3>Ma description</h3>
                {/* <p>Morem ipsum dolor sit amet...</p> */}
                <button onClick={() => setIsEditing(true)}>Modifier</button>
              </div>
            </div>
          ) : (
            <div className="form-edit">
              <p className="label">Nom: </p>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Nom"
              />

              <p className="label">Prénom: </p>
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Prénom"
              />

              <p className="label">Email: </p>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />

              <p className="label">Phone: </p>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Téléphone"
              />

              <p className="label">Address: </p>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />

              <p className="label">Photp de profile: </p>
              <input
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="URL de la photo de profil"
              />
              <button onClick={handleSave}>Enregistrer</button>
              <button onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
          )}
        </div>
      </section>

      {/* <section className="presta-realisation">
        <div className="realisation-header">
          <h4>Mes Réalisations</h4>
          <button>Ajouter une Réalisation</button>
        </div>
        <div className="realisation-section">
          <div className="tabs">
            <button
              className={activeTab === 'images' ? 'active' : ''}
              onClick={() => setActiveTab('images')}
            >
              IMAGES
            </button>
            <button
              className={activeTab === 'videos' ? 'active' : ''}
              onClick={() => setActiveTab('videos')}
            >
              VIDÉOS
            </button>
          </div>

          <div className="content">
            {activeTab === 'images' && (
              <div className="images-grid">
                <img src="/images/brush.jpeg" alt=" 1" />
                <img src="/images/champagne.jpeg" alt=" 2" />
                <img src="/images/decor-violet.jpeg" alt=" 3" />
                <img src="/images/evenementielle.jpg" alt=" 4" />
                <img src="/images/decor-marron-vert.jpeg" alt=" 5" />
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="videos-grid">
                <video controls>
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                </video>
                <video controls>
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                </video>
                <video controls>
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                </video>
                <video controls>
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="clients-avis">
        <main className="provider-reviews">
          <h2>Avis des Clients</h2>
          <button>supprimer une avis</button>
          <section className="review">
            <div className="review-info">
              <img
                src="/images/gigi.jpg"
                alt="Prestataire"
                className="client-image"
              />
              <h3>Gihozo Nathalie</h3>
            </div>
            <p>
              Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh
              Bhbezyubyu Yzhsuyh...
            </p>
            <span>26 Janv, 2024</span>
          </section>
          <button>supprimer une avis</button>
          <section className="review">
            <div className="review-info">
              <img
                src="/images/gigi.jpg"
                alt="Prestataire"
                className="client-image"
              />
              <h3>Gihozo Nathalie</h3>
            </div>
            <p>
              Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh
              Bhbezyubyu Yzhsuyh...
            </p>
            <span>26 Janv, 2024</span>
          </section>
          <button>supprimer une avis</button>
          <section className="review">
            <div className="review-info">
              <img
                src="/images/gigi.jpg"
                alt="Prestataire"
                className="client-image"
              />
              <h3>Gihozo Nathalie</h3>
            </div>
            <p>
              Hdfhu Hzygfg Behid ljfue Efjhuhg luhfhg lujf lhuhf ljju luhuh
              Bhbezyubyu Yzhsuyh...
            </p>
            <span>26 Janv, 2024</span>
          </section>
          <a href="/avis">Voir Tous Les Avis</a>
        </main>
      </section>

      <section className="todo">
        <div className="todo-container">
          <h1>To-Do List</h1>
          <div className="todo-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ajouter une tâche..."
            />
            <button onClick={addTask}>Ajouter</button>
          </div>
          <ul className="todo-list">
            {tasks.map((task, index) => (
              <li key={index} className="todo-item">
                <span>{task}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(index)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section> */}
    </main>
  );
};

export default ProfilPresta;
