// src/components/Contact.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Veuillez indiquer votre nom.';
    if (!form.email.trim()) e.email = 'Veuillez indiquer votre e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'E-mail invalide.';
    if (!form.message.trim()) e.message = 'Veuillez écrire un message.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      setNotice('');
      return;
    }

    const to = 'giginatty20@gmail.com';
    const subject = encodeURIComponent(`Contact GoFind - ${form.name}`);
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    // Open mail client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    setNotice(
      "Votre client mail va s'ouvrir. Si rien ne se passe, copiez-collez l'adresse : giginatty20@gmail.com"
    );
  };

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact - GoFind</title>
        <meta
          name="description"
          content="Contactez l'équipe GoFind pour support, suggestions ou inscription de prestataire"
        />
      </Helmet>

      <section className="contact-container">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-lead">
          Une question ? Un besoin spécifique ? Une suggestion ? Écrivez-nous —
          nous répondrons rapidement.
        </p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Nom</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label>
            <span>E-mail</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="votre@exemple.com"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              placeholder="Votre message..."
            />
            {errors.message && (
              <small className="error">{errors.message}</small>
            )}
          </label>

          <div className="contact-actions">
            <button type="submit" className="btn-primary">
              Envoyer
            </button>
            <small className="helper">
              Ou écrivez directement à <strong>giginatty20@gmail.com</strong>
            </small>
          </div>

          {notice && <p className="notice">{notice}</p>}
        </form>
      </section>
    </div>
  );
};

export default Contact;
