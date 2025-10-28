// src/components/MentionsLegales.js
import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/All/Mentions.css';

const MentionsLegales = () => {
  return (
    <div className="mentions-page">
      <Helmet>
        <title>Mentions Légales - GoFind</title>
        <meta
          name="description"
          content="Mentions légales et informations légales sur GoFind, plateforme de mise en relation entre clients et prestataires"
        />
      </Helmet>

      <section className="mentions-container">
        <h1 className="mentions-title">Mentions Légales</h1>
        <p>
          <strong>Dernière mise à jour :</strong> 01 Octobre, 2025
        </p>

        <h2>1️⃣ Informations sur l’éditeur du site</h2>
        <p>
          <strong>Nom de l’entreprise :</strong> GoFind
        </p>
        <p>
          <strong>Forme juridique :</strong> Auto-entrepreneur
        </p>
        <p>
          <strong>Adresse du siège social :</strong> 2 Rue Paul Gauguin 91600,
          Savigny-sur-orge
        </p>
        <p>
          <strong>Numéro SIRET :</strong> 99322406200014
        </p>
        <p>
          <strong>Responsable de publication :</strong> Gihozo Nathalie
        </p>
        <p>
          <strong>Email de contact :</strong> giginatty20@gmail.com
        </p>

        <h2>2️⃣ Hébergement du site</h2>
        <p>
          <strong>Hébergeur :</strong> GitHub Pages / OVH / Render
        </p>
        <p>
          <strong>Adresse :</strong>{' '}
        </p>

        <h2>3️⃣ Propriété intellectuelle</h2>
        <p>
          L’ensemble du contenu présent sur le site GoFind (textes, images,
          logos, icônes, vidéos…) est protégé par le Code de la Propriété
          Intellectuelle.
        </p>
        <p>
          Toute reproduction, modification ou diffusion, même partielle, est
          strictement interdite sans autorisation écrite préalable.
        </p>

        <h2>4️⃣ Services proposés</h2>
        <p>
          GoFind facilite la mise en relation entre prestataires et
          utilisateurs. La plateforme n’est pas responsable des prestations
          réalisées par les professionnels inscrits. Toute transaction est sous
          la responsabilité de l’utilisateur et du prestataire choisi.
        </p>

        <h2>5️⃣ Données personnelles & Cookies</h2>
        <p>
          Pour plus d’informations concernant la gestion des données
          personnelles et l’utilisation des cookies, veuillez consulter notre{' '}
          <a href="/politique-confidentialite">Politique de Confidentialité</a>{' '}
          (RGPD).
        </p>

        <h2>6️⃣ Limitation de responsabilité</h2>
        <p>
          GoFind met en œuvre tous les moyens raisonnables pour assurer
          l’exactitude des informations, mais aucune garantie n’est fournie sur
          l’exactitude, la complétude ou l’actualité des données.
        </p>

        <h2>7️⃣ Signalement de contenu illicite</h2>
        <p>
          Pour tout signalement de violation de droits ou contenu illicite :{' '}
          <strong>giginatty20@gmail.com</strong>
        </p>

        <h2>8️⃣ Contact</h2>
        <p>
          Pour toute demande : <strong>giginatty20@gmail.com</strong>
        </p>
        <p>France – Disponible partout 🌍</p>
      </section>
    </div>
  );
};

export default MentionsLegales;
