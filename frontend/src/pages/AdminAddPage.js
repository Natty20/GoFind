import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SubFormSection from './SubFormSection';

const AdminAddPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profilePicture: null,
    selectedPrestations: [],
  });
  const [loading, setLoading] = useState(false);
  const [prestations, setPrestations] = useState([]);
  const [selectedSousPrestations, setSelectedSousPrestations] = useState({});
  const [sousPrestations, setSousPrestations] = useState({});
  const { entity } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrestationsData = async () => {
      if (entity === 'prestataires' || entity === 'sousprestations') {
        try {
          {
            const response = await axios.get(
              'http://localhost:5000/api/prestations'
            );
            const prestationsData = response.data.prestations || response.data;

            setPrestations(prestationsData);

            const sousPrestationsMap = {};
            prestationsData.forEach((prestation) => {
              sousPrestationsMap[prestation._id] =
                prestation.sousPrestations || [];
            });

            setSousPrestations(sousPrestationsMap);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      }
    };

    fetchPrestationsData();
  }, [entity]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrestationsChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => ({ ...prev, selectedPrestations: selectedIds }));

    const newSelectedSousPrestations = {};
    selectedIds.forEach((prestationId) => {
      newSelectedSousPrestations[prestationId] = [];
    });
    setSelectedSousPrestations(newSelectedSousPrestations);
  };

  const handleSousPrestationsChange = (prestationId, e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSousPrestations((prev) => ({
      ...prev,
      [prestationId]: selectedIds,
    }));
  };

  const entityToEndpoint = {
    clients: { method: 'post', url: 'auth/register', port: 5000 },
    admins: { method: 'post', url: 'admin/register', port: 5000 },
    prestataires: { method: 'post', url: 'prestataires/register', port: 5000 },
    prestations: { method: 'post', url: 'prestations', port: 5000 },
    sousprestations: { method: 'put', url: 'sousprestations', port: 5000 },
    reservations: { method: 'post', url: 'reservations/new', port: 5000 },
  };
  const entityConfigs = {
    clients: [
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'prenom', label: 'Prénom', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Mot de passe', type: 'password' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'profilePicture', label: 'Profile Picture (URL)', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
    ],
    admins: [
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'prenom', label: 'Prénom', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Mot de passe', type: 'password' },
      { name: 'phone', label: 'Phone', type: 'text' },
    ],
    prestataires: [
      { name: 'nom', label: 'Nom et Prénom', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Mot de passe', type: 'password' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'profilePicture', label: 'Profile Picture (URL)', type: 'text' },
      { name: 'selectedPrestations', label: 'Prestations', type: 'custom' },
    ],
    prestations: [
      { name: 'nom', label: 'Nom de la prestation', type: 'text' },
      { name: 'shortDescription', label: 'Short Description', type: 'text' },
      { name: 'longDescription', label: 'Long Description', type: 'text' },
      { name: 'profileImage', label: 'Profile Image (URL)', type: 'text' },
      {
        name: 'backgroundImage',
        label: 'Background Image (URL)',
        type: 'text',
      },
      { name: 'overlayImage', label: 'Overlay Image (URL)', type: 'text' },
      {
        name: 'sousPrestations',
        label: 'Sous-prestations',
        type: 'subForm',
        fields: [
          { name: 'nom', label: 'Nom', type: 'text' },
          { name: 'title', label: 'Title', type: 'text' },
          {
            name: 'shortDescription',
            label: 'Short Description',
            type: 'text',
          },
          { name: 'longDescription', label: 'Long Description', type: 'text' },
          { name: 'profileImage', label: 'Profile Image (URL)', type: 'text' },
          {
            name: 'backgroundImage',
            label: 'Background Image (URL)',
            type: 'text',
          },
        ],
      },
    ],
    sousprestations: [
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'shortDescription', label: 'Short Description', type: 'text' },
      { name: 'longDescription', label: 'Long Description', type: 'text' },
      { name: 'profileImage', label: 'Profile Image (URL)', type: 'text' },
      {
        name: 'backgroundImage',
        label: 'Background Image (URL)',
        type: 'text',
      },
      {
        name: 'prestationId',
        label: 'Associer à une prestation',
        type: 'select',
        options: prestations,
      },
    ],
  };

  // const entityToEndpoint = {
  //   clients: 'auth/register',
  //   admins: 'admin/register',
  //   prestations: 'prestations',
  //   sousprestations: 'sousprestations',
  //   prestataires: 'prestataires/register',
  // };

  const currentEntityConfig = entityConfigs[entity] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = entityToEndpoint[entity];
      if (!config) throw new Error('Endpoint inconnu!');

      const baseUrl = 'http://localhost:5000/api';
      const token = sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Si c'est 'prestataires' et qu'on doit envoyer un fichier, on prépare un FormData
      let payload;
      let isFormData = false;

      if (entity === 'prestataires') {
        payload = new FormData();

        // Ajoute tous les champs du formData (sauf selectedPrestations) dans FormData
        for (const key in formData) {
          if (key !== 'selectedPrestations' && formData[key] !== undefined) {
            payload.append(key, formData[key]);
          }
        }

        // On gère selectedPrestations qui doit être stringify car c'est un tableau d'objets
        if (formData.selectedPrestations) {
          const selectedPrestationsArray = (
            formData.selectedPrestations || []
          ).map((prestationId) => ({
            prestationId,
            selectedSousPrestations:
              selectedSousPrestations[prestationId] || [],
          }));
          payload.append(
            'selectedPrestations',
            JSON.stringify(selectedPrestationsArray)
          );
        }

        // Si tu gères un fichier uploadé, assure-toi que c'est dans formData sous 'profilePicture' (par ex)
        if (
          formData.profilePicture &&
          formData.profilePicture instanceof File
        ) {
          payload.append('profilePicture', formData.profilePicture);
        }

        isFormData = true;
      } else if (entity === 'sousprestations') {
        // Pour sousprestations on extrait prestationId et on retire du corps
        const prestationId = formData.prestationId;
        if (!prestationId) throw new Error('prestationId requis');

        const { prestationId: _, ...sousPrestationData } = formData;

        payload = sousPrestationData;
      } else {
        // Cas standard pour les autres entités (json simple)
        payload = { ...formData };
      }

      // Construction de l'url et méthode
      let url;
      let method;

      if (entity === 'sousprestations') {
        url = `${baseUrl}/sousprestations/${formData.prestationId}`;
        method = axios.post;
      } else {
        url = `${baseUrl}/${config.url}`;
        method = config.method === 'put' ? axios.put : axios.post;
      }

      // Headers adaptés au type de payload
      let finalHeaders = { ...headers };
      if (!isFormData) {
        finalHeaders['Content-Type'] = 'application/json';
      }
      // Sinon axios gère automatiquement le Content-Type multipart/form-data avec FormData

      await method(url, payload, { headers: finalHeaders });

      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur ajout :', err);
      alert("❌ Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-page">
      <h2>Ajouter un {entity}</h2>
      <form onSubmit={handleSubmit}>
        {currentEntityConfig.map((field) => {
          if (field.type === 'subForm') {
            return (
              <SubFormSection
                key={field.name}
                label={field.label}
                fields={field.fields}
                values={formData[field.name] || []}
                onChange={(updated) =>
                  setFormData({ ...formData, [field.name]: updated })
                }
              />
            );
          }

          if (field.type === 'custom') {
            return (
              <div key="selectedPrestations">
                <label>Prestations:</label>
                <select multiple onChange={handlePrestationsChange}>
                  {prestations.map((prestation) => (
                    <option key={prestation._id} value={prestation._id}>
                      {prestation.nom}
                    </option>
                  ))}
                </select>
                {(formData.selectedPrestations || []).map((prestationId) => (
                  <div key={prestationId}>
                    <label>
                      Sous-prestations pour{' '}
                      {prestations.find((p) => p._id === prestationId)?.nom} :
                    </label>
                    <select
                      multiple
                      onChange={(e) =>
                        handleSousPrestationsChange(prestationId, e)
                      }
                    >
                      {sousPrestations[prestationId]?.map((sousPrestation) => (
                        <option
                          key={sousPrestation._id}
                          value={sousPrestation._id}
                        >
                          {sousPrestation.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required
              />
            </div>
          );
        })}
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddPage;
