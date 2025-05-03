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
  const hideMenuAndHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && <MenuSide />}
      <Content hideStyles={hideMenuAndHeader}>
        {!hideMenuAndHeader && <HeaderBar />}
        <Routes>
          {/* Rutas públicas */}
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
