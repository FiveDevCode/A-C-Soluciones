import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PerfilUsuario from './components/tecnico/PerfilUsuario';

// Puedes crear un componente de Login simple por ahora
function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Página de Inicio de Sesión</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PerfilUsuario />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;