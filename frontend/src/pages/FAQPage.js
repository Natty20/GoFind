import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/All/FAQ.css';

const FAQ = () => {
  return (
    <div className="faq-page">
      <Helmet>
        <title>FAQ - GoFind</title>
        <meta
          name="description"
          content="Questions fréquentes - GoFind : trouvez et réservez des prestataires locaux"
        />
      </Helmet>

      <section className="faq-container">
        <h1 className="faq-title">Questions fréquentes</h1>

        <div className="faq-item">
          <h2>Qu’est-ce que GoFind exactement ?</h2>
          <p>
            GoFind est une plateforme qui vous aide à trouver facilement des
            prestataires qualifiés autour de vous : événementiel, bien-être,
            maison, artisanat et bien plus encore.
          </p>
        </div>

        <div className="faq-item">
          <h2>GoFind est-il gratuit ?</h2>
          <p>
            Oui. La recherche et la consultation des prestataires sont
            totalement gratuites pour les utilisateurs.
          </p>
        </div>

        <div className="faq-item">
          <h2>Comment sont sélectionnés les prestataires ?</h2>
          <p>
            Chaque prestataire crée un profil détaillé. Nous vérifions
            manuellement certaines informations afin de garantir un niveau de
            confiance et de professionnalisme.
          </p>
        </div>

        <div className="faq-item">
          <h2>Puis-je contacter directement un prestataire ?</h2>
          <p>
            Oui. Vous pouvez échanger avec eux avant toute réservation pour
            poser vos questions et préciser vos besoins.
          </p>
        </div>

        <div className="faq-item">
          <h2>Puis-je laisser un avis après une prestation ?</h2>
          <p>
            Oui. Les avis aident la communauté et améliorent la qualité des
            services proposés.
          </p>
        </div>

        <div className="faq-item">
          <h2>Je suis prestataire : comment m’inscrire ?</h2>
          <p>
            Créez un compte, complétez votre profil professionnel et commencez à
            recevoir des demandes. Plus votre profil est complet, plus vous
            serez visible.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
