import React from 'react';

const LoadingSpinner = ({ title, message, subMessage }) => {
  const resolvedTitle = title || '🤖 AI Ruleset Oluşturuluyor...';
  return (
    <div className="loading-spinner" role="status" aria-live="polite" aria-busy="true">
      <div className="spinner" aria-hidden="true"></div>
      <span className="sr-only">{resolvedTitle}</span>
      <h3 aria-hidden="true">{resolvedTitle}</h3>
      <p>{message || 'Proje bilgileriniz işleniyor ve özelleştirilmiş kurallar seti hazırlanıyor.'}</p>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{subMessage || 'Bu işlem 10-30 saniye sürebilir.'}</p>
    </div>
  );
};

// Performance Optimization: Wrapped in React.memo to prevent unnecessary re-renders
// when the parent component updates while the spinner is visible.
export default React.memo(LoadingSpinner);
