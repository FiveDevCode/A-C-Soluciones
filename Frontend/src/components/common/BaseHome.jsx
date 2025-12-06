import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotificationBell from './NotificationBell';

// Intentar importar el contexto del menú técnico
let useMenuTc = null;
try {
  const menuContext = require("../technical/MenuContext");
  useMenuTc = menuContext.useMenu;
} catch (e) {
  // Si no existe, no hay problema
}

/* ---------- 🎨 Estilos base reutilizables ---------- */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  gap: 1.5rem;
  padding: 2rem;
  transition: margin-left 0.3s ease;

  @media (max-width: 1350px) {
    padding: 1.2rem;
    gap: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0;
    gap: 0;
    margin-left: 0;
  }
`;

const Header = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1350px) {
    padding: 1.5rem;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 1rem 0.75rem 1rem 70px;
    border-radius: 0;
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  @media (max-width: 1350px) {
    h1 {
      font-size: 1.6rem;
      margin: 0 0 0.4rem 0;
    }
    
    p {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    
    h1 {
      font-size: 1.1rem;
      margin: 0 0 0.2rem 0;
      line-height: 1.2;
    }
    
    p {
      font-size: 0.75rem;
      line-height: 1.3;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1350px) {
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.2rem;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  @media (max-width: 1350px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 0.65rem;
    top: 3px;
    right: 3px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 0;

  @media (max-width: 1350px) {
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.5rem;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 1350px) {
    padding: 1.2rem;
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 0.65rem;
    gap: 0.6rem;
    border-radius: 8px;
    flex-direction: column;
    text-align: center;
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.color || '#1976d2'};
  flex-shrink: 0;

  @media (max-width: 1350px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    font-size: 1.2rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }

  @media (max-width: 1350px) {
    h3 {
      font-size: 0.85rem;
    }

    p {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 0.7rem;
      margin: 0 0 0.2rem 0;
      line-height: 1.2;
    }

    p {
      font-size: 1.3rem;
      font-weight: 600;
    }
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  @media (max-width: 1350px) {
    padding: 1.2rem;
  }

  @media (max-width: 768px) {
    margin: 0.75rem;
    padding: 0.75rem;
    border-radius: 8px;
    flex: 1;
    min-height: 400px;
  }
`;

const ScrollableContent = styled.div`
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
    border-radius: 2px;
  }

  @media (max-width: 1350px) {
    font-size: 1.15rem;
    margin: 0 0 1.2rem 0;

    &::before {
      width: 3.5px;
      height: 21px;
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 0.75rem 0;

    &::before {
      width: 3px;
      height: 18px;
    }
  }
`;

const SkeletonStatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SkeletonIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* ---------- 🧩 Componente BaseHome ---------- */
const BaseHome = ({
  title,
  subtitle,
  headerGradient,
  stats = [],
  sectionTitle,
  sectionGradient,
  activityComponent: ActivityComponent,
  notificationCount = 0,
  notificationPath,
  profilePath,
  emptyMessage = "No hay datos disponibles por el momento.",
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  let collapsed = false;
  
  // Intentar obtener el estado del menú si es técnico
  if (useMenuTc) {
    try {
      const menuContext = useMenuTc();
      collapsed = menuContext.collapsed;
    } catch (error) {
      // Si no hay contexto disponible, usar false por defecto
      collapsed = false;
    }
  }

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [stats]);

  const handleProfileClick = () => {
    if (profilePath) {
      navigate(profilePath);
    } else {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const role = decoded.rol || decoded.role || decoded.tipo;
          
          if (role === 'administrador') {
            navigate('/admin/perfil');
          } else if (role === 'tecnico') {
            navigate('/tecnico/perfil');
          } else if (role === 'Contador') {
            navigate('/contador/perfil');
          } else if (role === 'cliente') {
            navigate('/cliente/perfil');
          }
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  };

  return (
    <Container $collapsed={collapsed}>
      <Header gradient={headerGradient}>
        <HeaderLeft>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </HeaderLeft>
        <HeaderRight>
          <NotificationBell />
          <IconButton onClick={handleProfileClick} title="Mi Perfil">
            <FontAwesomeIcon icon={faUserCircle} />
          </IconButton>
        </HeaderRight>
      </Header>

      <StatsGrid>
        {isLoading ? (
          // Mostrar skeleton loader para las estadísticas
          [...Array(stats.length || 5)].map((_, index) => (
            <SkeletonStatCard key={index}>
              <SkeletonIcon />
              <SkeletonText>
                <SkeletonLine height="16px" width="70%" />
                <SkeletonLine height="28px" width="40%" />
              </SkeletonText>
            </SkeletonStatCard>
          ))
        ) : (
          stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon bgColor={stat.bgColor} color={stat.color}>
                <FontAwesomeIcon icon={stat.icon} />
              </StatIcon>
              <StatInfo>
                <h3>{stat.label}</h3>
                <p>{stat.value}</p>
              </StatInfo>
            </StatCard>
          ))
        )}
      </StatsGrid>

      <Card>
        <SectionTitle gradient={sectionGradient}>{sectionTitle}</SectionTitle>
        <ScrollableContent>
          {isLoading ? (
            // Mostrar skeleton loader para el contenido
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...Array(3)].map((_, index) => (
                <div key={index} style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
                  <SkeletonLine height="20px" width="60%" />
                  <div style={{ marginTop: '0.5rem' }}>
                    <SkeletonLine height="16px" width="80%" />
                  </div>
                </div>
              ))}
            </div>
          ) : ActivityComponent ? (
            ActivityComponent
          ) : (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem 0" }}>
              {emptyMessage}
            </p>
          )}
        </ScrollableContent>
      </Card>
    </Container>
  );
};

export default BaseHome;
