import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomeSessionPageCl from '../../../pages/client/HomeSessionPageCl';
import { handleGetHistoryServiceByCliente } from '../../../controllers/client/getHistoryServiceByCliente.controller';

jest.mock('../../../components/client/MenuSideCl', () => () => <div>Mock MenuSideCl</div>);
jest.mock('../../../components/client/MenuContext', () => ({
  useMenu: () => ({ collapsed: false })
}));
jest.mock('../../../controllers/client/getHistoryServiceByCliente.controller');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ id: '1' }))
}));

describe('HomeSessionPageCl Component', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render welcome section', () => {
    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: [] } });

    render(
      <Router>
        <HomeSessionPageCl />
      </Router>
    );

    expect(screen.getByText('BIENVENIDO A TU DASHBOARD')).toBeInTheDocument();
  });

  it('should render statistics cards', async () => {
    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: [] } });

    render(
      <Router>
        <HomeSessionPageCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Total de Servicios')).toBeInTheDocument();
      expect(screen.getByText('Servicios Programados')).toBeInTheDocument();
      expect(screen.getByText('Servicios Completados')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });
  });

  it('should render quick access section', async () => {
    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: [] } });

    render(
      <Router>
        <HomeSessionPageCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Acceso Rápido')).toBeInTheDocument();
      expect(screen.getByText('Servicios')).toBeInTheDocument();
      expect(screen.getByText('Historial')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });
  });
});
