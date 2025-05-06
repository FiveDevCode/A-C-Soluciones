import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Global from "./Global";
import LoginPage from './pages/common/LoginPage';
import ServicesPageTc from './pages/technical/ServicesPageTc';
import styled from 'styled-components';
import MenuSide from './components/common/MenuSide';
import HeaderBar from './components/common/HeaderBar';
import CreateAccountPageCl from './pages/client/CreateAccountPageCl';
import CreateEmployeeAd from './pages/administrator/CreateEmployeeAd';
import HomeSessionPageCl from './pages/client/HomeSessionPageCl';
import ProfileUserTc from './pages/technical/ProfileUserTc';
import HomeAd from './pages/administrator/HomeAd';
import HomeTc from './pages/technical/HomeTc';
import PrivateRoute from './components/common/PrivateRoute';
import { useEffect, useMemo, useState } from 'react';
import Home from './pages/common/Home';
import ServiceTc from './pages/technical/ServiceTc';
import UserProfileAd from './pages/administrator/UserProfileAd';
import EditClientAd from './pages/administrator/EditClientAd';
import CreateServiceAd from './pages/administrator/CreateServiceAd';
import CreateAdministratorAd from './pages/administrator/CreateAdministratorAd';
import CreateAdminPermit from './pages/administrator/CreateAdminPermit';
import AssignTaskPageAd from './pages/administrator/AssignTaskPageAd';
import ServiceOpenCl from './components/client/ServiceOpen';

const Container = styled.div`
  ${({ hideStyles }) => hideStyles ? `
    display: block;
    width: auto;
  ` : `
    display: flex;
    width: 100%;
  `}
`;

const Content = styled.div`
  ${({ hideStyles }) => hideStyles ? `
    display: block;
    width: auto;
    padding: 0;
    gap: 0;
  ` : `
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 4rem;
    gap: 2.5rem;
    margin-bottom: 1rem;
  `}
`;

function AppContent() {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, [location.pathname]);

  const hideMenuAndHeader =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/' ||
    role === 'cliente';

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && <MenuSide />}
      <Content hideStyles={hideMenuAndHeader}>
        {!hideMenuAndHeader && <HeaderBar />}
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPageCl />} />

          {/* Rutas protegidas por tipo de usuario */}
          <Route path="/home" element={
            <PrivateRoute roleRequired="cliente">
              <HomeSessionPageCl />
            </PrivateRoute>
          } />

          <Route path="/services" element={
            <PrivateRoute roleRequired="tecnico">
              <ServicesPageTc />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute roleRequired="tecnico">
              <ProfileUserTc />
            </PrivateRoute>
          } />

          <Route path="/homeTc" element={
            <PrivateRoute roleRequired="tecnico">
              <HomeTc />
            </PrivateRoute>
          } />
          
          <Route path="/view-service" element={
            <PrivateRoute roleRequired="tecnico">
              <ServiceTc />
            </PrivateRoute>
          } />

          <Route path="/register-employee" element={
            <PrivateRoute roleRequired="administrador">
              <CreateEmployeeAd />
            </PrivateRoute>
          } />

          <Route path="/homeAd" element={
            <PrivateRoute roleRequired="administrador">
              <HomeAd />
            </PrivateRoute>
          } />

          <Route path="/profile-technical/:id" element={
            <PrivateRoute roleRequired="administrador">
              <UserProfileAd />
            </PrivateRoute>
          } />

          <Route path="/edit-client/:id" element={
            <PrivateRoute roleRequired="administrador">
              <EditClientAd/>
            </PrivateRoute>
          } />
          
          <Route path="/register-service" element={
            <PrivateRoute roleRequired="administrador">
              <CreateServiceAd/>
            </PrivateRoute>
          } />

          <Route path="/register-administrator" element={
            <PrivateRoute roleRequired="administrador">
              <CreateAdministratorAd/>
            </PrivateRoute>
          } />

          <Route path="/administrator-permit" element={
            <PrivateRoute roleRequired="administrador">
              <CreateAdminPermit/>
            </PrivateRoute>
          } />

          <Route path="/assing-task" element={
            <PrivateRoute roleRequired="administrador">
              <AssignTaskPageAd/>
            </PrivateRoute>
          } />

          <Route path="/service-open" element={
            <PrivateRoute roleRequired="cliente">
              <ServiceOpenCl />
            </PrivateRoute>
          } />

          {/* Ruta para acceso denegado */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Content>
    </Container>
  );
}

function App() {
  return (
    <>
      <Global />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;
