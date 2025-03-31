import React, { useState } from 'react';
import '../styles/Prestataire/ProfilPresta.css';

const ProfilPresta = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
    if (e.key === 'Enter') {
      addTask();
    }
  };
  return (
    <main className="compte-presta">
      <section className="info">
        <div className="info-presta">
          <img src="/images/gigi.jpg" alt="Profile" />
          <div className="presta-names">
            <h1>Ivana-Fiat IYAKAREMYE</h1>
            <h2>Décoratrice et Organisatrice</h2>
            <p className="span">32 Réalisations</p>
            <p>6 rue Françoise d&#39;amboise, 28100 Dreux</p>
            <p>
              <strong> ivanafiat@gmail.com</strong>
            </p>
          </div>
          <div className="description">
            <h1>Ma description</h1>
            <p>
              {' '}
              Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Morem
              ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
              libero et velit interdum, ac aliquet odio mattis. Morem ipsum
              dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
              et velit interdum, ac aliquet odio mattis.
            </p>
            <button>Modifier</button>
          </div>
        </div>
      </section>

      <section className="presta-services">
        <div className="services-header">
          <h1>Mes services</h1>
          <button> Ajouter une services</button>
        </div>
        <div className="service-table">
          <table>
            <thead>
              <tr>
                <th>Nom du service</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Décoration pour les marriages</td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td>à voir</td>
                <td className="actions">
                  <button className="edit-btn">Modifier</button>
                  <button className="delete-btn">Supprimer</button>
                </td>
              </tr>
              <tr>
                <td>Organisatrice de mariage</td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td></td>
                <td className="actions">
                  <button className="edit-btn">Modifier</button>
                  <button className="delete-btn">Supprimer</button>
                </td>
              </tr>
              <tr>
                <td>Decoration pour les anniversaires</td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td></td>
                <td className="actions">
                  <button className="edit-btn">Modifier</button>
                  <button className="delete-btn">Supprimer</button>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Isaac Newton</td>
                <td>200£</td>
                <td className="actions">
                  <button className="edit-btn">Modifier</button>
                  <button className="delete-btn">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="presta-realisation">
        <div className="realisation-header">
          <h1>Mes Réalisations</h1>
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
      </section>
    </main>
  );
};

export default ProfilPresta;
