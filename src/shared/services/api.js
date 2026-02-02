// Configuração base da API TMDB
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;
const IMG_BASE_URL = import.meta.env.VITE_IMG;
const SEARCH_URL = import.meta.env.VITE_SEARCH;

// Função utilitária para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Adicionar chave da API a todos os endpoints
const withApiKey = (endpoint) => {
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}api_key=${API_KEY}`;
};

export {
  API_BASE_URL,
  API_KEY,
  IMG_BASE_URL,
  SEARCH_URL,
  apiRequest,
  withApiKey,
};