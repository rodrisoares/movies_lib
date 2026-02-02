import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaStar, FaHeart, FaRegHeart, FaInfoCircle } from "react-icons/fa";
import { useFavorites } from "../hooks/useFavorites";

const imagesURL = import.meta.env.VITE_IMG;
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const MovieCard = ({ movie, showLink = true }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loadingExtraInfo, setLoadingExtraInfo] = useState(false);
  const [errorExtraInfo, setErrorExtraInfo] = useState(null);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(movie);
  };

  // Buscar informações extras (tagline e gêneros) apenas na tela inicial
  useEffect(() => {
    if (showLink && (!movie.tagline || !movie.genres)) {
      const fetchMovieDetails = async () => {
        setLoadingExtraInfo(true);
        setErrorExtraInfo(null);
        try {
          const url = `${moviesURL}${movie.id}?api_key=${apiKey}&language=pt-BR`;
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          setMovieDetails(data);
        } catch (err) {
          console.error('Erro ao carregar informações extras para:', movie.title, err);
          setErrorExtraInfo(err.message || 'Erro ao carregar informações extras');
        } finally {
          setLoadingExtraInfo(false);
        }
      };
      
      fetchMovieDetails();
    }
  }, [showLink, movie.id, movie.tagline, movie.genres]);

  return (
    <div className="movie-card">
      {showLink ? (
        <Link to={`/movie/${movie.id}`} className="movie-image-link">
          <img
            src={movie.poster_path ? imagesURL + movie.poster_path : '/placeholder-movie.svg'}
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-movie.svg';
            }}
          />
        </Link>
      ) : (
        <img
          src={movie.poster_path ? imagesURL + movie.poster_path : '/placeholder-movie.svg'}
          alt={movie.title}
          onError={(e) => {
            e.target.src = '/placeholder-movie.svg';
          }}
        />
      )}
      {showLink ? (
        // Layout para tela inicial (botão ao lado de detalhes)
        <>
          <h2>{movie.title}</h2>
          
          {/* Tagline - apenas na tela inicial */}
          <p 
            className="movie-tagline" 
            data-empty={!showLink || !(movie.tagline || (movieDetails && movieDetails.tagline))}
          >
            {showLink && (movie.tagline || (movieDetails && movieDetails.tagline)) 
              ? (errorExtraInfo ? 'Informações indisponíveis' : loadingExtraInfo ? 'Carregando...' : (movie.tagline || movieDetails?.tagline))
              : '\u00A0' /* Espaço em branco para manter layout */
            }
          </p>
          
          {/* Ano, Nota e Gêneros na mesma linha */}
          <div className="genres-rating-container">
            <div className="movie-year-small">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : (movieDetails?.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A')}
            </div>
            <div className="movie-rating-small">
              <FaStar /> {typeof movie.vote_average === 'number' && !isNaN(movie.vote_average) ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
            {(movie.genres || (movieDetails && movieDetails.genres)) && (
              <div className="movie-genres-horizontal">
                {errorExtraInfo ? (
                  <span className="genres-loading">Informações indisponíveis</span>
                ) : loadingExtraInfo ? (
                  <span className="genres-loading">Carregando...</span>
                ) : (
                  (movie.genres || movieDetails?.genres)?.map((genre, index) => (
                    <span key={genre.id} className="genre-badge">
                      {genre.name}{index < (movie.genres || movieDetails?.genres)?.length - 1 ? ', ' : '' }
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="movie-actions-wrapper">
            <div className="movie-actions-row">
              <Link to={`/movie/${movie.id}`} title="Ver detalhes">
                <FaInfoCircle />
              </Link>
              <button 
                className={`favorite-button ${isFavorite(movie.id) ? 'favorited' : ''}`} 
                onClick={handleFavoriteClick}
                title={isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {isFavorite(movie.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </>
      ) : (
        // Layout para página de detalhes (botão ao lado do título)
        <>
          <div className="movie-header">
            <h2>{movie.title}</h2>
            <button 
              className={`favorite-button-mini ${isFavorite(movie.id) ? 'favorited' : ''}`} 
              onClick={handleFavoriteClick}
              title={isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isFavorite(movie.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          {/* Tagline na página de detalhes - do filme específico */}
          <p 
            className="movie-tagline-detail" 
            data-empty={!(movie.tagline || (movieDetails && movieDetails.tagline))}
          >
            {(movie.tagline || (movieDetails && movieDetails.tagline)) 
              ? (errorExtraInfo ? 'Informações indisponíveis' : loadingExtraInfo ? 'Carregando...' : (movie.tagline || movieDetails?.tagline))
              : '\u00A0' /* Espaço em branco para manter layout */
            }
          </p>
          {/* Vote average abaixo do tagline */}
          <p className="movie-rating-detail">
            <FaStar /> {movie.vote_average}
          </p>
        </>
      )}
    </div>
  );
};

export default MovieCard;
