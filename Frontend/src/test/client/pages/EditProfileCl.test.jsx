import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import EditProfileCl from '../../../pages/client/EditProfileCl';
import { handleGetClient } from '../../../controllers/administrator/getClientAd.controller';
import { handleUpdateClient } from '../../../controllers/administrator/updateClient.controller';

jest.mock('../../../components/client/MenuSideCl', () => () => <div>Mock MenuSideCl</div>);
jest.mock('../../../components/client/MenuContext', () => ({
  useMenu: () => ({ collapsed: false })
}));
jest.mock('../../../controllers/administrator/getClientAd.controller');
jest.mock('../../../controllers/administrator/updateClient.controller');
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ id: '1' }))
}));

describe('EditProfileCl Component', () => {
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
        <EditProfileCl />
      </Router>
    );

    expect(screen.getByText('EDITAR PERFIL')).toBeInTheDocument();
  });

  it('should render form fields when data is loaded', async () => {
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
        <EditProfileCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/cédula/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    });
  });

  it('should update form fields when user types', async () => {
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
        <EditProfileCl />
      </Router>
    );

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/nombre/i);
      fireEvent.change(nameInput, { target: { value: 'Pedro' } });
      expect(nameInput.value).toBe('Pedro');
    });
  });
});

