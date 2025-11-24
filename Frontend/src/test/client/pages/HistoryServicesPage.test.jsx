import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import HistoryServicesPage from '../../../pages/client/HistoryServicesPage';
import { handleGetHistoryServiceByCliente } from '../../../controllers/client/getHistoryServiceByCliente.controller';
import { handleGetPDFIdVisit } from '../../../controllers/common/getPDFIdVisit.controller';

jest.mock('../../../components/client/MenuSideCl', () => () => <div>Mock MenuSideCl</div>);
jest.mock('../../../components/client/MenuContext', () => ({
  useMenu: () => ({ collapsed: false })
}));
jest.mock('../../../components/common/Toast', () => ({ message, type, onClose }) => 
  message ? <div data-testid="toast">{message}</div> : null
);
jest.mock('../../../controllers/client/getHistoryServiceByCliente.controller');
jest.mock('../../../controllers/common/getPDFIdVisit.controller');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ id: '1' }))
}));

global.fetch = jest.fn();

describe('HistoryServicesPage Component', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'mock-token');
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render welcome section', () => {
    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: [] } });

    render(
      <Router>
        <HistoryServicesPage />
      </Router>
    );

    expect(screen.getByText('HISTORIAL DE SERVICIOS')).toBeInTheDocument();
  });

  it('should render loading state initially', () => {
    handleGetHistoryServiceByCliente.mockImplementation(() => new Promise(() => {}));

    render(
      <Router>
        <HistoryServicesPage />
      </Router>
    );

    expect(screen.getByText(/cargando servicios/i)).toBeInTheDocument();
  });

  it('should render history services when data is loaded', async () => {
    const mockHistory = [
      {
        visita_id: 1,
        fecha: '2024-01-01',
        servicio: 'Service 1',
        tecnico: 'John Doe',
        estado: 'completada',
        pdf_path: null
      }
    ];

    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: mockHistory } });

    render(
      <Router>
        <HistoryServicesPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should show "Ficha en Proceso" for non-completed services', async () => {
    const mockHistory = [
      {
        visita_id: 1,
        fecha: '2024-01-01',
        servicio: 'Service 1',
        tecnico: 'John Doe',
        estado: 'programada',
        pdf_path: null
      }
    ];

    handleGetHistoryServiceByCliente.mockResolvedValue({ data: { data: mockHistory } });

    render(
      <Router>
        <HistoryServicesPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Ficha en Proceso')).toBeInTheDocument();
    });
  });
});

