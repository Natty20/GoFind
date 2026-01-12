import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Admin/Add.css';
import PropTypes from 'prop-types';

const API = 'https://gofind-v9ee.onrender.com/api';

// pour les images
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API}/upload/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Erreur upload image');
  const data = await res.json();
  return data.url;
};

const CityInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(value || '');

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&type=municipality&limit=6`
      );
      const data = await res.json();
      setSuggestions(data.features.map((f) => f.properties.city));
    } catch (err) {
      console.error('Erreur autocomplete villes', err);
      setSuggestions([]);
    }
  };

  const handleSelect = (city) => {
    setQuery(city);
    onChange(city);
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Choisissez votre ville"
        required
        style={{ width: '100%', padding: '8px' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 10,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              style={{ padding: '8px', cursor: 'pointer' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CityInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// la page
const AdminAddPage = () => {
  const { entity } = useParams();
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');
  const admin = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('admin'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!token || !admin || admin.role !== 'admin') {
      alert('Accès interdit');
      navigate('/login_admin');
    }
  }, [token, admin, navigate]);

  return (
    <main className="adminaddpage">
      <h1 className="tittles">Ajouter : {entity}</h1>

      {entity === 'clients' && <ClientForm />}
      {entity === 'admins' && <AdminForm />}
      {entity === 'prestataires' && <PrestataireForm />}
      {entity === 'prestations' && <PrestationForm />}
      {entity === 'sousprestations' && <SousPrestationForm />}
      {entity === 'reservations' && <ReservationForm />}

      <button className="btn-primary" onClick={() => navigate('/dashboard')}>
        Retour
      </button>
    </main>
  );
};

export default AdminAddPage;

const ClientForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profilePicture: null,
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage(data.profilePicture);

      const payload = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        profilePicture: imageUrl,
      };

      await axios.post(`${API}/auth/register`, payload, axiosConfig);

      alert('Client créé');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erreur création client');
    }
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Nom</label>
      <input
        required
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />

      <label>Prénom</label>
      <input
        required
        onChange={(e) => setData({ ...data, prenom: e.target.value })}
      />

      <label>Email</label>
      <input
        required
        type="email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <label>Mot de passe</label>
      <input
        required
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <label>Téléphone</label>
      <input
        required
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <label>Ville</label>
      <CityInput
        value={data.address}
        onChange={(val) => setData({ ...data, address: val })}
      />

      <label>Photo de profil</label>
      <input
        required
        type="file"
        onChange={(e) =>
          setData({ ...data, profilePicture: e.target.files[0] })
        }
      />

      <button className="btn-secondary" type="submit">
        Créer client
      </button>
    </form>
  );
};

// ==================== AdminForm ====================
const AdminForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/register`, data, axiosConfig);
      alert('Admin créé');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erreur création admin');
    }
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Nom:</label>
      <input
        required
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />
      <label>Prénom:</label>
      <input
        required
        onChange={(e) => setData({ ...data, prenom: e.target.value })}
      />
      <label>Email:</label>
      <input
        required
        type="email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <label>Mot de passe:</label>
      <input
        required
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <label>Téléphone:</label>
      <input
        required
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />
      <button className="btn-secondary" type="submit">
        Créer admin
      </button>
    </form>
  );
};

// ==================== PrestataireForm ====================
const PrestataireForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);

  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profilePicture: null,
    prestationId: '',
    selectedSousPrestations: [],
  });

  /* Fetch prestations */
  useEffect(() => {
    axios
      .get(`${API}/prestations`, axiosConfig)
      .then((res) => setPrestations(res.data.prestations))
      .catch(console.error);
  }, []);

  /* Fetch sous-prestations */
  useEffect(() => {
    if (!data.prestationId) return;

    axios
      .get(
        `${API}/sousprestations/prestation/${data.prestationId}`,
        axiosConfig
      )
      .then((res) => setSousPrestations(res.data.sousPrestations))
      .catch(console.error);
  }, [data.prestationId]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage(data.profilePicture);

      const payload = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        profilePicture: imageUrl,
        selectedPrestations: [
          {
            prestationId: data.prestationId,
            selectedSousPrestations: data.selectedSousPrestations,
          },
        ],
      };

      await axios.post(`${API}/prestataires/register`, payload, axiosConfig);

      alert('Prestataire créé');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erreur création prestataire');
    }
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Nom</label>
      <input
        required
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />

      <label>Prénom</label>
      <input
        required
        onChange={(e) => setData({ ...data, prenom: e.target.value })}
      />

      <label>Email</label>
      <input
        required
        type="email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <label>Mot de passe</label>
      <input
        required
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <label>Téléphone</label>
      <input
        required
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <label>Ville</label>
      <CityInput
        value={data.address}
        onChange={(val) => setData({ ...data, address: val })}
      />

      <label>Photo de profil</label>
      <input
        required
        type="file"
        onChange={(e) =>
          setData({ ...data, profilePicture: e.target.files[0] })
        }
      />

      <label>Prestation</label>
      <select
        required
        onChange={(e) => setData({ ...data, prestationId: e.target.value })}
      >
        <option value="">Choisir</option>
        {prestations.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nom}
          </option>
        ))}
      </select>

      <label>Sous-prestations</label>
      <select
        multiple
        required
        onChange={(e) =>
          setData({
            ...data,
            selectedSousPrestations: Array.from(
              e.target.selectedOptions,
              (o) => o.value
            ),
          })
        }
      >
        {sousPrestations.map((sp) => (
          <option key={sp._id} value={sp._id}>
            {sp.nom}
          </option>
        ))}
      </select>

      <button className="btn-secondary" type="submit">
        Créer prestataire
      </button>
    </form>
  );
};

/* ================= PRESTATION + SOUS ================= */
const PrestationForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [data, setData] = useState({
    nom: '',
    shortDescription: '',
    longDescription: '',
    overlayDescription: '',
    profileImage: null,
    backgroundImage: null,
    overlayImage: null,
    sousPrestations: [],
  });

  const addSousPrestation = () => {
    setData((prev) => ({
      ...prev,
      sousPrestations: [
        ...prev.sousPrestations,
        {
          nom: '',
          title: '',
          shortDescription: '',
          longDescription: '',
          profileImage: null,
          backgroundImage: null,
        },
      ],
    }));
  };

  const handleSousChange = (i, key, value) => {
    const updated = [...data.sousPrestations];
    updated[i] = { ...updated[i], [key]: value };
    setData({ ...data, sousPrestations: updated });
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...data,
      profileImage: await uploadImage(data.profileImage),
      backgroundImage: await uploadImage(data.backgroundImage),
      overlayImage: data.overlayImage
        ? await uploadImage(data.overlayImage)
        : '',
      sousPrestations: await Promise.all(
        data.sousPrestations.map(async (sp) => ({
          ...sp,
          profileImage: await uploadImage(sp.profileImage),
          backgroundImage: await uploadImage(sp.backgroundImage),
        }))
      ),
    };

    await axios.post(`${API}/prestations`, payload, axiosConfig);
    alert('Prestation créée');
    navigate('/dashboard');
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Nom de la prestation</label>
      <input
        required
        value={data.nom}
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />

      <label>Description courte</label>
      <textarea
        required
        value={data.shortDescription}
        onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
      />

      <label>Description longue</label>
      <textarea
        required
        value={data.longDescription}
        onChange={(e) => setData({ ...data, longDescription: e.target.value })}
      />

      <label>Description overlay</label>
      <textarea
        value={data.overlayDescription}
        onChange={(e) =>
          setData({ ...data, overlayDescription: e.target.value })
        }
      />

      <label>Image profil</label>
      <input
        required
        type="file"
        onChange={(e) => setData({ ...data, profileImage: e.target.files[0] })}
      />

      <label>Image background</label>
      <input
        required
        type="file"
        onChange={(e) =>
          setData({ ...data, backgroundImage: e.target.files[0] })
        }
      />

      <label>Image overlay</label>
      <input
        type="file"
        onChange={(e) => setData({ ...data, overlayImage: e.target.files[0] })}
      />

      <h3>Sous-prestations</h3>

      {data.sousPrestations.map((sp, i) => (
        <div key={i}>
          <label>Nom</label>
          <input
            value={sp.nom}
            onChange={(e) => handleSousChange(i, 'nom', e.target.value)}
          />

          <label>Titre</label>
          <input
            value={sp.title}
            onChange={(e) => handleSousChange(i, 'title', e.target.value)}
          />

          <label>Description courte</label>
          <textarea
            value={sp.shortDescription}
            onChange={(e) =>
              handleSousChange(i, 'shortDescription', e.target.value)
            }
          />

          <label>Description longue</label>
          <textarea
            value={sp.longDescription}
            onChange={(e) =>
              handleSousChange(i, 'longDescription', e.target.value)
            }
          />

          <label>Image profil</label>
          <input
            type="file"
            onChange={(e) =>
              handleSousChange(i, 'profileImage', e.target.files[0])
            }
          />

          <label>Image background</label>
          <input
            type="file"
            onChange={(e) =>
              handleSousChange(i, 'backgroundImage', e.target.files[0])
            }
          />
        </div>
      ))}

      <button className="btn-primary" type="button" onClick={addSousPrestation}>
        ➕ Ajouter sous-prestation
      </button>

      <button className="btn-secondary" type="submit">
        Créer prestation
      </button>
    </form>
  );
};

// souspresta
const SousPrestationForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [prestations, setPrestations] = useState([]);

  const [data, setData] = useState({
    nom: '',
    title: '',
    shortDescription: '',
    longDescription: '',
    profileImage: null,
    backgroundImage: null,
    prestationId: '',
  });

  useEffect(() => {
    axios.get(`${API}/prestations`, axiosConfig).then((res) => {
      setPrestations(res.data.prestations);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      nom: data.nom,
      title: data.title,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      profileImage: await uploadImage(data.profileImage),
      backgroundImage: await uploadImage(data.backgroundImage),
    };

    await axios.post(
      `${API}/sousprestations/${data.prestationId}`,
      payload,
      axiosConfig
    );

    alert('Sous-prestation créée');
    navigate('/dashboard');
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Nom</label>
      <input
        required
        value={data.nom}
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />

      <label>Titre</label>
      <input
        required
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      <label>Description courte</label>
      <textarea
        required
        value={data.shortDescription}
        onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
      />

      <label>Description longue</label>
      <textarea
        required
        value={data.longDescription}
        onChange={(e) => setData({ ...data, longDescription: e.target.value })}
      />

      <label>Prestation associée</label>
      <select
        required
        value={data.prestationId}
        onChange={(e) => setData({ ...data, prestationId: e.target.value })}
      >
        <option value="">— Choisir —</option>
        {prestations.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nom}
          </option>
        ))}
      </select>

      <label>Image profil</label>
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) => setData({ ...data, profileImage: e.target.files[0] })}
      />

      <label>Image background</label>
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) =>
          setData({ ...data, backgroundImage: e.target.files[0] })
        }
      />

      <button className="btn-secondary" type="submit">
        Créer sous-prestation
      </button>
    </form>
  );
};

// reservations
const ReservationForm = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const [clients, setClients] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);
  const [prestataires, setPrestataires] = useState([]);

  const [data, setData] = useState({
    client: '',
    prestataire: '',
    prestationId: '',
    sousPrestationId: '',
    date: '',
    heure: '',
    description: '',
  });

  useEffect(() => {
    axios
      .get(`${API}/auth/clients`, axiosConfig)
      .then((res) => setClients(res.data.clients));
    axios
      .get(`${API}/prestations`, axiosConfig)
      .then((res) => setPrestations(res.data.prestations));
  }, []);

  useEffect(() => {
    if (!data.prestationId) return;
    axios
      .get(
        `${API}/sousprestations/prestation/${data.prestationId}`,
        axiosConfig
      )
      .then((res) => setSousPrestations(res.data.sousPrestations));
  }, [data.prestationId]);

  useEffect(() => {
    if (!data.sousPrestationId) {
      setPrestataires([]);
      return;
    }

    axios
      .get(
        `${API}/sousprestations/${data.sousPrestationId}/prestataires`,
        axiosConfig
      )
      .then((res) => {
        console.log('Sous-prestation reçue :', res.data);

        setPrestataires(res.data?.sousPrestation?.prestataires || []);
      })
      .catch((err) => {
        console.error('Erreur chargement prestataires', err);
        setPrestataires([]);
      });
  }, [data.sousPrestationId]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      clientId: data.client,
      prestataireId: data.prestataire,
      prestations: [
        {
          prestationId: data.prestationId,
          sousPrestations: [data.sousPrestationId],
        },
      ],
      date: data.date,
      heure: data.heure,
      modePaiement: 'Virement Bancaire',
      description: data.description,
    };

    await axios.post(`${API}/reservations/new`, payload, axiosConfig);
    alert('Réservation créée');
    navigate('/dashboard');
  };

  return (
    <form className="champs" onSubmit={submit}>
      <label>Client</label>
      <select
        required
        onChange={(e) => setData({ ...data, client: e.target.value })}
      >
        <option value="">Choisir</option>
        {clients?.map((c) => (
          <option key={c._id} value={c._id}>
            {c.nom} {c.prenom}
          </option>
        ))}
      </select>

      <label>Prestation</label>
      <select
        required
        onChange={(e) => setData({ ...data, prestationId: e.target.value })}
      >
        <option value="">Choisir</option>
        {prestations?.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nom}
          </option>
        ))}
      </select>

      <label>Sous-prestation</label>
      <select
        required
        onChange={(e) => setData({ ...data, sousPrestationId: e.target.value })}
      >
        <option value="">Choisir</option>
        {sousPrestations?.map((sp) => (
          <option key={sp._id} value={sp._id}>
            {sp.nom}
          </option>
        ))}
      </select>

      <label>Prestataire</label>
      <select
        required
        onChange={(e) => setData({ ...data, prestataire: e.target.value })}
      >
        <option value="">Choisir</option>
        {prestataires?.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nom} {p.prenom}
          </option>
        ))}
      </select>

      <label>Date</label>
      <input
        type="date"
        required
        onChange={(e) => setData({ ...data, date: e.target.value })}
      />

      <label>Heure</label>
      <input
        type="time"
        required
        onChange={(e) => setData({ ...data, heure: e.target.value })}
      />

      <label>Description</label>
      <textarea
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />

      <button className="btn-secondary" type="submit">
        Créer réservation
      </button>
    </form>
  );
};
