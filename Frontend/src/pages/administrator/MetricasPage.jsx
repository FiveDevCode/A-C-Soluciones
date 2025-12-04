import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { metricasService } from '../../services/metricas-service';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Wrench, ClipboardList, 
  Calendar, Package 
} from 'lucide-react';

const PageContainer = styled.div`
  background-color: #f5f7fa;
  min-height: 100vh;
  width: 100%;
`;

const PageHeader = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1350px) {
    padding: 1.2rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0;
  margin-bottom: 0.5rem;

  @media (max-width: 1350px) {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  color: #e3f2fd;
  margin: 0;

  @media (max-width: 1350px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ContentContainer = styled.div`
  padding: 0 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.color || '#1976d2'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e1f23;
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e1f23;
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  color: #495057;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.25rem;
  color: #6c757d;
`;

const ErrorContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const MetricasPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await metricasService.getDashboardCompleto();
      setDashboard(response.data.data);
    } catch (err) {
      console.error('Error al cargar métricas:', err);
      setError('Error al cargar las métricas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Cargando métricas...</LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>{error}</ErrorContainer>
      </PageContainer>
    );
  }

  if (!dashboard) {
    return (
      <PageContainer>
        <ErrorContainer>No se pudieron cargar las métricas</ErrorContainer>
      </PageContainer>
    );
  }

  const { 
    estadisticas_generales, 
    servicios_mas_solicitados, 
    solicitudes_por_estado,
    clientes_mas_activos,
    tecnicos_mas_activos,
    visitas_por_estado
  } = dashboard;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>MÉTRICAS Y ESTADÍSTICAS</PageTitle>
        <PageSubtitle>Panel de análisis de datos del sistema</PageSubtitle>
      </PageHeader>

      <ContentContainer>
        {/* Estadísticas Generales */}
        <StatsGrid>
        <StatCard>
          <StatIcon bgColor="#e3f2fd" color="#1976d2">
            <ClipboardList size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>Total Solicitudes</StatLabel>
            <StatValue>{estadisticas_generales?.total_solicitudes || 0}</StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#e8f5e9" color="#388e3c">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>Total Clientes</StatLabel>
            <StatValue>{estadisticas_generales?.total_clientes || 0}</StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fff3e0" color="#f57c00">
            <Wrench size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>Total Técnicos</StatLabel>
            <StatValue>{estadisticas_generales?.total_tecnicos || 0}</StatValue>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#fce4ec" color="#c2185b">
            <Package size={24} />
          </StatIcon>
          <StatContent>
            <StatLabel>Total Servicios</StatLabel>
            <StatValue>{estadisticas_generales?.total_servicios || 0}</StatValue>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Gráficas */}
      <ChartsGrid>
        {/* Servicios Más Solicitados */}
        <ChartCard>
          <ChartTitle>Servicios Más Solicitados</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servicios_mas_solicitados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_solicitudes" fill="#8884d8" name="Solicitudes" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Solicitudes por Estado */}
        <ChartCard>
          <ChartTitle>Solicitudes por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={solicitudes_por_estado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, percent }) => `${estado}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {solicitudes_por_estado?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visitas por Estado */}
        <ChartCard>
          <ChartTitle>Visitas por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitas_por_estado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" name="Visitas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      {/* Tablas de Top Clientes y Técnicos */}
      <ChartsGrid>
        {/* Clientes Más Activos */}
        <TableContainer>
          <ChartTitle style={{ padding: '1.5rem 1.5rem 0' }}>
            Top 5 Clientes Más Activos
          </ChartTitle>
          <Table>
            <Thead>
              <tr>
                <Th>#</Th>
                <Th>Cliente</Th>
                <Th>Solicitudes</Th>
              </tr>
            </Thead>
            <tbody>
              {clientes_mas_activos?.map((cliente, index) => (
                <tr key={cliente.cliente_id}>
                  <Td>{index + 1}</Td>
                  <Td>{cliente.nombre}</Td>
                  <Td>{cliente.total_solicitudes}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Técnicos Más Activos */}
        <TableContainer>
          <ChartTitle style={{ padding: '1.5rem 1.5rem 0' }}>
            Top 5 Técnicos Más Activos
          </ChartTitle>
          <Table>
            <Thead>
              <tr>
                <Th>#</Th>
                <Th>Técnico</Th>
                <Th>Visitas</Th>
              </tr>
            </Thead>
            <tbody>
              {tecnicos_mas_activos?.map((tecnico, index) => (
                <tr key={tecnico.tecnico_id}>
                  <Td>{index + 1}</Td>
                  <Td>{tecnico.nombre}</Td>
                  <Td>{tecnico.total_visitas}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </ChartsGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default MetricasPage;
