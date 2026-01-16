// HomePage.js
import React from 'react';
import '../styles/All/About.css';
import { Helmet } from 'react-helmet';

const AboutPage = () => {
  return (
    <main className="aboutPage">
      <Helmet>
        <title>GoFind - Trouvez et Réservez les Meilleurs Prestataires</title>
        <meta
          name="description"
          content="Trouvez rapidement des prestataires qualifiés autour de vous : décoration, mariage, traiteur, animation, beauté, artisanat et plus encore."
        />
        <meta
          name="keywords"
          content="prestataire, réservation, service, mariage, décoration, traiteur, photographe, artisanat, événementielle, beauté"
        />
      </Helmet>
      <section className="presentation">
        <img
          src={`${process.env.PUBLIC_URL}/images/GF-logo.png`}
          alt="GoFind - Plateforme de mise en relation entre clients et prestataires"
        />
        <h1 className="Title">Une idée née d’un besoin réel</h1>
        <p>
          Tout a commencé avec une frustration : passer des heures à chercher un
          bon prestataire, demander des recommandations partout, hésiter… <br />
          Alors nous avons imaginé GoFind — un endroit où chacun peut trouver
          facilement la bonne personne pour la bonne tâche.
          <br />
          Un réseau de talents locaux, de passionnés, de professionnels qui
          aiment leur métier autant que vous aimez bien être accompagné.
        </p>

        <p>
          GoFind est une plateforme conçue pour faciliter la mise en relation
          entre professionnels qualifiés et personnes en recherche de services
          fiables. Notre objectif est simple : vous aider à trouver rapidement
          le bon prestataire, au bon endroit, au bon moment.
        </p>

        <p>
          <strong>Notre mission :</strong> rendre la recherche de services aussi
          simple qu’une recherche sur votre téléphone. Vous tapez ce dont vous
          avez besoin, on vous montre qui peut vous aider près de chez vous.
          Aussi rapide que ça.
        </p>
        <span className="short">Ici, la priorité c’est vous. Toujours.</span>
      </section>
    </main>
  );
};

export default AboutPage;
