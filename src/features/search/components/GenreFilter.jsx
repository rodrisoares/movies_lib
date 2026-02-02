import { useState } from "react";
import "./GenreFilter.css";

const GenreFilter = ({ genres, onSelect, selectedGenre }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleGenreSelect = (genreId) => {
    onSelect(genreId);
    setIsOpen(false);
  };

  const clearFilter = () => {
    onSelect(null);
    setIsOpen(false);
  };

  return (
    <div className="genre-filter">
      <div className="filter-header">
        <button 
          className="filter-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>
            {selectedGenre 
              ? genres.find(g => g.id === selectedGenre)?.name || 'Filtrar por Gênero'
              : 'Filtrar por Gênero'
            }
          </span>
          <svg 
            className={`arrow ${isOpen ? 'open' : ''}`} 
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
          >
            <path d="M1 4l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
        
        {selectedGenre && (
          <button 
            className="clear-filter"
            onClick={clearFilter}
            title="Limpar filtro"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="genre-options">
            <button
              className={`genre-option ${!selectedGenre ? 'active' : ''}`}
              onClick={() => handleGenreSelect(null)}
            >
              Todos os gêneros
            </button>
            
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`genre-option ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => handleGenreSelect(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;