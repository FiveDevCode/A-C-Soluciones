import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProfileClientPageCl from '../../../pages/client/ProfileClientPageCl';
import { handleGetClient } from '../../../controllers/administrator/getClientAd.controller';

jest.mock('../../../components/client/MenuSideCl', () => () => <div>Mock MenuSideCl</div>);
jest.mock('../../../components/client/MenuContext', () => ({
  useMenu: () => ({ collapsed: false })
}));
jest.mock('../../../controllers/administrator/getClientAd.controller');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ id: '1' }))
}));

describe('ProfileClientPageCl Component', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    handleGetClient.mockImplementation(() => new Promise(() => {}));
    
    render(
      <Router>
        <ProfileClientPageCl />
      </Router>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render profile information when data is loaded', async () => {
    const mockClient = {
      nombre: 'Juan',
      apellido: 'Pérez',
      numero_de_cedula: '1234567890',
      correo_electronico: 'juan@example.com',
      telefono: '1234567890',
      direccion: 'Calle 123'
    };

    handleGetClient.mockResolvedValue({ data: mockClient });

    render(
      <Router>
        <ProfileClientPageCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('PERFIL')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('should render welcome section', async () => {
    handleGetClient.mockResolvedValue({ data: { nombre: 'Test', apellido: 'User' } });

    render(
      <Router>
        <ProfileClientPageCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('PERFIL')).toBeInTheDocument();
    });
  });
});

