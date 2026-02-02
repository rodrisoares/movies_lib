import React, { useState } from 'react';
import './RatingFilter.css';

const RatingFilter = ({ onRatingChange, initialMinRating = null }) => {
  const [minRating, setMinRating] = useState(initialMinRating);

  const handleApplyFilter = () => {
    onRatingChange(minRating);
  };

  const handleReset = () => {
    setMinRating(null);
    onRatingChange(null);
  };

  const handleSliderChange = (e) => {
    setMinRating(parseFloat(e.target.value));
  };

  return (
    <div className="rating-filter-container">
      <div className="rating-filter-content">
        <div className="rating-display">
          <label htmlFor="rating-slider">Nota mínima: {minRating !== null ? minRating.toFixed(1) : 'Qualquer'}</label>
        </div>
        <div className="rating-slider-container">
          <input
            id="rating-slider"
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={minRating !== null ? minRating : 0}
            onChange={handleSliderChange}
            className="rating-slider"
          />
          <div className="rating-scale">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>
      <div className="rating-filter-buttons">
        <button 
          className="apply-rating-filter-btn"
          onClick={handleApplyFilter}
          disabled={minRating === null}
        >
          Aplicar
        </button>
        <button 
          className="reset-rating-filter-btn"
          onClick={handleReset}
          disabled={minRating === null}
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

export default RatingFilter;