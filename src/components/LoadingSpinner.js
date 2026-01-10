import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <h3>🤖 AI Ruleset Oluşturuluyor...</h3>
      <p>Proje bilgileriniz işleniyor ve özelleştirilmiş kurallar seti hazırlanıyor.</p>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Bu işlem 10-30 saniye sürebilir.</p>
    </div>
  );
};

export default LoadingSpinner;
