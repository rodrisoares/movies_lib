import { useState, useEffect } from "react";
import MovieCard from "../features/movies/components/MovieCard";
import { useFavorites } from "../app/providers/FavoritesProvider";
import LoadingSpinner from "../features/ui/feedback/LoadingSpinner";
import ErrorMessage from "../features/ui/feedback/ErrorMessage";

import "./MoviesGrid.css";

const Favorites = () => {
  const { favorites } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    try {
      setLoading(true);
      const movies = favorites.map(fav => ({
        id: fav.id,
        title: fav.title,
        vote_average: fav.vote_average,
        poster_path: fav.poster_path
      }));
      setFavoriteMovies(movies);
    } catch (err) {
      console.error('Erro ao processar favoritos:', err);
      setError(err.message || 'Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  return (
    <div className="container">
      <h2 className="title">
        Meus <span className="featured-title">Favoritos</span>
      </h2>
      
      {error ? (
        <ErrorMessage 
          message={`Erro: ${error}`}
          onRetry={() => {
            try {
              const movies = favorites.map(fav => ({
                id: fav.id,
                title: fav.title,
                vote_average: fav.vote_average,
                poster_path: fav.poster_path
              }));
              setFavoriteMovies(movies);
              setError(null);
            } catch (err) {
              setError(err.message || 'Erro ao recarregar favoritos');
            }
          }}
          retryText="Recarregar favoritos"
        />
      ) : loading ? (
        <LoadingSpinner message="Carregando favoritos..." />
      ) : favoriteMovies.length === 0 ? (
        <div className="no-favorites">
          <h3>Você ainda não tem filmes favoritos</h3>
          <p>Procure por filmes e clique no coração para adicioná-los aos seus favoritos!</p>
        </div>
      ) : (
        <div className="movies-container">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;