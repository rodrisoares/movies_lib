import React, { useState } from 'react';
import './AdvancedFilters.css';

const AdvancedFilters = ({ 
  onFiltersChange, 
  initialStartYear = null, 
  initialEndYear = null, 
  initialMinRating = null 
}) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(initialStartYear);
  const [endYear, setEndYear] = useState(initialEndYear);
  const [minRating, setMinRating] = useState(initialMinRating);

  const handleApplyFilters = () => {
    onFiltersChange({
      yearRange: { startYear, endYear },
      minRating: minRating
    });
  };

  const handleReset = () => {
    setStartYear(null);
    setEndYear(null);
    setMinRating(null);
    onFiltersChange({
      yearRange: { startYear: null, endYear: null },
      minRating: null
    });
  };

  const handleYearChange = (type, value) => {
    const yearValue = value ? parseInt(value, 10) : null;
    if (type === 'start') {
      setStartYear(yearValue);
    } else {
      setEndYear(yearValue);
    }
  };

  const handleRatingChange = (e) => {
    setMinRating(parseFloat(e.target.value));
  };

  const hasActiveFilters = startYear || endYear || minRating !== null;

  return (
    <div className="advanced-filters-container">
      <div className="advanced-filters-content">
        {/* Filtro de Ano */}
        <div className="filter-section">
          <h3 className="filter-title">Filtrar por Ano</h3>
          <div className="year-filters-row">
            <div className="year-input-group">
              <label htmlFor="start-year">De:</label>
              <input
                id="start-year"
                type="number"
                min="1900"
                max={currentYear}
                value={startYear || ''}
                onChange={(e) => handleYearChange('start', e.target.value)}
                placeholder="Ano inicial"
                className="year-input"
              />
            </div>
            <div className="year-input-group">
              <label htmlFor="end-year">Até:</label>
              <input
                id="end-year"
                type="number"
                min="1900"
                max={currentYear}
                value={endYear || ''}
                onChange={(e) => handleYearChange('end', e.target.value)}
                placeholder="Ano final"
                className="year-input"
              />
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="filter-divider"></div>

        {/* Filtro de Nota */}
        <div className="filter-section">
          <h3 className="filter-title">Filtrar por Nota</h3>
          <div className="rating-filter-section">
            <div className="rating-display">
              <label htmlFor="rating-slider">
                Nota mínima: {minRating !== null ? minRating.toFixed(1) : 'Qualquer'}
              </label>
            </div>
            <div className="rating-slider-container">
              <input
                id="rating-slider"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={minRating !== null ? minRating : 0}
                onChange={handleRatingChange}
                className="rating-slider"
              />
              <div className="rating-scale">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de controle */}
      <div className="advanced-filters-buttons">
        <button 
          className="apply-filters-btn"
          onClick={handleApplyFilters}
          disabled={!hasActiveFilters}
        >
          Aplicar Filtros
        </button>
        <button 
          className="reset-filters-btn"
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          Limpar Todos
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;