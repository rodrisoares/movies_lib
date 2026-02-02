import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import YearFilter from "../components/YearFilter";
import RatingFilter from "../components/RatingFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const searchURL = import.meta.env.VITE_SEARCH;
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

import "./MoviesGrid.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  
  const query = searchParams.get("q");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYearRange, setSelectedYearRange] = useState({ startYear: null, endYear: null });
  const [minRating, setMinRating] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getSearchedMovies = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages > 50 ? 50 : data.total_pages);
    } catch (err) {
      console.error('Erro na busca de filmes:', err);
      setError(err.message || 'Erro na busca de filmes');
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  const getFeaturedMovies = async () => {
    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('language', 'pt-BR');
    params.append('page', currentPage);
    
    // Adicionar filtros de ano se estiverem definidos
    if (selectedYearRange.startYear) {
      params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
    }
    if (selectedYearRange.endYear) {
      params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
    }
    
    // Adicionar filtro de nota mínima se definido
    if (minRating) {
      params.set('vote_average.gte', minRating);
    }
    
    const topRatedUrl = `${moviesURL}top_rated?${params.toString()}`;
    await getFeaturedMoviesExtended(topRatedUrl);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Resetar página quando a query muda
  }, [query]);

  useEffect(() => {
    if (query && query.trim()) {
      // Buscar filmes específicos
      const params = new URLSearchParams();
      params.append('api_key', apiKey);
      params.append('query', encodeURIComponent(query.trim()));
      params.append('language', 'pt-BR');
      params.append('page', currentPage);
      
      // Adicionar filtros de ano se estiverem definidos
      if (selectedYearRange.startYear) {
        params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
      }
      if (selectedYearRange.endYear) {
        params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
      }
      
      // Adicionar filtro de nota mínima se definido
      if (minRating) {
        params.set('vote_average.gte', minRating);
      }
      
      const baseURL = searchURL.replace(/\/$/, '');
      const searchWithQueryURL = `${baseURL}?${params.toString()}`;
      getSearchedMovies(searchWithQueryURL);
    } else {
      // Mostrar filmes em destaque quando o input estiver vazio
      const params = new URLSearchParams();
      params.append('api_key', apiKey);
      params.append('language', 'pt-BR');
      params.append('page', currentPage);
      
      // Adicionar filtros de ano se estiverem definidos
      if (selectedYearRange.startYear) {
        params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
      }
      if (selectedYearRange.endYear) {
        params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
      }
      
      // Adicionar filtro de nota mínima se definido
      if (minRating) {
        params.set('vote_average.gte', minRating);
      }
      
      const topRatedUrl = `${moviesURL}top_rated?${params.toString()}`;
      getFeaturedMoviesExtended(topRatedUrl);
    }
  }, [query, currentPage, searchURL, moviesURL, apiKey, selectedYearRange, minRating]);

  // Função estendida para buscar filmes em destaque com filtros
  const getFeaturedMoviesExtended = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages > 50 ? 50 : data.total_pages);
    } catch (err) {
      console.error('Erro ao carregar filmes em destaque:', err);
      setError(err.message || 'Erro ao carregar filmes em destaque');
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <h2 className="title">
        {query && query.trim() 
          ? <>Resultados para: <span className="query-text">{query}</span></>
          : "Filmes em destaque"
        }
      </h2>
      
      {/* Botão para alternar filtros avançados */}
      <div className="toggle-advanced-filters">
        <button 
          className="toggle-filters-btn"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
        </button>
      </div>
      
      {/* Filtros avançados - condicionalmente visível */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <YearFilter 
            onYearChange={setSelectedYearRange}
            initialStartYear={selectedYearRange.startYear}
            initialEndYear={selectedYearRange.endYear}
          />
          <RatingFilter 
            onRatingChange={setMinRating}
            initialMinRating={minRating}
          />
        </div>
      )}
      
      {error ? (
        <ErrorMessage 
          message={`Erro: ${error}`}
          onRetry={() => {
            if (query && query.trim()) {
              const params = new URLSearchParams();
              params.append('api_key', apiKey);
              params.append('query', encodeURIComponent(query.trim()));
              params.append('language', 'pt-BR');
              params.append('page', currentPage);
              
              // Adicionar filtros de ano se estiverem definidos
              if (selectedYearRange.startYear) {
                params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
              }
              if (selectedYearRange.endYear) {
                params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
              }
              
              // Adicionar filtro de nota mínima se definido
              if (minRating) {
                params.set('vote_average.gte', minRating);
              }
              
              const baseURL = searchURL.replace(/\/$/, '');
              const searchWithQueryURL = `${baseURL}?${params.toString()}`;
              getSearchedMovies(searchWithQueryURL);
            } else {
              const params = new URLSearchParams();
              params.append('api_key', apiKey);
              params.append('language', 'pt-BR');
              params.append('page', currentPage);
              
              // Adicionar filtros de ano se estiverem definidos
              if (selectedYearRange.startYear) {
                params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
              }
              if (selectedYearRange.endYear) {
                params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
              }
              
              // Adicionar filtro de nota mínima se definido
              if (minRating) {
                params.set('vote_average.gte', minRating);
              }
              
              const topRatedUrl = `${moviesURL}top_rated?${params.toString()}`;
              getFeaturedMoviesExtended(topRatedUrl);
            }
          }}
          retryText="Recarregar resultados"
        />
      ) : loading ? (
        <LoadingSpinner message="Carregando filmes..." />
      ) : (
        <>
          <div className="movies-container">
            {movies && movies.length > 0 ? (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : query && query.trim() ? (
              <p>Nenhum filme encontrado para "{query}"</p>
            ) : (
              <p>Use a barra de pesquisa acima para buscar filmes...</p>
            )}
          </div>
          
          {/* Componente de Paginação - só mostra quando há resultados */}
          {movies && movies.length > 0 && totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <BsChevronLeft /> Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Próximo <BsChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
