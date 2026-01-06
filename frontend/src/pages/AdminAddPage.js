import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API = 'https://gofind-v9ee.onrender.com/api';

// Pour uploader une image
const uploadImage = async (file) => {
  if (!file) return ''; // Vérifie si le fichier existe
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

const AdminAddPage = () => {
  const { entity } = useParams();
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');
  const admin = JSON.parse(sessionStorage.getItem('admin'));

  useEffect(() => {
    if (!token || !admin || admin.role !== 'admin') {
      alert('Accès interdit');
      navigate('/login_admin');
    }
  }, [token, admin, navigate]);

  return (
    <main className="adminaddpage">
      <h1>Ajouter : {entity}</h1>

      {entity === 'clients' && <ClientForm />}
      {entity === 'admins' && <AdminForm />}
      {entity === 'prestataires' && <PrestataireForm />}
      {entity === 'prestations' && <PrestationForm />}
      {entity === 'sousprestations' && <SousPrestationForm />}
      {entity === 'reservations' && <ReservationForm />}

      <button onClick={() => navigate('/dashboard')}>Retour</button>
    </main>
  );
};

export default AdminAddPage;

// client
const ClientForm = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(`${API}/cities`).then((res) => setCities(res.data.cities));
  }, []);

  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    ville: '',
    profilePicture: null,
  });

  const submit = async (e) => {
    e.preventDefault();
    const image = await uploadImage(data.profilePicture);

    await axios.post(`${API}/auth/register`, {
      ...data,
      profilePicture: image,
    });

    alert('Client créé');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <label>Nom:</label>
      <input
        required
        placeholder="Nom"
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />

      <label>Prénom:</label>
      <input
        required
        placeholder="Prénom"
        onChange={(e) => setData({ ...data, prenom: e.target.value })}
      />

      <label>Email:</label>
      <input
        required
        type="email"
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <label>Mot de passe:</label>
      <input
        required
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <label>Téléphone:</label>
      <input
        required
        placeholder="Téléphone"
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <label>Ville:</label>
      <select
        required
        value={data.ville}
        onChange={(e) => setData({ ...data, ville: e.target.value })}
      >
        <option value="">Choisir une ville</option>
        {cities.map((city) => (
          <option key={city._id} value={city._id}>
            {city.nom}
          </option>
        ))}
      </select>

      <label>Photo de profil:</label>
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) =>
          setData({ ...data, profilePicture: e.target.files[0] })
        }
      />

      <button type="submit">Créer client</button>
    </form>
  );
};

// admin
const AdminForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/admin/register`, data);
    alert('Admin créé');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <label>Nom:</label>
      <input
        required
        placeholder="Nom"
        onChange={(e) => setData({ ...data, nom: e.target.value })}
      />
      <label>Prénom:</label>
      <input
        required
        placeholder="Prénom"
        onChange={(e) => setData({ ...data, prenom: e.target.value })}
      />
      <label>Email:</label>
      <input
        required
        type="email"
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <label>Mot de passe:</label>
      <input
        required
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <label>Téléphone:</label>
      <input
        required
        placeholder="Téléphone"
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />
      <button type="submit">Créer admin</button>
    </form>
  );
};

// prestataire
const PrestataireForm = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [sousPrestations, setSousPrestations] = useState([]);

  useEffect(() => {
    axios.get(`${API}/cities`).then((res) => setCities(res.data.cities));
    axios
      .get(`${API}/prestations`)
      .then((res) => setPrestations(res.data.prestations));
  }, []);

  const [data, setData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    ville: '',
    profilePicture: null,
    prestationId: '',
    selectedSousPrestations: [],
  });

  useEffect(() => {
    if (!data.prestationId) return;
    axios
      .get(`${API}/sousprestations/prestation/${data.prestationId}`)
      .then((res) => setSousPrestations(res.data.sousPrestations));
  }, [data.prestationId]);

  const submit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage(data.profilePicture);

    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
      phone: data.phone,
      ville: data.ville,
      profilePicture: imageUrl,
      selectedPrestations: [
        {
          prestationId: data.prestationId,
          selectedSousPrestations: data.selectedSousPrestations,
        },
      ],
    };

    await axios.post(`${API}/prestataires/register`, payload);
    alert('Prestataire créé');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
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
      <label>Ville:</label>
      <select
        required
        value={data.ville}
        onChange={(e) => setData({ ...data, ville: e.target.value })}
      >
        <option value="">Choisir une ville</option>
        {cities.map((city) => (
          <option key={city._id} value={city._id}>
            {city.nom}
          </option>
        ))}
      </select>
      <label>Photo de profil:</label>
      <input
        required
        type="file"
        onChange={(e) =>
          setData({ ...data, profilePicture: e.target.files[0] })
        }
      />
      <label>Prestation:</label>
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
      <label>Sous-prestations:</label>
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
      <button type="submit">Créer prestataire</button>
    </form>
  );
};

/* ================= PRESTATION + SOUS ================= */
const PrestationForm = () => {
  const navigate = useNavigate();

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

    await axios.post(`${API}/prestations`, payload);
    alert('Prestation créée');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
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

      <button type="button" onClick={addSousPrestation}>
        ➕ Ajouter sous-prestation
      </button>

      <button type="submit">Créer prestation</button>
    </form>
  );
};

// souspresta
const SousPrestationForm = () => {
  const navigate = useNavigate();
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
    axios.get(`${API}/prestations`).then((res) => {
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

    await axios.post(`${API}/sousprestations/${data.prestationId}`, payload);

    alert('Sous-prestation créée');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
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

      <button type="submit">Créer sous-prestation</button>
    </form>
  );
};

// reservations
const ReservationForm = () => {
  const navigate = useNavigate();

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
      .get(`${API}/auth/clients`)
      .then((res) => setClients(res.data.clients));
    axios
      .get(`${API}/prestations`)
      .then((res) => setPrestations(res.data.prestations));
  }, []);

  useEffect(() => {
    if (!data.prestationId) return;
    axios
      .get(`${API}/sousprestations/prestation/${data.prestationId}`)
      .then((res) => setSousPrestations(res.data.sousPrestations));
  }, [data.prestationId]);

  useEffect(() => {
    if (!data.sousPrestationId) return;
    axios
      .get(`${API}/sousprestations/${data.sousPrestationId}/prestataires`)
      .then((res) => setPrestataires(res.data.prestataires));
  }, [data.sousPrestationId]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      client: data.client,
      prestataire: data.prestataire,
      date: new Date(data.date),
      heure: data.heure,
      description: data.description,

      modePaiement: 'Virement Bancaire',
      etat: 'en attente',

      prestations: [
        {
          prestationId: data.prestationId,
          sousPrestations: [data.sousPrestationId],
        },
      ],
    };

    await axios.post(`${API}/reservations/new`, payload);
    alert('Réservation créée');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <label>Client</label>
      <select
        required
        onChange={(e) => setData({ ...data, client: e.target.value })}
      >
        <option value="">Choisir</option>
        {clients.map((c) => (
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
        {prestations.map((p) => (
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
        {sousPrestations.map((sp) => (
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
        {prestataires.map((p) => (
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

      <button type="submit">Créer réservation</button>
    </form>
  );
};
