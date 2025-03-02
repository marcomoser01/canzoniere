import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import canzoni from '../../db/canzoni.json';
import './IndiceCanzoni.css';

const IndiceCanzoni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lettereSelezionate, setLettereSelezionate] = useState([]);
  const [canzoniList, setCanzoniList] = useState([]);
  const [lettereDisponibili, setLettereDisponibili] = useState([]);
  const [filtroAperto, setFiltroAperto] = useState(false);
  const filtroRef = useRef(null);
  
  // Prepara la lista completa delle canzoni all'avvio
  useEffect(() => {
    const list = [];
    const lettere = new Set();
    
    // Crea un array di tutte le canzoni con la loro lettera
    Object.keys(canzoni).forEach(letter => {
      canzoni[letter].forEach(canzone => {
        const primaLettera = canzone.nome.charAt(0).toUpperCase();
        lettere.add(primaLettera);
        
        list.push({
          nome: canzone.nome,
          url: canzone.url,
          lettera: primaLettera
        });
      });
    });
    
    // Ordina l'array per nome
    list.sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
    
    setCanzoniList(list);
    setLettereDisponibili(Array.from(lettere).sort());
  }, []);

  // Chiudi il filtro quando si clicca all'esterno
  useEffect(() => {
    function handleClickOutside(event) {
      if (filtroRef.current && !filtroRef.current.contains(event.target)) {
        setFiltroAperto(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtroRef]);
  
  // Gestisce il cambio nel campo di ricerca
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };
  
  // Gestisce il toggle di una lettera
  const toggleLettera = (lettera) => {
    setLettereSelezionate(prev => {
      if (prev.includes(lettera)) {
        // Rimuovi la lettera se già selezionata
        return prev.filter(l => l !== lettera);
      } else {
        // Aggiungi la lettera se non selezionata
        return [...prev, lettera];
      }
    });
  };
  
  // Gestisce il toggle di tutte le lettere
  const toggleTutteLettere = () => {
    if (lettereSelezionate.length === lettereDisponibili.length) {
      // Se tutte le lettere sono selezionate, deseleziona tutte
      setLettereSelezionate([]);
    } else {
      // Altrimenti seleziona tutte le lettere
      setLettereSelezionate([...lettereDisponibili]);
    }
  };
  
  // Controlla lo stato della checkbox "Seleziona tutte"
  const isTutteChecked = lettereSelezionate.length === lettereDisponibili.length && lettereDisponibili.length > 0;
  const isIndeterminate = lettereSelezionate.length > 0 && lettereSelezionate.length < lettereDisponibili.length;
  
  // Resetta tutte le lettere selezionate
  const resetFiltroLettere = () => {
    setLettereSelezionate([]);
    setFiltroAperto(false); // Chiudi il filtro dopo il reset
  };
  
  // Filtra le canzoni in base a ricerca e lettere selezionate
  const canzoniFiltrate = canzoniList.filter(canzone => {
    const matchesSearch = searchTerm 
      ? canzone.nome.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    
    const matchesLetters = lettereSelezionate.length > 0
      ? lettereSelezionate.includes(canzone.lettera)
      : true;
    
    return matchesSearch && matchesLetters;
  });
  
  // Renderizza ogni canzone come elemento della lista
  const renderCanzone = (canzone) => {
    if (!canzone.url) {
      return (
        <li key={canzone.nome} className="canzone-item no-link">
          {canzone.nome} <span className="no-spartito">(spartito non disponibile)</span>
        </li>
      );
    }
    
    // Codifica l'URL per passarlo come parametro nell'URL
    const encodedUrl = encodeURIComponent(canzone.url);
    
    return (
      <li key={canzone.nome} className="canzone-item">
        <Link to={`/spartito/${encodedUrl}`} className="canzone-link">
          {canzone.nome}
        </Link>
      </li>
    );
  };

  return (
    <div className="indice-canzoni-container">
      <h1>Indice delle Canzoni</h1>
      
      {/* Campo di ricerca e filtro */}
      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Cerca una canzone..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Cancella ricerca"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="filter-dropdown-container" ref={filtroRef}>
          <button 
            className={`filter-toggle-btn ${filtroAperto ? 'active' : ''} ${lettereSelezionate.length > 0 ? 'has-filters' : ''}`}
            onClick={() => setFiltroAperto(!filtroAperto)}
          >
            {lettereSelezionate.length > 0 
              ? `Filtri (${lettereSelezionate.length})` 
              : "Filtra per iniziale"}
            <span className="toggle-icon">{filtroAperto ? '▲' : '▼'}</span>
          </button>
          
          {filtroAperto && (
            <div className="filter-dropdown">
              <div className="filter-heading">
                <span>Seleziona le iniziali</span>
                {lettereSelezionate.length > 0 && (
                  <button 
                    className="reset-filters" 
                    onClick={resetFiltroLettere}
                  >
                    Azzera
                  </button>
                )}
              </div>
              
              <div className="lettere-checkbox-container">
                {/* Checkbox "Seleziona tutte" */}
                <label className="lettera-checkbox select-all">
                  <input
                    type="checkbox"
                    checked={isTutteChecked}
                    ref={el => {
                      if (el) {
                        el.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={toggleTutteLettere}
                  />
                  <span className="lettera-label">Tutte</span>
                </label>
                
                {/* Divider */}
                <div className="checkbox-divider"></div>
                
                {/* Checkbox per ogni lettera */}
                {lettereDisponibili.map(lettera => (
                  <label key={lettera} className="lettera-checkbox">
                    <input
                      type="checkbox"
                      checked={lettereSelezionate.includes(lettera)}
                      onChange={() => toggleLettera(lettera)}
                    />
                    <span className="lettera-label">{lettera}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Messaggi di ricerca e filtri attivi */}
      {(searchTerm || lettereSelezionate.length > 0) && (
        <div className="active-filters">
          {searchTerm && (
            <div className="filter-tag">
              Ricerca: "{searchTerm}"
            </div>
          )}
          {lettereSelezionate.length > 0 && (
            <div className="filter-tag">
              Iniziali: {lettereSelezionate.length === lettereDisponibili.length 
                ? "Tutte" 
                : lettereSelezionate.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {/* Lista canzoni */}
      <ul className="indice-canzoni-list">
        {canzoniFiltrate.length > 0 ? (
          canzoniFiltrate.map(canzone => renderCanzone(canzone))
        ) : (
          <p className="nessuna-canzone">
            {searchTerm || lettereSelezionate.length > 0
              ? "Nessuna canzone corrisponde ai criteri di ricerca" 
              : "Nessuna canzone disponibile"}
          </p>
        )}
      </ul>
    </div>
  );
};

export default IndiceCanzoni;