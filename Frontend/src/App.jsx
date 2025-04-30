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
  `}
`;

function AppContent() {
  const location = useLocation();
  const hideMenuAndHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/home';

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && <MenuSide />}
      <Content hideStyles={hideMenuAndHeader}>
        {!hideMenuAndHeader && <HeaderBar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services" element={<ServicesPageTc />} />
          <Route path="/register" element={<CreateAccountPageCl />} />
          <Route path="/register-employee" element={<CreateEmployeeAd />} />
          <Route path="/home" element={<HomeSessionPageCl />} />
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
