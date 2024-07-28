import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AlbumPage from './pages/AlbumPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AlbumPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
