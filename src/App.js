import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import IndiceCanzoni from './components/IndiceCanzoni/IndiceCanzoni';
import ShowSpartito from './components/ShowSpartito/ShowSpartito';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/indice-canzoni" element={<IndiceCanzoni />} />
            <Route path="/spartito/:url" element={<ShowSpartito />} />
            <Route path="/" element={<h1 className="home-title">Benvenuto nel Canzoniere</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
