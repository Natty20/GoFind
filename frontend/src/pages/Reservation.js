import React, { useEffect, useState } from 'react';

const ListeDemandesPrestataire = ({ prestataireId }) => {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    fetch(`/api/reservations/prestataire/${prestataireId}`)
      .then((res) => res.json())
      .then((data) => setDemandes(data))
      .catch((error) => console.error('Erreur:', error));
  }, [prestataireId]);

  return (
    <main className="reservation">
      <div>
        <h2>Demandes Reçues</h2>
        <ul>
          {demandes.map((demande) => (
            <li key={demande._id}>
              {demande.prestations.join(', ')} - {demande.date} à{' '}
              {demande.heure} - {demande.statut}
              <button>Accepter</button>
              <button>Refuser</button>
            </li>
          ))}
        </ul>
      </div>
      <section className="nouveau-rdv">
        <div className="rdv-header">
          <h1>Gestion de mes nouveau reservations</h1>
        </div>
        <div className="rdv-table">
          <table>
            <tr>
              <th>Coordonées du client</th>
              <th>Description</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
            <tr>
              <td>
                <img src="/images/gigi.jpg" alt="Profile" />
                <p className="name">Gihozo Nathalie</p>
                <p> 07 69 68 84 96</p>
              </td>
              <td>
                {' '}
                Création d&#39;une ambiance élégante et personnalisée pour votre
                grand jour.
              </td>
              <td>01 Juin 2025</td>
              <td className="actions">
                <button className="ok-btn">Accepter</button>
                <button className="no-btn">Decliner</button>
              </td>
            </tr>
            <tr>
              <td>
                <img src="/images/gigi.jpg" alt="Profile" />
                <p className="name">Gihozo Nathalie</p>
                <p> 07 69 68 84 96</p>
              </td>
              <td>
                {' '}
                Création d&#39;une ambiance élégante et personnalisée pour votre
                grand jour.
              </td>
              <td>01 Juin 2025</td>
              <td className="actions">
                <button className="ok-btn">Accepter</button>
                <button className="no-btn">Decliner</button>
              </td>
            </tr>
            <tr>
              <td>
                <img src="/images/gigi.jpg" alt="Profile" />
                <p className="name">Gihozo Nathalie</p>
                <p> 07 69 68 84 96</p>
              </td>
              <td>
                {' '}
                Création d&#39;une ambiance élégante et personnalisée pour votre
                grand jour.
              </td>
              <td>01 Juin 2025</td>
              <td className="actions">
                <button className="ok-btn">Accepter</button>
                <button className="no-btn">Decliner</button>
              </td>
            </tr>
          </table>
        </div>
      </section>

      <section className="rdv-accepter">
        <div className="rdv-header">
          <h1>mes rendez-vous acceptés</h1>
        </div>
        <div className="rdv-table">
          <table>
            <thead>
              <tr>
                <th>Information</th>
                <th>Notes</th>
                <th>Dates</th>
                <th>Mode de paiement</th>
                <th>avancement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour. <br></br> <button>Modifier</button>{' '}
                </td>
                <td className="rdv-date">
                  21 Novembre 2025 <br></br> <button>Modifier</button>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">commencer</option>
                    <option value="encours">en cours</option>
                    <option value="revoir">à revoir</option>
                    <option value="valider"> valider</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour. <button>Modifier</button>
                </td>
                <td className="rdv-date">
                  {' '}
                  01 Juin 2000 <button>Modifier</button>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">commencer</option>
                    <option value="encours">en cours</option>
                    <option value="revoir">à revoir</option>
                    <option value="valider"> valider</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour. <br></br> <button>Modifier</button>
                </td>
                <td className="rdv-date">
                  {' '}
                  04 Septembre 1994 <button>Modifier</button>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">commencer</option>
                    <option value="encours">en cours</option>
                    <option value="revoir">à revoir</option>
                    <option value="valider"> valider</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rdv-passer">
        <div className="rdv-header">
          <h1>mes rendez-vous passés</h1>
        </div>
        <div className="rdv-table">
          <table>
            <thead>
              <tr>
                <th>Coordonées</th>
                <th>Commentaire</th>
                <th>Mode de paiement</th>
                <th>facture</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="/images/gigi.jpg" alt="Profile" />
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>PDF</td>
              </tr>
              <tr>
                <td>
                  <img src="/images/gigi.jpg" alt="Profile" />
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>PDF</td>
              </tr>
              <tr>
                <td>
                  <img src="/images/gigi.jpg" alt="Profile" />
                  <p className="name">Gihozo Nathalie</p>
                  <p> 07 69 68 84 96</p>
                </td>
                <td>
                  Création d&#39;une ambiance élégante et personnalisée pour
                  votre grand jour.
                </td>
                <td>
                  <select className="dropdown">
                    <option value="commencer">Chèque</option>
                    <option value="encours">Paypal</option>
                    <option value="revoir">Especes</option>
                    <option value="valider"> Virement bancaire</option>
                  </select>
                </td>
                <td>PDF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rdv-annuler">
        <div className="rdv-header">
          <h1>Mes rendez-vous annulés</h1>
        </div>
        <div className="rdv-table">
          <table>
            <thead>
              <tr className="annuler-title">
                <th>Type de prestation</th>
                <th>Coordonées du client</th>
                <th>Dates</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="prestation-title">Décoration</td>
                <td>
                  <td className="coordonees-details">
                    <img src="/images/gigi.jpg" alt="Profile" />
                    <p className="name">Gihozo Nathalie</p>
                    <p> 07 69 68 84 96</p>
                  </td>
                </td>
                <td className="rdv-date">21 Novembre 2025</td>
              </tr>

              <tr>
                <td className="prestation-title">Organisation</td>
                <td>
                  <td className="coordonees-details">
                    <img src="/images/gigi.jpg" alt="Profile" />
                    <p className="name">Dukundane Dieumerci</p>
                    <p> 07 69 68 84 96</p>
                  </td>
                </td>
                <td className="rdv-date">21 Novembre 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ListeDemandesPrestataire;
