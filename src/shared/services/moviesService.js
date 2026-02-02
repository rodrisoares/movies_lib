import { apiRequest, withApiKey } from './api';

// Serviço para operações relacionadas a filmes
const moviesService = {
  // Obter filme por ID
  getMovieById: async (id, language = 'pt-BR') => {
    const endpoint = withApiKey(`/movie/${id}?language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter filmes populares
  getPopularMovies: async (page = 1, language = 'pt-BR') => {
    const endpoint = withApiKey(`/movie/popular?page=${page}&language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter filmes mais bem avaliados
  getTopRatedMovies: async (page = 1, language = 'pt-BR') => {
    const endpoint = withApiKey(`/movie/top_rated?page=${page}&language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter filmes em tendência
  getTrendingMovies: async (timeWindow = 'week', language = 'pt-BR') => {
    const endpoint = withApiKey(`/trending/movie/${timeWindow}?language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter filmes por gênero
  getMoviesByGenre: async (genreId, page = 1, language = 'pt-BR') => {
    const endpoint = withApiKey(`/discover/movie?with_genres=${genreId}&page=${page}&language=${language}`);
    return await apiRequest(endpoint);
  },

  // Buscar filmes por título
  searchMovies: async (query, page = 1, language = 'pt-BR') => {
    const endpoint = withApiKey(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter sugestões de busca
  getSearchSuggestions: async (query, language = 'pt-BR') => {
    const endpoint = withApiKey(`/search/movie?query=${encodeURIComponent(query)}&language=${language}`);
    const response = await apiRequest(endpoint);
    return response.results.slice(0, 5); // Limitar a 5 sugestões
  },

  // Obter créditos do filme (atores, diretores)
  getMovieCredits: async (id) => {
    const endpoint = withApiKey(`/movie/${id}/credits`);
    return await apiRequest(endpoint);
  },

  // Obter vídeos do filme (trailers, teasers)
  getMovieVideos: async (id, language = 'pt-BR') => {
    const endpoint = withApiKey(`/movie/${id}/videos?language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter recomendações de filmes similares
  getMovieRecommendations: async (id, page = 1, language = 'pt-BR') => {
    const endpoint = withApiKey(`/movie/${id}/recommendations?page=${page}&language=${language}`);
    return await apiRequest(endpoint);
  },

  // Obter imagens do filme
  getMovieImages: async (id) => {
    const endpoint = withApiKey(`/movie/${id}/images`);
    return await apiRequest(endpoint);
  },
};

export default moviesService;