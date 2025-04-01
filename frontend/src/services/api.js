import axios from 'axios';

const API_URL = 'https://gofind.cloud/api'; 


export const getPrestations = async () => {
  try {
    const response = await axios.get(`${API_URL}/prestations`);
    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la récupération des prestations:', error);
    return [];
  }
};
