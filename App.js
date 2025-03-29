import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ConfigPage from './pages/ConfigPage';
import OutputPage from './pages/OutputPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">Config Page</Link>
        <Link to="/output">Output Page</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/output" element={<OutputPage />} />
      </Routes>
    </Router>
  );
}

export default App;
