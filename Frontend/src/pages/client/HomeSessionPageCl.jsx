import styled from "styled-components";
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from "../../components/client/MenuContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWrench, 
  faHistory, 
  faCircleUser, 
  faInfoCircle,
  faChartLine,
  faClock,
  faCheckCircle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { handleGetHistoryServiceByCliente } from "../../controllers/client/getHistoryServiceByCliente.controller";

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const DashboardContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 4rem;
  padding-top: 2.5rem;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
    padding-top: 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
    padding-top: 1.5rem;
  }
`;

const WelcomeSection = styled.header`
  background-color: #007BFF;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1350px) {
    padding: 1.2rem;
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;


const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border-left: 4px solid ${(props) => props.$color || '#007BFF'};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.$bgColor || '#e3f2fd'};
  color: ${(props) => props.$color || '#007BFF'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
`;

const QuickAccessSection = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const QuickAccessCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.$hoverColor || '#007BFF'};
  }
`;

const QuickAccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${(props) => props.$bgColor || '#e3f2fd'};
  color: ${(props) => props.$color || '#007BFF'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  transition: transform 0.3s;

  ${QuickAccessCard}:hover & {
    transform: scale(1.1);
  }
`;

const QuickAccessLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const HomeSessionPageCl = () => {
  const { collapsed } = useMenu();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    programadas: 0,
    completados: 0,
    enProceso: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const clienteId = decoded.id;
        const response = await handleGetHistoryServiceByCliente(clienteId);
        const services = response.data.data || [];

        // Los estados de las visitas son: programada, en_camino, iniciada, completada, cancelada
        const statsData = {
          total: services.length,
          programadas: services.filter(s => {
            const estado = s.estado?.toLowerCase();
            return estado === 'programada' || estado === 'en_camino' || estado === 'en camino';
          }).length,
          completados: services.filter(s => {
            const estado = s.estado?.toLowerCase();
            return estado === 'completada' || estado === 'completado';
          }).length,
          enProceso: services.filter(s => {
            const estado = s.estado?.toLowerCase();
            return estado === 'iniciada' || estado === 'iniciado';
          }).length
        };

        setStats(statsData);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickAccessOptions = [
    {
      label: 'Servicios',
      icon: faWrench,
      path: '/cliente/servicios',
      color: '#007BFF',
      bgColor: '#e3f2fd'
    },
    {
      label: 'Historial',
      icon: faHistory,
      path: '/cliente/historial',
      color: '#007BFF',
      bgColor: '#e3f2fd'
    },
    {
      label: 'Perfil',
      icon: faCircleUser,
      path: '/cliente/perfil',
      color: '#007BFF',
      bgColor: '#e3f2fd'
    },
    {
      label: 'Acerca de',
      icon: faInfoCircle,
      path: '/acerca-de-nosotros',
      color: '#007BFF',
      bgColor: '#e3f2fd'
    }
  ];

  const handleQuickAccess = (path) => {
    navigate(path);
  };

  return (
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          BIENVENIDO A TU DASHBOARD
        </WelcomeSection>
        <DashboardContainer>
          <StatsGrid>
            <StatCard $color="#007BFF">
              <StatHeader>
                <div>
                  <StatValue>{loading ? '...' : stats.total}</StatValue>
                  <StatLabel>Total de Visitas</StatLabel>
                </div>
                <StatIcon $bgColor="#e3f2fd" $color="#007BFF">
                  <FontAwesomeIcon icon={faChartLine} />
                </StatIcon>
              </StatHeader>
            </StatCard>

            <StatCard $color="#007BFF">
              <StatHeader>
                <div>
                  <StatValue>{loading ? '...' : stats.programadas}</StatValue>
                  <StatLabel>Visitas Programadas</StatLabel>
                </div>
                <StatIcon $bgColor="#e3f2fd" $color="#007BFF">
                  <FontAwesomeIcon icon={faClock} />
                </StatIcon>
              </StatHeader>
            </StatCard>

            <StatCard $color="#007BFF">
              <StatHeader>
                <div>
                  <StatValue>{loading ? '...' : stats.completados}</StatValue>
                  <StatLabel>Visitas Completadas</StatLabel>
                </div>
                <StatIcon $bgColor="#e3f2fd" $color="#007BFF">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </StatIcon>
              </StatHeader>
            </StatCard>

            <StatCard $color="#007BFF">
              <StatHeader>
                <div>
                  <StatValue>{loading ? '...' : stats.enProceso}</StatValue>
                  <StatLabel>En Proceso</StatLabel>
                </div>
                <StatIcon $bgColor="#e3f2fd" $color="#007BFF">
                  <FontAwesomeIcon icon={faSpinner} />
                </StatIcon>
              </StatHeader>
            </StatCard>
          </StatsGrid>

          <QuickAccessSection>
            <SectionTitle>Acceso Rápido</SectionTitle>
            <QuickAccessGrid>
              {quickAccessOptions.map((option) => (
                <QuickAccessCard
                  key={option.path}
                  onClick={() => handleQuickAccess(option.path)}
                  $hoverColor={option.color}
                >
                  <QuickAccessIcon
                    $bgColor={option.bgColor}
                    $color={option.color}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                  </QuickAccessIcon>
                  <QuickAccessLabel>{option.label}</QuickAccessLabel>
                </QuickAccessCard>
              ))}
            </QuickAccessGrid>
          </QuickAccessSection>
        </DashboardContainer>
      </PageContainer>
    </>
  );
};

export default HomeSessionPageCl;
