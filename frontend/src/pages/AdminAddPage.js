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
      try {
        if (entity === 'prestataires' || entity === 'sousprestations') {
          const response = await axios.get(
            'http://149.202.53.181:2000/api/prestations'
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

  const entityToEndpoint = {
    clients: 'auth/register',
    admins: 'admin/register',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    prestataires: 'prestataires/register',
  };

  const currentEntityConfig = entityConfigs[entity] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = 'http://149.202.53.181:2000/api';
      const endpoint = entityToEndpoint[entity];
      if (!endpoint) throw new Error(`Aucun endpoint défini pour ${entity}`);

      let payload = { ...formData };

      if (entity === 'prestataires' || entity === 'sousprestations') {
        const formattedPrestations = (formData.selectedPrestations || []).map(
          (prestationId) => ({
            prestationId,
            selectedSousPrestations:
              selectedSousPrestations[prestationId] || [],
          })
        );
        payload.selectedPrestations = formattedPrestations;
      }

      const token = sessionStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.post(
        `${baseUrl}/${endpoint}`,
        payload,
        config
      );
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entité :", error);
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
