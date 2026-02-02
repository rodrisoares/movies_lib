import React, { useState } from 'react';
import './YearFilter.css';

const YearFilter = ({ onYearChange, initialStartYear = null, initialEndYear = null }) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(initialStartYear);
  const [endYear, setEndYear] = useState(initialEndYear);

  const handleApplyFilter = () => {
    onYearChange({ startYear, endYear });
  };

  const handleReset = () => {
    setStartYear(null);
    setEndYear(null);
    onYearChange({ startYear: null, endYear: null });
  };

  return (
    <div className="year-filter-container">
      <div className="year-filter-inputs">
        <div className="year-input-group">
          <label htmlFor="start-year">De:</label>
          <input
            id="start-year"
            type="number"
            min="1900"
            max={currentYear}
            value={startYear || ''}
            onChange={(e) => setStartYear(e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Ano inicial"
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
            onChange={(e) => setEndYear(e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Ano final"
          />
        </div>
      </div>
      <div className="year-filter-buttons">
        <button 
          className="apply-year-filter-btn"
          onClick={handleApplyFilter}
          disabled={!startYear && !endYear}
        >
          Aplicar
        </button>
        <button 
          className="reset-year-filter-btn"
          onClick={handleReset}
          disabled={!startYear && !endYear}
        >
          Limpar
        </button>
      </div>
    </div>
  );
};

export default YearFilter;