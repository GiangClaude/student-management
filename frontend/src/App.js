import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import EditStudent from './pages/EditStudent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/edit/:id" element={<EditStudent />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;