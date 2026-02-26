import React from 'react';

const LoadingSpinner = ({ title, message, subMessage }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <h3>{title || '🤖 AI Ruleset Oluşturuluyor...'}</h3>
      <p>{message || 'Proje bilgileriniz işleniyor ve özelleştirilmiş kurallar seti hazırlanıyor.'}</p>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{subMessage || 'Bu işlem 10-30 saniye sürebilir.'}</p>
    </div>
  );
};

export default LoadingSpinner;
