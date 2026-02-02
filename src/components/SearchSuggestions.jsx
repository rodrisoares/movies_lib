import React from 'react';
import { Link } from 'react-router-dom';
import './SearchSuggestions.css';

const imagesURL = import.meta.env.VITE_IMG;

const SearchSuggestions = ({ suggestions, isVisible, onSelectSuggestion }) => {
  if (!isVisible || !suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="search-suggestions">
      <ul>
        {suggestions.map((movie) => (
          <li key={movie.id}>
            <Link 
              to={`/movie/${movie.id}`} 
              onClick={() => onSelectSuggestion(movie)}
            >
              <img 
                src={movie.poster_path 
                  ? imagesURL.replace('/w500/', '/w92/') + movie.poster_path
                  : '/placeholder-movie.svg'} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = '/placeholder-movie.svg';
                }}
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{movie.title}</span>
                <span className="suggestion-year">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;