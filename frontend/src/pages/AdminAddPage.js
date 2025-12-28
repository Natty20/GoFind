import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAddPage = () => {
  const { entity } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const adminId = sessionStorage.getItem('adminId');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* 🔹 data réservation */
  const [clients, setClients] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState({});

  /* 🔹 champs image */
  const imageFields = [
    'profilePicture',
    'profileImage',
    'backgroundImage',
    'overlayImage',
  ];

  const entityToEndpoint = {
    clients: 'auth',
    admins: 'admin',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires',
    reservations: 'reservations',
  };

  useEffect(() => {
    if (!adminId || !token) {
      alert('Accès non autorisé');
      navigate('/login');
    }
  }, [adminId, token, navigate]);

  /* -DATA (reservations)- */

  useEffect(() => {
    if (entity !== 'reservations') return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [clientsRes, prestatairesRes, prestationsRes, sousRes] =
          await Promise.all([
            axios.get('https://gofind-v9ee.onrender.com/api/auth/clients', {
              headers,
            }),
            axios.get('https://gofind-v9ee.onrender.com/api/prestataires', {
              headers,
            }),
            axios.get('https://gofind-v9ee.onrender.com/api/prestations'),
            axios.get('https://gofind-v9ee.onrender.com/api/sousprestations', {
              headers,
            }),
          ]);

        setClients(clientsRes.data.clients || []);
        setPrestataires(prestatairesRes.data.prestataires || []);
        setPrestations(prestationsRes.data.prestations || []);

        const map = {};
        prestationsRes.data.prestations.forEach((p) => {
          map[p._id] = sousRes.data.sousprestations.filter(
            (sp) => sp.prestation === p._id
          );
        });
        setSousPrestations(map);
      } catch (err) {
        console.error(err);
        alert('Erreur chargement données');
      }
    };

    fetchAll();
  }, [entity, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === 'number') val = Number(value);
    if (type === 'checkbox') val = checked;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (key, file) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
  };

  const handlePrestationChange = (e) => {
    const prestationId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      prestationId,
      sousPrestations: [],
    }));
  };

  const handleSousPrestationsChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, sousPrestations: values }));
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('image', file);

    const res = await fetch(
      'https://gofind-v9ee.onrender.com/api/upload/image',
      {
        method: 'POST',
        body: data,
      }
    );

    if (!res.ok) throw new Error('Erreur upload image');
    const result = await res.json();
    return result.url;
  };

  /* ---------------- VALIDATION ---------------- */

  const validateReservation = () => {
    if (
      !formData.clientId ||
      !formData.prestataireId ||
      !formData.date ||
      !formData.heure ||
      !formData.prestationId
    ) {
      alert('❌ Champs obligatoires manquants');
      return false;
    }

    const selectedDate = new Date(`${formData.date}T${formData.heure}`);
    if (selectedDate < new Date()) {
      alert('❌ Date invalide');
      return false;
    }

    if (formData.modePaiement === 'Carte') {
      alert('⚠️ Paiement carte réservé aux clients');
      return false;
    }

    return true;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { ...formData };

      /* 🔹 images */
      for (const key of imageFields) {
        if (payload[key] instanceof File) {
          payload[key] = await uploadImage(payload[key]);
        }
      }

      const endpoint = entityToEndpoint[entity];

      /* 🔹 CAS RESERVATION */
      if (entity === 'reservations') {
        if (!validateReservation()) return;

        payload = {
          clientId: formData.clientId,
          prestataireId: formData.prestataireId,
          date: formData.date,
          heure: formData.heure,
          etat: 'en attente',
          modePaiement: formData.modePaiement,
          description: formData.description || '',
          prestations: [
            {
              prestationId: formData.prestationId,
              sousPrestations: formData.sousPrestations || [],
            },
          ],
        };
      }

      const res = await fetch(
        `https://gofind-v9ee.onrender.com/api/${endpoint}/new`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Erreur création');

      setSuccess(true);
      alert('✅ Création réussie');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  const renderReservationForm = () => (
    <>
      <section className="champs-reserva">
        <label className="label">Client</label>
        <select name="clientId" onChange={handleChange} required>
          <option value="">-- choisir --</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nom} {c.prenom}
            </option>
          ))}
        </select>

        <label className="label">Prestataire</label>
        <select name="prestataireId" onChange={handleChange} required>
          <option value="">-- choisir --</option>
          {prestataires.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom} {p.prenom}
            </option>
          ))}
        </select>

        <label className="label">Prestation</label>
        <select onChange={handlePrestationChange} required>
          <option value="">-- choisir --</option>
          {prestations.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom}
            </option>
          ))}
        </select>

        <label className="label">Sous-prestations</label>
        <select multiple onChange={handleSousPrestationsChange}>
          {(sousPrestations[formData.prestationId] || []).map((sp) => (
            <option className="presta" key={sp._id} value={sp._id}>
              {sp.nom}
            </option>
          ))}
        </select>

        <label className="label">Date</label>
        <input
          className="date"
          type="date"
          name="date"
          onChange={handleChange}
          required
        />

        <label className="label">Heure</label>
        <input
          className="time"
          type="time"
          name="heure"
          onChange={handleChange}
          required
        />

        <label className="label">Mode de paiement</label>
        <select name="modePaiement" onChange={handleChange}>
          <option className="modePaiement" value="Cash">
            Cash
          </option>
        </select>

        <label className="label">Description</label>
        <textarea
          className="textarea"
          name="description"
          onChange={handleChange}
        />
      </section>
    </>
  );

  if (!entity) return <p>Chargement...</p>;

  return (
    <div className="adminaddpage" style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Ajouter {entity}</h1>

      <form onSubmit={handleSubmit}>
        {entity === 'reservations' ? renderReservationForm() : null}

        <button className="btn-secondary" type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>

        <button
          className="btn-primary"
          type="button"
          style={{ marginLeft: 10 }}
          onClick={() => navigate('/dashboard')}
        >
          Retour
        </button>

        {success && <p style={{ color: 'green' }}>Création réussie</p>}
      </form>
    </div>
  );
};

export default AdminAddPage;
