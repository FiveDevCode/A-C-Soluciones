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
import ServicesAllPageCl from './pages/client/ServicesAllPageCl';
import HeaderBarCl from './components/client/HeaderBarCl';
import FooterHomeCl from './components/client/FooterHomeCl';
import AssignVisitPageAd from './pages/administrator/AssignVisitPageAd';
import EditServicePageAd from './pages/administrator/EditServicePageAd';
import RecoverPasswordPage from './pages/common/RecoverPasswordPage';
import RecoverCodePage from './pages/common/RecoverCodePage';
import RecoverChangePage from './pages/common/RecoverChangePage';
import ProfilePageAd from './pages/administrator/ProfilePageAd';
import EditAdminPageAd from './pages/administrator/EditAdminPageAd';
import EditTechnicalPageAd from './pages/administrator/EditTechnicalPageAd';
import UserProfileClientPageAd from './pages/administrator/UserProfileClientPageAd';
import ReportFormTc from './components/technical/ReportFormTc';
import ViewServicePageAd from './pages/administrator/ViewServicePageAd';

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
    const storedRole = sessionStorage.getItem('userRole');
    setRole(storedRole);
  }, [location.pathname]);

  const isCliente = role === 'cliente';
  const hideMenuAndHeader =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/recover' ||
    location.pathname === '/recover-code' ||
    location.pathname === '/recover-change' ||
    location.pathname === '/' ||
    role === 'cliente';

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && !isCliente && <MenuSide />}
      <Content hideStyles={hideMenuAndHeader}>
        {!hideMenuAndHeader && !isCliente && <HeaderBar />}
        {isCliente && role && <HeaderBarCl />}
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPageCl />} />
          <Route path="/recover" element={<RecoverPasswordPage />} />
          <Route path="/recover-code" element={<RecoverCodePage />} />
          <Route path="/recover-change" element={<RecoverChangePage />} />

          {/* Rutas protegidas por tipo de usuario */}
          {/* ********************************* Rutas Cliente ********************************** */}

          <Route path="/home" element={
            <PrivateRoute roleRequired="cliente">
              <HomeSessionPageCl />
            </PrivateRoute>
          } />

          <Route path="/services-all" element={
            <PrivateRoute roleRequired="cliente">
              <ServicesAllPageCl />
            </PrivateRoute>
          } />

          {/* ********************************* Rutas Tecnico ********************************** */}

          <Route path="/services" element={
            <PrivateRoute roleRequired="tecnico">
              <ServicesPageTc />
            </PrivateRoute>
          } />

          <Route path="/view-service/:id" element={
            <PrivateRoute roleRequired="tecnico">
              <ServiceTc />
            </PrivateRoute>
          } />

          <Route path="/profileTc" element={
            <PrivateRoute roleRequired="tecnico">
              <ProfileUserTc />
            </PrivateRoute>
          } />

          <Route path="/homeTc" element={
            <PrivateRoute roleRequired="tecnico">
              <HomeTc />
            </PrivateRoute>
          } />
          
          <Route path="/report" element={
            <PrivateRoute roleRequired="tecnico">
              <ReportFormTc />
            </PrivateRoute>
          } />
          
          {/* ********************************* Rutas Administrador ********************************** */}

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

          <Route path="/profile-client/:id" element={
            <PrivateRoute roleRequired="administrador">
              <UserProfileClientPageAd />
            </PrivateRoute>
          } />

          <Route path="/viewMore-service/:id" element={
            <PrivateRoute roleRequired="administrador">
              <ViewServicePageAd />
            </PrivateRoute>
          } />

          <Route path="/edit-client/:id" element={
            <PrivateRoute roleRequired="administrador">
              <EditClientAd/>
            </PrivateRoute>
          } />

          <Route path="/edit-technical/:id" element={
            <PrivateRoute roleRequired="administrador">
              <EditTechnicalPageAd/>
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

          <Route path="/assing-visit" element={
            <PrivateRoute roleRequired="administrador">
              <AssignVisitPageAd/>
            </PrivateRoute>
          } />

          <Route path="/edit-service/:id" element={
            <PrivateRoute roleRequired="administrador">
              <EditServicePageAd/>
            </PrivateRoute>
          } />

          <Route path="/profileAd" element={
            <PrivateRoute roleRequired="administrador">
              <ProfilePageAd/>
            </PrivateRoute>
          } />

          <Route path="/edit-profileAd" element={
            <PrivateRoute roleRequired="administrador">
              <EditAdminPageAd/>
            </PrivateRoute>
          } />

          {/* Ruta para acceso denegado */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        {isCliente && role && <FooterHomeCl />}
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
