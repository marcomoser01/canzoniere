import React from 'react';
import { Link } from 'react-router-dom';
import canzoni from '../../db/canzoni.json';
import './IndiceCanzoni.css';

const IndiceCanzoni = () => {
  const renderCanzoni = () => {
    const canzoniList = [];
    
    // Crea un array di tutte le canzoni con la loro lettera
    Object.keys(canzoni).forEach(letter => {
      canzoni[letter].forEach(canzone => {
        // Se non c'è URL, non crea link
        if (!canzone.url) {
          canzoniList.push({
            nome: canzone.nome,
            element: (
              <li key={canzone.nome} className="canzone-item no-link">
                {canzone.nome} <span className="no-spartito">(spartito non disponibile)</span>
              </li>
            )
          });
          return;
        }
        
        // Codifica l'URL per passarlo come parametro nell'URL
        const encodedUrl = encodeURIComponent(canzone.url);
        
        canzoniList.push({
          nome: canzone.nome,
          element: (
            <li key={canzone.nome} className="canzone-item">
              <Link to={`/spartito/${encodedUrl}`} className="canzone-link">
                {canzone.nome}
              </Link>
            </li>
          )
        });
      });
    });
    
    // Ordina l'array per nome
    canzoniList.sort((a, b) => a.nome.localeCompare(b.nome));
    
    // Restituisce solo gli elementi React
    return canzoniList.map(item => item.element);
  };

  return (
    <div className="indice-canzoni-container">
      <h1>Indice delle Canzoni</h1>
      <ul className="indice-canzoni-list">
        {renderCanzoni()}
      </ul>
    </div>
  );
};

export default IndiceCanzoni; 