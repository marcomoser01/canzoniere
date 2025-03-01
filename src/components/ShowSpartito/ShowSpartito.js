import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ShowSpartito.css';

const ShowSpartito = () => {
  const { url } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Decodifica l'URL da URL-encoded a formato normale
  const decodedUrl = decodeURIComponent(url);
  
  // Converte un URL di Google Drive in un URL per il visualizzatore di Google
  const convertToGoogleViewerUrl = (googleDriveUrl) => {
    try {
      // Estrae l'ID del file dall'URL di Google Drive
      let fileId = '';
      
      if (googleDriveUrl.includes('open?id=')) {
        // Formato: https://drive.google.com/open?id=FILE_ID
        fileId = googleDriveUrl.split('open?id=')[1];
      } else if (googleDriveUrl.includes('/file/d/')) {
        // Formato: https://drive.google.com/file/d/FILE_ID/view
        fileId = googleDriveUrl.split('/file/d/')[1].split('/')[0];
      }
      
      if (fileId) {
        // Formato URL per il visualizzatore di Google
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      return googleDriveUrl; // Ritorna l'URL originale se non è possibile convertirlo
    } catch (e) {
      console.error('Errore nella conversione dell\'URL:', e);
      return googleDriveUrl;
    }
  };

  // URL convertito per il visualizzatore di Google
  const viewerUrl = convertToGoogleViewerUrl(decodedUrl);

  // Simula il caricamento per dare feedback all'utente
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <div className="spartito-container">
      <h2 className="spartito-title">Visualizzazione Spartito</h2>
      
      {loading && <div className="loading">Caricamento spartito in corso...</div>}
      
      {error && (
        <div className="error-container">
          <p>Si è verificato un errore nel caricamento dello spartito.</p>
          <p>Prova ad accedere direttamente allo spartito:</p>
          <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="external-link">
            Apri spartito esterno
          </a>
        </div>
      )}

      <div className={`pdf-container ${loading ? 'hidden' : ''}`}>
        <iframe
          src={viewerUrl}
          title="Visualizzatore PDF"
          width="100%"
          height="600"
          frameBorder="0"
          onError={handleIframeError}
          onLoad={() => setLoading(false)}
        ></iframe>
      </div>
      
      <div className="back-link-container">
        <Link to="/indice-canzoni" className="back-link">Torna all'indice</Link>
      </div>
    </div>
  );
};

export default ShowSpartito; 