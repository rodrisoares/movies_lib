import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message = 'Ocorreu um erro. Por favor, tente novamente.', onRetry = null, retryText = 'Tentar novamente' }) => {
  return (
    <div className="error-container">
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <p className="error-text">{message}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;