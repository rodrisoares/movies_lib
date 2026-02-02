import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BsGraphUp,
  BsWallet2,
  BsHourglassSplit,
  BsFillFileEarmarkTextFill,
  BsArrowLeft,
} from "react-icons/bs";

import MovieCard from "../features/movies/components/MovieCard";
import LoadingSpinner from "../features/ui/feedback/LoadingSpinner";
import ErrorMessage from "../features/ui/feedback/ErrorMessage";

import "./Movie.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const getMovie = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setMovie(data);
    } catch (err) {
      console.error('Erro ao carregar detalhes do filme:', err);
      setError(err.message || 'Erro ao carregar detalhes do filme');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  useEffect(() => {
    const movieUrl = `${moviesURL}${id}?api_key=${apiKey}&language=pt-BR`;
    getMovie(movieUrl);
  }, []);

  return (
    <div className="movie-page">
      {/* Botão de voltar - apenas ícone */}
      <button className="back-button-icon" onClick={handleGoBack} title="Voltar">
        <BsArrowLeft />
      </button>
      
      {error ? (
        <ErrorMessage 
          message={`Erro ao carregar detalhes do filme: ${error}`}
          onRetry={() => {
            const movieUrl = `${moviesURL}${id}?api_key=${apiKey}&language=pt-BR`;
            getMovie(movieUrl);
          }}
          retryText="Recarregar filme"
        />
      ) : loading ? (
        <LoadingSpinner message="Carregando detalhes do filme..." />
      ) : movie ? (
        <>
          <MovieCard movie={movie} showLink={false} />
          
          {/* Exibição dos gêneros */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="info genres">
              <h3>Gêneros:</h3>
              <div className="genres-list">
                {movie.genres.map((genre, index) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}{index < movie.genres.length - 1 ? ', ' : '' }
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="info">
            <h3>Ano:</h3>
            <p className="year-display">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
          </div>
          <div className="info">
            <h3>
              <BsWallet2 /> Orçamento:
            </h3>
            <p>{formatCurrency(movie.budget)}</p>
          </div>
          <div className="info">
            <h3>
              <BsGraphUp /> Receita:
            </h3>
            <p>{formatCurrency(movie.revenue)}</p>
          </div>
          <div className="info">
            <h3>
              <BsHourglassSplit /> Duração:
            </h3>
            <p>{movie.runtime} minutos</p>
          </div>
          <div className="info description">
            <h3>
              <BsFillFileEarmarkTextFill /> Descrição:
            </h3>
            <p>{movie.overview}</p>
          </div>
        </>
      ) : (
        <ErrorMessage 
          message="Filme não encontrado"
          onRetry={() => {
            const movieUrl = `${moviesURL}${id}?api_key=${apiKey}&language=pt-BR`;
            getMovie(movieUrl);
          }}
          retryText="Tentar novamente"
        />
      )}
    </div>
  );
};

export default Movie;