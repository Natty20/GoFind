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
    const fetchData = async () => {
      try {
        if (entity === 'prestataires' || entity === 'sousprestations') {
          const prestRes = await axios.get(
            'https://gofind-v9ee.onrender.com/api/prestations'
          );
          const prestationsData = prestRes.data.prestations || [];
          setPrestations(prestationsData);

          const sousRes = await axios.get(
            'https://gofind-v9ee.onrender.com/api/sousprestations'
          );
          const sousPrestationsData = sousRes.data.sousprestations || [];

          const sousPrestationsMap = {};
          prestationsData.forEach((prestation) => {
            sousPrestationsMap[prestation._id] = sousPrestationsData.filter(
              (sp) => sp.prestation === prestation._id
            );
          });

          setSousPrestations(sousPrestationsMap);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
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
    clients: { method: 'post', url: 'auth/register' },
    admins: { method: 'post', url: 'admin/register' },
    prestataires: { method: 'post', url: 'prestataires/register' },
    prestations: { method: 'post', url: 'prestations' },
    sousprestations: { method: 'post', url: 'sousprestations' },
    reservations: { method: 'post', url: 'reservations/new' },
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
      { name: 'nom', label: 'Nom', type: 'text' },
      { name: 'prenom', label: 'Prénom', type: 'text' },
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

  const currentEntityConfig = entityConfigs[entity] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = entityToEndpoint[entity];
      if (!config) throw new Error('Endpoint inconnu!');
      const baseUrl = 'https://gofind-v9ee.onrender.com/api';
      const token = sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let payload = { ...formData };

      if (entity === 'prestataires') {
        payload.selectedPrestations = (formData.selectedPrestations || []).map(
          (prestationId) => ({
            prestationId,
            selectedSousPrestations:
              selectedSousPrestations[prestationId] || [],
          })
        );
      }

      if (entity === 'sousprestations') {
        const prestationId = formData.prestationId;
        if (!prestationId) throw new Error('prestationId requis');

        await axios.post(
          `${baseUrl}/sousprestations`,
          { ...formData, prestation: prestationId },
          { headers }
        );
      } else {
        const url = `${baseUrl}/${config.url}`;
        const method = config.method === 'put' ? axios.put : axios.post;
        await method(url, payload, { headers });
      }

      alert('✅ Ajout réussi !');
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
      <h1>Ajouter un {entity}</h1>
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

          if (field.type === 'select') {
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt._id} value={opt._id}>
                      {opt.nom}
                    </option>
                  ))}
                </select>
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
