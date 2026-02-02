import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import GenreFilter from "../components/GenreFilter";
import AdvancedFilters from "../components/AdvancedFilters";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import "./MoviesGrid.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYearRange, setSelectedYearRange] = useState({ startYear: null, endYear: null });
  const [minRating, setMinRating] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTopRatedMovies = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setTopMovies(data.results || []);
      setTotalPages(data.total_pages > 50 ? 50 : data.total_pages); // Limitar a 50 páginas
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
      setError(err.message || 'Erro ao carregar filmes');
      setTopMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllGenres = async () => {
    try {
      const baseUrl = moviesURL.replace('movie/', '');
      const url = `${baseUrl}genre/movie/list?api_key=${apiKey}&language=pt-BR`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAllGenres(data.genres || []);
      } else {
        console.error('Erro na resposta da API de gêneros:', res.status);
        setAllGenres([]); 
      }
    } catch (error) {
      console.error('Erro ao carregar os gêneros:', error);
      setAllGenres([]); 
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
    
    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('language', 'pt-BR');
    params.append('page', currentPage);
    
    const hasAdvancedFilters = selectedYearRange.startYear || selectedYearRange.endYear || minRating;
    
    if (hasAdvancedFilters || selectedGenre) {
      const baseUrl = moviesURL.replace('movie/', '');
      
      if (selectedGenre) {
        params.set('with_genres', selectedGenre);
        // Não adicionar 'sort_by' para permitir que a API ordene por relevância do gênero
      } else if (hasAdvancedFilters) {
        // Adicionar ordenação por nota apenas se não houver gênero selecionado
        params.set('sort_by', 'vote_average.desc');
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
      url = `${moviesURL}top_rated?${params.toString()}`;
    }
    
    getTopRatedMovies(url);
  }, [currentPage, selectedGenre, selectedYearRange, minRating, showAdvancedFilters]);

  return (
    <div className="container">
    
      <div className="filters-row">
        <GenreFilter 
          genres={allGenres} 
          onSelect={handleGenreFilter}
          selectedGenre={selectedGenre}
        />
        
        <div className="toggle-advanced-filters">
          <button 
            className="toggle-filters-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title={selectedGenre ? `Filtro de gênero ativo: ${allGenres.find(g => g.id === selectedGenre)?.name || 'Desconhecido'}. Clique para adicionar filtros avançados.` : 'Clique para mostrar filtros avançados (ano e nota)'}
          >
            {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
          </button>
        </div>
      </div>
      
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
          onRetry={() => getTopRatedMovies()}
          retryText="Recarregar filmes"
        />
      ) : loading ? (
        <LoadingSpinner message="Carregando filmes..." />
      ) : (
        <>
          <div className="movies-container">
            {topMovies.length > 0 ? (
              topMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <p>Nenhum filme encontrado para os filtros selecionados.</p>
            )}
          </div>
          
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

export default Home;
