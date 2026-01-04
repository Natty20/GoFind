import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const { data } = await axios.get(
          `https://gofind-v9ee.onrender.com/api/search?query=${query}`
        );
        setResults(data.results);
      } catch (err) {
        console.error('Erreur recherche:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <h2>Résultats pour "{query}"</h2>
      {results.length === 0 ? (
        <p>Aucun résultat trouvé</p>
      ) : (
        <ul>
          {results.map((p) => (
            <li key={p._id}>
              {p.nom} - {p.ville} - {p.specialites.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
