import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PerfilUsuario from './components/tecnico/PerfilUsuario';
import GenerateReportsTc from './components/tecnico/GenerateReportsTc';
import { colors } from '@mui/material';
import ServiceTc from './components/tecnico/ServiceTc';
import UserProfileAd from './components/Admini/UserProfileAd';
import ClientFaqs from './components/cliente/ClientFaqs';
import ClientNotifications from './components/cliente/ClientNotifications';
import NotificationFilter from './components/Admini/NotificationFilter';
import Notification from './components/Admini/Notification';

function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Página de Inicio de Sesión</h1>
    </div>
  );
}

function Report(){
  return(
    
        <div>
          <h2 style={{ textAlign: 'center' }}>Formulario de Reporte</h2>
          <GenerateReportsTc />
        </div>
     
    
  );
}




const tareaDemo = {
  nombre: 'Revisión de válvulas de presión en planta sur',
  descripcion: `Realizar inspección preventiva y mantenimiento de las válvulas de presión ubicadas
en la planta sur. Verificar estado de sellos, realizar limpieza, lubricación y
reemplazo si es necesario. Documentar hallazgos y tomar fotografías del antes y después.`,
  fechaLimite: '25/04/2025',
  estado: 'pendiente'
};

{/*<Route path="/detalle-tarea" element={<DetalleTarea tarea={tareaDemo} />} />*/}

function App() {
  return (
    <Router>
      <Routes>
       {/* <Route path="/" element={<PerfilUsuario />} /> */}
      {/*  <Route path="/login" element={<Login />} />  */}
      {/*   <Route path='/' element={<GenerateReportsTc/>}/> */}
      {/*   <Route path='/Report' element={<Report/>}/> */}
        
     {/*  <Route path='/' element={<ServiceTc tarea={tareaDemo}/>}/> */}

       {/*  <Route path='/' element={<UserProfileAd/>}/> */}

       {/*< Route path='/' element={<ClientFaqs/>}/>*/}

       {/* <Route path='/' element={<ClientNotifications/>}/> */}

       <Route path='/' element={<NotificationFilter/>}/>

      </Routes>
    </Router>
  );
}

export default App;