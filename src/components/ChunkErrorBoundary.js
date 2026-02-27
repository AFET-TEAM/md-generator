import React from 'react';

class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Chunk load error:', error, info);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="chunk-error" role="alert">
          <h3>Yükleme Başarısız</h3>
          <p>Bileşen yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.</p>
          <button onClick={this.handleRetry}>Tekrar Dene</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
