import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Global from "./Global";
import LoginPage from "./pages/common/LoginPage";
import styled from "styled-components";
import MenuSideAd from "./components/administrator/MenuSideAd";
import CreateAccountPageCl from "./pages/client/CreateAccountPageCl";
import HomeSessionPageCl from "./pages/client/HomeSessionPageCl";
import ProfileUserTc from "./pages/technical/ProfileUserTc";
import HomeAd from "./pages/administrator/HomeAd";
import HomeTc from "./pages/technical/HomeTc";
import PrivateRoute from "./components/common/PrivateRoute";
import { useEffect, useState } from "react";
import Home from "./pages/common/Home";
import ViewVisitPageTc from "./pages/technical/ViewVisitPageTc";
import ServicesAllPageCl from "./pages/client/ServicesAllPageCl";
import HeaderBarCl from "./components/client/HeaderBarCl";
import FooterHomeCl from "./components/client/FooterHomeCl";
import RecoverPasswordPage from "./pages/common/RecoverPasswordPage";
import RecoverCodePage from "./pages/common/RecoverCodePage";
import RecoverChangePage from "./pages/common/RecoverChangePage";
import ProfilePageAd from "./pages/administrator/ProfilePageAd";
import CreateReportPageTc from "./pages/technical/CreateReportPageTc";
import ViewVisitListPageTc from "./pages/technical/ViewVisitListPageTc";
import MenuSideTc from "./components/technical/MenuSideTc";
import ViewReportListPageTc from "./pages/technical/ViewReportListPageTc";
import ViewServicePageTc from "./pages/technical/ViewServicePageTc";
import ViewViewVisitListCompletePageTc from "./pages/technical/ViewVisitListCompletePageTc";
import ViewViewVisitListCanceledPageTc from "./pages/technical/ViewVisitListCanceledPageTc";
import ViewViewVisitListWayPageTc from "./pages/technical/ViewVisitListWayPageTc";
import ViewViewVisitListProgramedPageTc from "./pages/technical/ViewVisitListProgramedPageTc";
import ViewViewVisitListStartPageTc from "./pages/technical/ViewVisitListStartPageTc";
import EditProfileTc from "./pages/technical/EditProfileTcPageTc";
import ProfileClientPageCl from "./pages/client/ProfileClientPageCl";
import EditProfileCl from "./pages/client/EditProfileCl";
import ViewServiceListPageTc from "./pages/technical/ViewServiceListPageTc";
import AboutUsPage from "./pages/common/AboutUsPage";
import ErrorPage from "./errorPages/ErrorPage.jsx";
import ClientFaqsPage from "./pages/common/ClientFaqsPage";
import TermsAndConditionsPage from "./pages/common/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/common/PrivacyPolicyPage";
// Páginas compartidas (shared)
import BillPage from "./pages/shared/BillPage.jsx";
import PaymentAccountPage from "./pages/shared/PaymentAccountPage.jsx";
import InventoryPage from "./pages/shared/InventoryPage.jsx";
import NotificationPage from "./pages/shared/NotificationPage.jsx";

// Páginas de Contador
import HomeAc from "./pages/accountant/HomeAc.jsx";
import ProfilePageAc from "./pages/accountant/ProfilePageAc.jsx";
import EditProfilePageAc from "./pages/accountant/EditProfilePageAc.jsx";

// Páginas de Cliente
import HistoryServicesPage from "./pages/client/HistoryServicesPage.jsx";
import { MenuProvider } from "./components/client/MenuContext.jsx";
import { MenuProvider as MenuProviderTc } from "./components/technical/MenuContext.jsx";

// Páginas de Administrador
import VisitPageAd from "./pages/administrator/VisitPageAd.jsx";
import ServicePageAd from "./pages/administrator/ServicePageAd.jsx";
import AccountingPageAd from "./pages/administrator/AccountingPageAd.jsx";
import AdministratorPageAd from "./pages/administrator/AdministratorPageAd.jsx";
import ClientPageAd from "./pages/administrator/ClientPageAd.jsx";
import TechnicalPageAd from "./pages/administrator/TechnicalPageAd.jsx";
import RequestPageAd from "./pages/administrator/RequestPageAd.jsx";
import EditAdminPageAd from "./pages/administrator/EditAdminPageAd.jsx";
import MaintenanceReportPageAd from "./pages/administrator/MaintenanceReportAd.jsx";
import PumpingReportPageAd from "./pages/administrator/PumpingReportAd.jsx";
import ReportPageAd from "./pages/administrator/ReportPageAd.jsx";

const Container = styled.div`
  ${({ hideStyles }) =>
    hideStyles
      ? `
    display: block;
    width: auto;
  `
      : `
    display: flex;
    width: 100%;
    height: 100vh;
  `}
`;

const Content = styled.div`
  ${({ hideStyles }) =>
    hideStyles
      ? `
    display: block;
    width: auto;
    padding: 0;
    gap: 0;
  `
      : `
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2.5rem;
    margin-bottom: 1rem;
  `}
`;

function AppContent() {
  const location = useLocation();
  const [role, setRole] = useState(null);

  const publicRoutes = [
    "/",
    "/iniciar-sesion",
    "/registrarse",
    "/recuperar-contrasena",
    "/codigo-recuperacion",
    "/cambiar-contrasena",
  ];

  const isPublicPage = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, [location.pathname]);

  const isCliente = role === "cliente";
  const hideMenuAndHeader =
    location.pathname === "/iniciar-sesion" ||
    location.pathname === "/registrarse" ||
    location.pathname === "/recuperar-contrasena" ||
    location.pathname === "/codigo-recuperacion" ||
    location.pathname === "/cambiar-contrasena" ||
    location.pathname === "/acerca-de-nosotros" ||
    location.pathname === "/preguntas-frecuentes" ||
    location.pathname === "/terminos-y-condiciones" ||
    location.pathname === "/politicas-de-privacidad" ||
    location.pathname === "/" ||
    role === "cliente";

  return (
    <Container hideStyles={hideMenuAndHeader}>
      {!hideMenuAndHeader && role === "administrador" && <MenuSideAd />}
      {!hideMenuAndHeader && role === "tecnico" && <MenuSideTc />}
      {!hideMenuAndHeader && role === "Contador" && <MenuSideAd />}
      <Content hideStyles={hideMenuAndHeader}>
        {/* {!hideMenuAndHeader && (role === 'administrador' || role === 'tecnico' || role === 'Contador') && <HeaderBar />} */}
        {/* HeaderBarCl removido - el perfil ahora está en el menú vertical */}

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
          <Route
            path="/recuperar-contrasena"
            element={<RecoverPasswordPage />}
          />
          <Route path="/codigo-recuperacion" element={<RecoverCodePage />} />
          <Route path="/cambiar-contrasena" element={<RecoverChangePage />} />
          <Route path="/acerca-de-nosotros" element={<AboutUsPage />} />
          <Route path="/preguntas-frecuentes" element={<ClientFaqsPage />} />
          <Route
            path="/terminos-y-condiciones"
            element={<TermsAndConditionsPage />}
          />
          <Route
            path="/politicas-de-privacidad"
            element={<PrivacyPolicyPage />}
          />

          {/* ********************************* Rutas Cliente ********************************** */}
          <Route
            path="/cliente/inicio"
            element={
              <PrivateRoute roleRequired="cliente">
                <HomeSessionPageCl />
              </PrivateRoute>
            }
          />

          <Route
            path="/cliente/servicios"
            element={
              <PrivateRoute roleRequired="cliente">
                <ServicesAllPageCl />
              </PrivateRoute>
            }
          />

          <Route
            path="/cliente/historial"
            element={
              <PrivateRoute roleRequired="cliente">
                <HistoryServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cliente/perfil"
            element={
              <PrivateRoute roleRequired="cliente">
                <ProfileClientPageCl />
              </PrivateRoute>
            }
          />

          <Route
            path="/cliente/editar-perfil"
            element={
              <PrivateRoute roleRequired="cliente">
                <EditProfileCl />
              </PrivateRoute>
            }
          />
          {/* ********************************* Rutas Contador ********************************** */}

          <Route
            path="/contador/inicio"
            element={
              <PrivateRoute roleRequired="Contador">
                <HomeAc />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/facturas"
            element={
              <PrivateRoute roleRequired="Contador">
                <BillPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/cuentas"
            element={
              <PrivateRoute roleRequired="Contador">
                <PaymentAccountPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/inventario"
            element={
              <PrivateRoute roleRequired="Contador">
                <InventoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/notificaciones"
            element={
              <PrivateRoute roleRequired="Contador">
                <NotificationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/perfil"
            element={
              <PrivateRoute roleRequired="Contador">
                <ProfilePageAc />
              </PrivateRoute>
            }
          />

          <Route
            path="/contador/editar-perfil"
            element={
              <PrivateRoute roleRequired="Contador">
                <EditProfilePageAc />
              </PrivateRoute>
            }
          />

          {/* ********************************* Rutas Técnico ********************************** */}
          <Route
            path="/tecnico/inicio"
            element={
              <PrivateRoute roleRequired="tecnico">
                <HomeTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/servicios"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewServiceListPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewVisitListPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/reportes"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewReportListPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visita/:id"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewVisitPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas-completadas"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewViewVisitListCompletePageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas-canceladas"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewViewVisitListCanceledPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas-en-camino"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewViewVisitListWayPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas-programadas"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewViewVisitListProgramedPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/visitas-iniciadas"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewViewVisitListStartPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/perfil"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ProfileUserTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/reporte/:id"
            element={
              <PrivateRoute roleRequired="tecnico">
                <CreateReportPageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/servicio/:id"
            element={
              <PrivateRoute roleRequired="tecnico">
                <ViewServicePageTc />
              </PrivateRoute>
            }
          />

          <Route
            path="/tecnico/editar-perfil"
            element={
              <PrivateRoute roleRequired="tecnico">
                <EditProfileTc />
              </PrivateRoute>
            }
          />

          {/* ********************************* Rutas Administrador ********************************** */}
          <Route
            path="/admin/inicio"
            element={
              <PrivateRoute roleRequired="administrador">
                <HomeAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/perfil/"
            element={
              <PrivateRoute roleRequired="administrador">
                <ProfilePageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/solicitudes"
            element={
              <PrivateRoute roleRequired="administrador">
                <RequestPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/editar-perfil"
            element={
              <PrivateRoute roleRequired="administrador">
                <EditAdminPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/tecnicos"
            element={
              <PrivateRoute roleRequired="administrador">
                <TechnicalPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/clientes"
            element={
              <PrivateRoute roleRequired="administrador">
                <ClientPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/administradores"
            element={
              <PrivateRoute roleRequired="administrador">
                <AdministratorPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/servicios"
            element={
              <PrivateRoute roleRequired="administrador">
                <ServicePageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reportes"
            element={
              <PrivateRoute roleRequired="administrador">
                <ReportPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/contadores"
            element={
              <PrivateRoute roleRequired="administrador">
                <AccountingPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/facturas"
            element={
              <PrivateRoute roleRequired="administrador">
                <BillPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/cuentas"
            element={
              <PrivateRoute roleRequired="administrador">
                <PaymentAccountPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/inventario"
            element={
              <PrivateRoute roleRequired="administrador">
                <InventoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/notificaciones"
            element={
              <PrivateRoute roleRequired="administrador">
                <NotificationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/visitas"
            element={
              <PrivateRoute roleRequired="administrador">
                <VisitPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reporte-mantenimiento"
            element={
              <PrivateRoute roleRequired="administrador">
                <MaintenanceReportPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reporte-bombeo"
            element={
              <PrivateRoute roleRequired="administrador">
                <PumpingReportPageAd />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reporte"
            element={
              <PrivateRoute roleRequired="administrador">
                <ReportPageAd />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Content>
    </Container>
  );
}

function App() {
  return (
    <>
      <Global />
      <MenuProvider>
        <MenuProviderTc>
          <Router>
            <AppContent />
          </Router>
        </MenuProviderTc>
      </MenuProvider>
    </>
  );
}

export default App;
