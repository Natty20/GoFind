import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Admin/Edit.css';

const API = 'https://gofind-v9ee.onrender.com/api';

const AdminEditPage = () => {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [originalDate, setOriginalDate] = useState(null);

  const [allPrestations, setAllPrestations] = useState([]);
  const [allSousPrestations, setAllSousPrestations] = useState([]);

  const token = sessionStorage.getItem('token');

  const entityToEndpoint = {
    admins: 'admin',
    clients: 'auth',
    prestataires: 'prestataires',
    prestations: 'prestations',
    sousprestations: 'sousprestations',
    reservations: 'reservations',
  };

  const imageFields = [
    'profilePicture',
    'profileImage',
    'backgroundImage',
    'overlayImage',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = entityToEndpoint[entity];

        const res = await fetch(`${API}/${endpoint}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const dataKey = Object.keys(data).find(
          (k) => typeof data[k] === 'object'
        );

        const fetchedData = dataKey ? data[dataKey] : data;
        setFormData(fetchedData);

        // pour la modification de la date, si la date est déjà passé mais qu'on veut pas la changé on la keep
        if (entity === 'reservations' && fetchedData.date) {
          setOriginalDate(fetchedData.date.split('T')[0]);
        }

        if (
          entity === 'prestataires' ||
          entity === 'prestations' ||
          entity === 'reservations'
        ) {
          const pRes = await fetch(`${API}/prestations`);
          const spRes = await fetch(`${API}/sousprestations`);

          setAllPrestations((await pRes.json()).prestations || []);
          setAllSousPrestations((await spRes.json()).sousPrestations || []);
        }
      } catch (err) {
        alert('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {};

      if (entity === 'reservations') {
        ['date', 'heure', 'etat', 'modePaiement', 'description'].forEach(
          (f) => {
            if (formData[f] !== undefined) payload[f] = formData[f];
          }
        );

        const normalize = (d) => new Date(d).toISOString().split('T')[0];

        if (
          payload.date &&
          originalDate &&
          normalize(payload.date) !== normalize(originalDate) &&
          new Date(payload.date) < new Date().setHours(0, 0, 0, 0)
        ) {
          return alert('❌ Impossible de choisir une date passée');
        }
      } else if (entity === 'prestataires') {
        [
          'nom',
          'prenom',
          'email',
          'phone',
          'address',
          'description',
          'profilePicture',
        ].forEach((f) => {
          if (formData[f] !== undefined) payload[f] = formData[f];
        });
      } else if (entity === 'clients') {
        Object.entries(formData).forEach(([k, v]) => {
          if (
            ![
              'password',
              'role',
              '_id',
              '__v',
              'createdAt',
              'updatedAt',
            ].includes(k)
          ) {
            payload[k] = v;
          }
        });
      } else {
        payload = { ...formData };
        delete payload.password;
        delete payload.role;
      }

      for (const field of imageFields) {
        if (payload[field] instanceof File) {
          const fd = new FormData();
          fd.append('image', payload[field]);

          const uploadRes = await fetch(`${API}/upload/image`, {
            method: 'POST',
            body: fd,
          });
          const img = await uploadRes.json();
          payload[field] = img.url;
        }
      }

      const endpoint = entityToEndpoint[entity];
      const res = await fetch(`${API}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      alert('✅ Modification réussie');
      navigate(from);
    } catch {
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const renderReadableValue = (value, key) => {
    if (!value) return '';

    if (Array.isArray(value)) {
      if (value.length === 0) return '—';

      // Cas spécial tableaux d'images pour les réa
      if (['realisations'].includes(key)) {
        return `[${value.length}]`;
      }

      if (typeof value[0] !== 'object') {
        return value.join(' • ');
      }

      if (value[0]?.nom) {
        return value
          .map((v) => `${v.nom}${v.prenom ? ` ${v.prenom}` : ''}`)
          .join(' • ');
      }

      if (value[0]?.prestationId) {
        return value
          .map((p) => {
            const prestation = p.prestationId?.nom ?? '—';
            const sous = p.sousPrestations?.length
              ? p.sousPrestations.map((sp) => sp.nom).join(', ')
              : '—';
            return `${prestation} (${sous})`;
          })
          .join(' | ');
      }

      return `[${value.length}]`;
    }

    if (typeof value === 'object') {
      if (value.nom) return value.nom;
      if (value.prenom) return value.prenom;
      if (value.email) return value.email;
      if (value.title) return value.title;
      return '—';
    }

    return value.toString();
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="admineditpage">
      <h1 className="tittles">Modifier {entity}</h1>

      <form className="champs" onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => {
          if (
            [
              '_id',
              '__v',
              'password',
              'role',
              'createdAt',
              'updatedAt',
            ].includes(key)
          )
            return null;

          if (
            (entity === 'prestataires' &&
              ['selectedPrestations', 'realisations'].includes(key)) ||
            (entity === 'prestations' && key === 'sousPrestations') ||
            (entity === 'sousprestations' &&
              ['prestation', 'prestataires'].includes(key)) ||
            (entity === 'reservations' &&
              ['client', 'prestataire', 'prestations'].includes(key))
          ) {
            return (
              <div key={key} className="readonly-field">
                <label>{key}</label>
                <pre>{renderReadableValue(value, key)}</pre>
              </div>
            );
          }

          if (imageFields.includes(key)) {
            return (
              <div key={key}>
                <label>{key}</label>
                <input type="file" onChange={(e) => handleFileChange(e, key)} />
                {typeof value === 'string' && (
                  <img src={value} alt="" width={80} />
                )}
              </div>
            );
          }

          if (entity === 'reservations') {
            if (key === 'date') {
              const today = new Date().toISOString().split('T')[0];
              // Vérifier si la date actuelle est dans le passé
              const isPastDate = value ? value.split('T')[0] < today : false;

              return (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="date"
                    name="date"
                    value={value?.split('T')[0] ?? ''}
                    // si la date actuelle est passée, ne pas appliquer de min
                    min={isPastDate ? undefined : today}
                    onChange={handleChange}
                  />
                </div>
              );
            }

            if (key === 'heure') {
              const hours = [
                '08:00',
                '10:00',
                '12:00',
                '14:00',
                '16:00',
                '18:00',
                '20:00',
                '22:00',
              ];
              return (
                <div key={key}>
                  <label>{key}</label>
                  <select
                    name="heure"
                    value={value ?? ''}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir une heure --</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (key === 'etat') {
              const etats = ['en attente', 'acceptée', 'déclinée'];
              return (
                <div key={key}>
                  <label>{key}</label>
                  <select
                    name="etat"
                    value={value ?? ''}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir un état --</option>
                    {etats.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (key === 'modePaiement') {
              const modes = [
                'Espèces',
                'Carte via Stripe',
                'PayPal',
                'Virement Bancaire',
              ];
              return (
                <div key={key}>
                  <label>{key}</label>
                  <select
                    name="modePaiement"
                    value={value ?? ''}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir un mode de paiement --</option>
                    {modes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={key}>
                <label>{key}</label>
                <input name={key} value={value ?? ''} onChange={handleChange} />
              </div>
            );
          }

          return (
            <div key={key}>
              <label>{key}</label>
              <input name={key} value={value ?? ''} onChange={handleChange} />
            </div>
          );
        })}

        <div className="admin-edit-btn">
          <button type="submit" className="btn-secondary">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(from)}
          >
            Retour
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditPage;
