import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Header from './components/Header/Header';

function App() {
  return (
    <div>
        <Header />
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                {/* Add other routes here */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
