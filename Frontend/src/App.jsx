import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Global from "./Global";
import LoginPage from './pages/common/LoginPage';
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
import { useEffect, useState } from 'react';
import Home from './pages/common/Home';
import ViewVisitPageTc from './pages/technical/ViewVisitPageTc';
import UserProfileAd from './pages/administrator/UserProfileAd';
import EditClientAd from './pages/administrator/EditClientAd';
import CreateServiceAd from './pages/administrator/CreateServiceAd';
import CreateAdministratorAd from './pages/administrator/CreateAdministratorAd';
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
import ViewServicePageAd from './pages/administrator/ViewServicePageAd';
import CreateReportPageTc from './pages/technical/CreateReportPageTc';
import ViewVisitListPageAd from './pages/administrator/ViewVisitListPageAd';
import ViewVisitPageAd from './pages/administrator/ViewVisitPageAd';
import CreateReportPageAd from './pages/administrator/CreateReportPageAd';
import VisitListPageTc from './pages/technical/VisitListPageTc';
import ViewRequestListPageAd from './pages/administrator/ViewRequestListPageAd';
import ViewRequestPageAd from './pages/administrator/ViewRequestPageAd';

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
    location.pathname === '/iniciar-sesion' ||
    location.pathname === '/registrarse' ||
    location.pathname === '/recuperar-contrasena' ||
    location.pathname === '/codigo-recuperacion' ||
    location.pathname === '/cambiar-contrasena' ||
    location.pathname === '/' ||
    role === 'cliente';

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && !isCliente && <MenuSide />}
      <Content hideStyles={hideMenuAndHeader}>
        {!hideMenuAndHeader && !isCliente && <HeaderBar />}
        {isCliente && role && <HeaderBarCl />}

          {/* 
            * Estructura de rutas:
            * - /public/* -> Acceso abierto
            * - /cliente/* -> Requiere rol cliente
            * - /tecnico/* -> Requiere rol tecnico
            * - /admin/* -> Requiere rol administrador
          */}
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/iniciar-sesion" element={<LoginPage />} />
            <Route path="/registrarse" element={<CreateAccountPageCl />} />
            <Route path="/recuperar-contrasena" element={<RecoverPasswordPage />} />
            <Route path="/codigo-recuperacion" element={<RecoverCodePage />} />
            <Route path="/cambiar-contrasena" element={<RecoverChangePage />} />

            {/* ********************************* Rutas Cliente ********************************** */}
            <Route path="/cliente/inicio" element={
              <PrivateRoute roleRequired="cliente">
                <HomeSessionPageCl />
              </PrivateRoute>
            } />

            <Route path="/cliente/servicios" element={
              <PrivateRoute roleRequired="cliente">
                <ServicesAllPageCl />
              </PrivateRoute>
            } />

            {/* ********************************* Rutas Técnico ********************************** */}
            <Route path="/tecnico/inicio" element={
              <PrivateRoute roleRequired="tecnico">
                <HomeTc />
              </PrivateRoute>
            } />

            <Route path="/tecnico/visitas" element={
              <PrivateRoute roleRequired="tecnico">
                <VisitListPageTc />
              </PrivateRoute>
            } />

            <Route path="/tecnico/ver-visita/:id" element={
              <PrivateRoute roleRequired="tecnico">
                <ViewVisitPageTc />
              </PrivateRoute>
            } />

            <Route path="/tecnico/perfil" element={
              <PrivateRoute roleRequired="tecnico">
                <ProfileUserTc />
              </PrivateRoute>
            } />

            <Route path="/tecnico/reporte/:id" element={
              <PrivateRoute roleRequired="tecnico">
                <CreateReportPageTc />
              </PrivateRoute>
            } />

            {/* ********************************* Rutas Administrador ********************************** */}
            <Route path="/admin/inicio" element={
              <PrivateRoute roleRequired="administrador">
                <HomeAd />
              </PrivateRoute>
            } />

            <Route path="/admin/registrar-empleado" element={
              <PrivateRoute roleRequired="administrador">
                <CreateEmployeeAd />
              </PrivateRoute>
            } />

            <Route path="/admin/perfil-tecnico/:id" element={
              <PrivateRoute roleRequired="administrador">
                <UserProfileAd />
              </PrivateRoute>
            } />

            <Route path="/admin/perfil-cliente/:id" element={
              <PrivateRoute roleRequired="administrador">
                <UserProfileClientPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/ver-mas-servicio/:id" element={
              <PrivateRoute roleRequired="administrador">
                <ViewServicePageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/editar-cliente/:id" element={
              <PrivateRoute roleRequired="administrador">
                <EditClientAd />
              </PrivateRoute>
            } />

            <Route path="/admin/editar-tecnico/:id" element={
              <PrivateRoute roleRequired="administrador">
                <EditTechnicalPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/registrar-servicio" element={
              <PrivateRoute roleRequired="administrador">
                <CreateServiceAd />
              </PrivateRoute>
            } />

            <Route path="/admin/registrar-administrador" element={
              <PrivateRoute roleRequired="administrador">
                <CreateAdministratorAd />
              </PrivateRoute>
            } />

            <Route path="/admin/asignar-visita" element={
              <PrivateRoute roleRequired="administrador">
                <AssignVisitPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/editar-servicio/:id" element={
              <PrivateRoute roleRequired="administrador">
                <EditServicePageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/perfil" element={
              <PrivateRoute roleRequired="administrador">
                <ProfilePageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/editar-cliente/" element={
              <PrivateRoute roleRequired="administrador">
                <EditAdminPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/visitas" element={
              <PrivateRoute roleRequired="administrador">
                <ViewVisitListPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/ver-visita/:id" element={
              <PrivateRoute roleRequired="administrador">
                <ViewVisitPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/reporte/:id" element={
              <PrivateRoute roleRequired="administrador">
                <CreateReportPageAd />
              </PrivateRoute>
            } />
            
            <Route path="/admin/solicitudes" element={
              <PrivateRoute roleRequired="administrador">
                <ViewRequestListPageAd />
              </PrivateRoute>
            } />

            <Route path="/admin/solicitud/:id" element={
              <PrivateRoute roleRequired="administrador">
                <ViewRequestPageAd />
              </PrivateRoute>
            } />

            
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
