import { useEffect, useState } from "react";
import MovieCard from "../features/movies/components/MovieCard";
import GenreFilter from "../features/search/components/GenreFilter";
import AdvancedFilters from "../features/search/components/AdvancedFilters";
import LoadingSpinner from "../features/ui/feedback/LoadingSpinner";
import ErrorMessage from "../features/ui/feedback/ErrorMessage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import "./MoviesGrid.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYearRange, setSelectedYearRange] = useState({ startYear: null, endYear: null });
  const [minRating, setMinRating] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);

  const getAllMovies = async (url) => {
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
      console.error('Erro ao carregar filmes:', err);
      setError(err.message || 'Erro ao carregar filmes');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  const getAllGenres = async () => {
    try {

      const baseUrl = moviesURL.replace('movie/', '');
      const url = `${baseUrl}genre/movie/list?api_key=${apiKey}&language=pt-BR`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAvailableGenres(data.genres || []);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      // Fallback: lista fixa de gêneros populares
      setAvailableGenres([
        { id: 28, name: "Ação" },
        { id: 12, name: "Aventura" },
        { id: 16, name: "Animação" },
        { id: 35, name: "Comédia" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentário" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Família" },
        { id: 14, name: "Fantasia" },
        { id: 36, name: "História" },
        { id: 27, name: "Terror" },
        { id: 10402, name: "Música" },
        { id: 9648, name: "Mistério" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Ficção Científica" },
        { id: 10770, name: "Cinema TV" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "Guerra" },
        { id: 37, name: "Faroeste" }
      ]);
    }
  };

  const handleGenreFilter = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Resetar para a primeira página
  };

  const handleAdvancedFilters = (filters) => {
    setSelectedYearRange(filters.yearRange);
    setMinRating(filters.minRating);
    setCurrentPage(1); // Resetar para a primeira página
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    getAllGenres();
  }, []);

  useEffect(() => {
    let url;
    
    // Construir parâmetros de filtragem
    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('language', 'pt-BR');
    params.append('page', currentPage);
    
    // Determinar se deve usar discover (para filtros avançados) ou popular
    const hasAdvancedFilters = selectedYearRange.startYear || selectedYearRange.endYear || minRating;
        
    if (hasAdvancedFilters || selectedGenre) {
      // Usar discover para filtros avançados ou gênero específico
      const baseUrl = moviesURL.replace('movie/', '');
      
      // Adicionar gênero se selecionado
      if (selectedGenre) {
        params.set('with_genres', selectedGenre);
        // Não adicionamos sort_by quando há gênero específico
        // Isso permite que o endpoint ordene por relevância do gênero
      } else if (!hasAdvancedFilters) {
        // Apenas popularidade quando não há filtros
        params.set('sort_by', 'popularity.desc');
      }
      
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
      
      url = `${baseUrl}discover/movie?${params.toString()}`;
    } else {
      // Usar popular quando não há filtros avançados
      url = `${moviesURL}popular?${params.toString()}`;
    }

    getAllMovies(url);
  }, [currentPage, selectedGenre, selectedYearRange, minRating, showAdvancedFilters]);

  return (
    <div className="container">

      <div className="filters-row">
        {/* Componente de filtros */}
        <GenreFilter 
          genres={availableGenres} 
          onSelect={handleGenreFilter}
          selectedGenre={selectedGenre}
        />
        
        {/* Botão para alternar filtros avançados */}
        <div className="toggle-advanced-filters">
          <button 
            className="toggle-filters-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title={selectedGenre ? `Filtro de gênero ativo: ${availableGenres.find(g => g.id === selectedGenre)?.name || 'Desconhecido'}. Clique para adicionar filtros avançados.` : 'Clique para mostrar filtros avançados (ano e nota)'}
          >
            {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
          </button>
        </div>
      </div>
      
      {/* Filtros avançados - condicionalmente visível */}
      {showAdvancedFilters && (
        <AdvancedFilters 
          onFiltersChange={handleAdvancedFilters}
          initialStartYear={selectedYearRange.startYear}
          initialEndYear={selectedYearRange.endYear}
          initialMinRating={minRating}
        />
      )}
      
      {error ? (
        <ErrorMessage 
          message={`Erro ao carregar filmes: ${error}`}
          onRetry={() => {
            let url;
            
            // Determinar se deve usar discover (para filtros avançados) ou popular
            const hasAdvancedFilters = selectedYearRange.startYear || selectedYearRange.endYear || minRating;
            
            if (hasAdvancedFilters || selectedGenre) {
              const baseUrl = moviesURL.replace('movie/', '');
              const params = new URLSearchParams();
              params.append('api_key', apiKey);
              params.append('language', 'pt-BR');
              params.append('page', currentPage);
              
              if (selectedGenre) {
                params.set('with_genres', selectedGenre);
                // Não adicionamos sort_by quando há gênero específico
              } else {
                params.set('sort_by', 'popularity.desc');
              }
              
              if (selectedYearRange.startYear) {
                params.set('primary_release_date.gte', `${selectedYearRange.startYear}-01-01`);
              }
              if (selectedYearRange.endYear) {
                params.set('primary_release_date.lte', `${selectedYearRange.endYear}-12-31`);
              }
              
              if (minRating) {
                params.set('vote_average.gte', minRating);
              }
              
              url = `${baseUrl}discover/movie?${params.toString()}`;
            } else {
              url = `${moviesURL}popular?api_key=${apiKey}&language=pt-BR&page=${currentPage}`;
            }
            
            getAllMovies(url);
          }}
          retryText="Recarregar filmes"
        />
      ) : loading ? (
        <LoadingSpinner message="Carregando filmes..." />
      ) : (
        <>
          <div className="movies-container">
            {movies.length > 0 ? (
              <>
              
                {movies.map((movie, index) => {
                  const hasCorrectGenre = selectedGenre ? 
                    movie.genre_ids?.includes(selectedGenre) : true;               
                  return <MovieCard key={movie.id} movie={movie} />;
                })}
              </>
            ) : (
              <p>Nenhum filme encontrado</p>
            )}
          </div>
          
          {/* Componente de Paginação */}
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
        </>
      )}
    </div>
  );
};

export default AllMovies;