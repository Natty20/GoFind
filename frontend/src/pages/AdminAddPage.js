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

  /* 🔐 sécurité */
  useEffect(() => {
    if (!adminId || !token) {
      alert('Accès non autorisé');
      navigate('/login');
    }
  }, [adminId, token, navigate]);

  /* 🔹 champs par défaut (hors réservation) */
  useEffect(() => {
    if (entity === 'reservations') return;

    const defaultFields = {
      prestataires: {
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        address: '',
        profilePicture: null,
      },
      prestations: {
        nom: '',
        description: '',
      },
      sousprestations: {
        nom: '',
        prix: '',
      },
      clients: {
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        address: '',
      },
    };

    if (defaultFields[entity]) {
      setFormData(defaultFields[entity]);
    }
  }, [entity]);

  /* ---------------- DATA RESERVATION ---------------- */

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

  /* ---------------- HANDLERS ---------------- */

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

  /* ---------------- VALIDATION RESERVATION ---------------- */

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

    return true;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { ...formData };

      /* 🔹 upload images */
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
          modePaiement: 'Cash',
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

  const renderGenericForm = () => (
    <>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <label className="label">{key}</label>

          {imageFields.includes(key) ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(key, e.target.files[0])}
            />
          ) : (
            <input
              name={key}
              value={value || ''}
              onChange={handleChange}
              required
            />
          )}
        </div>
      ))}
    </>
  );

  const renderReservationForm = () => (
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
          <option key={sp._id} value={sp._id}>
            {sp.nom}
          </option>
        ))}
      </select>

      <label className="label">Date</label>
      <input type="date" name="date" onChange={handleChange} required />

      <label className="label">Heure</label>
      <input type="time" name="heure" onChange={handleChange} required />

      <label className="label">Description</label>
      <textarea name="description" onChange={handleChange} />
    </section>
  );

  return (
    <div className="adminaddpage" style={{ maxWidth: 700, margin: 'auto' }}>
      <h1>Ajouter {entity}</h1>

      <form onSubmit={handleSubmit}>
        {entity === 'reservations'
          ? renderReservationForm()
          : renderGenericForm()}

        <div className="admin-add-page">
          <button className="btn-secondary" type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            Retour
          </button>
        </div>

        {success && <p style={{ color: 'green' }}>Création réussie</p>}
      </form>
    </div>
  );
};

export default AdminAddPage;
