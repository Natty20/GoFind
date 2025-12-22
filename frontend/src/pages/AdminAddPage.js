import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminAddPage = () => {
  const { entity } = useParams();
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* ---------------- SECURITY ---------------- */

  useEffect(() => {
    if (!token) {
      alert('Accès non autorisé');
      navigate('/login');
    }
  }, [token, navigate]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!entity) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        if (entity === 'reservations') {
          const [clientsRes, prestatairesRes, prestationsRes, sousRes] =
            await Promise.all([
              axios.get('https://gofind-v9ee.onrender.com/api/auth/clients', {
                headers,
              }),
              axios.get('https://gofind-v9ee.onrender.com/api/prestataires', {
                headers,
              }),
              axios.get('https://gofind-v9ee.onrender.com/api/prestations'),
              axios.get(
                'https://gofind-v9ee.onrender.com/api/sousprestations',
                { headers }
              ),
            ]);

          setClients(clientsRes.data.clients || []);
          setPrestataires(prestatairesRes.data.prestataires || []);
          setPrestations(prestationsRes.data.prestations || []);

          const map = {};
          (prestationsRes.data.prestations || []).forEach((p) => {
            map[p._id] = (sousRes.data.sousprestations || []).filter(
              (sp) => sp.prestation === p._id
            );
          });
          setSousPrestations(map);
        }
      } catch (err) {
        console.error(err);
        alert('Erreur chargement données');
      }
    };

    fetchAll();
  }, [entity, token]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrestationChange = (e) => {
    const prestationId = e.target.value;
    setFormData({
      ...formData,
      prestationId,
      sousPrestations: [],
    });
  };

  const handleSousPrestationsChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData({ ...formData, sousPrestations: values });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadImageToBackend = async (file) => {
    const data = new FormData();
    data.append('image', file);

    const res = await axios.post(
      'https://gofind-v9ee.onrender.com/api/upload/image',
      data
    );

    return res.data.url;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImageToBackend(imageFile);
      }

      if (entity === 'reservations') {
        const payload = {
          clientId: formData.clientId,
          prestataireId: formData.prestataireId,
          date: formData.date,
          heure: formData.heure,
          modePaiement: formData.modePaiement,
          description: formData.description,
          image: imageUrl,
          prestations: [
            {
              prestationId: formData.prestationId,
              sousPrestations: formData.sousPrestations || [],
            },
          ],
        };

        await axios.post(
          'https://gofind-v9ee.onrender.com/api/reservations/new',
          payload,
          { headers }
        );
      }

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

  if (!entity) return <p>Chargement...</p>;
  if (entity !== 'reservations') {
    return <p>❌ Ajout non géré ici</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Ajouter une réservation</h1>

      <form onSubmit={handleSubmit}>
        <label>Client</label>
        <select name="clientId" onChange={handleChange} required>
          <option value="">-- choisir --</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nom} {c.prenom}
            </option>
          ))}
        </select>

        <label>Prestataire</label>
        <select name="prestataireId" onChange={handleChange} required>
          <option value="">-- choisir --</option>
          {prestataires.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom} {p.prenom}
            </option>
          ))}
        </select>

        <label>Prestation</label>
        <select onChange={handlePrestationChange} required>
          <option value="">-- choisir --</option>
          {prestations.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom}
            </option>
          ))}
        </select>

        <label>Sous-prestations</label>
        <select multiple onChange={handleSousPrestationsChange}>
          {(sousPrestations[formData.prestationId] || []).map((sp) => (
            <option key={sp._id} value={sp._id}>
              {sp.nom}
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" name="date" onChange={handleChange} required />

        <label>Heure</label>
        <input type="time" name="heure" onChange={handleChange} required />

        <label>Mode de paiement</label>
        <select name="modePaiement" onChange={handleChange} required>
          <option value="Cash">Cash</option>
          <option value="Carte">Carte</option>
        </select>

        <label>Description</label>
        <textarea name="description" onChange={handleChange} />

        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{ width: 100, marginTop: 10 }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddPage;
