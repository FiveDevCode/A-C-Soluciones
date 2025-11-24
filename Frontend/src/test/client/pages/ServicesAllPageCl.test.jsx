import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import ServicesAllPageCl from '../../../pages/client/ServicesAllPageCl';
import { handleGetServiceList } from '../../../controllers/client/getServiceListCl.controller';

jest.mock('../../../components/client/MenuSideCl', () => () => <div>Mock MenuSideCl</div>);
jest.mock('../../../components/client/MenuContext', () => ({
  useMenu: () => ({ collapsed: false })
}));
jest.mock('../../../components/client/ServiceOpenCl', () => ({ servicio, onClose }) => 
  servicio ? <div data-testid="service-modal">Service Modal</div> : null
);
jest.mock('../../../controllers/client/getServiceListCl.controller');

describe('ServicesAllPageCl Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome section', () => {
    handleGetServiceList.mockResolvedValue({ data: { data: [] } });

    render(
      <Router>
        <ServicesAllPageCl />
      </Router>
    );

    expect(screen.getByText('SERVICIOS')).toBeInTheDocument();
  });

  it('should render loading state initially', () => {
    handleGetServiceList.mockImplementation(() => new Promise(() => {}));

    render(
      <Router>
        <ServicesAllPageCl />
      </Router>
    );

    expect(screen.getByText(/cargando servicios/i)).toBeInTheDocument();
  });

  it('should render services when data is loaded', async () => {
    const mockServices = [
      { id: 1, nombre: 'Service 1', descripcion: 'Description 1' },
      { id: 2, nombre: 'Service 2', descripcion: 'Description 2' }
    ];

    handleGetServiceList.mockResolvedValue({ data: { data: mockServices } });

    render(
      <Router>
        <ServicesAllPageCl />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
    });
  });

  it('should filter services when search text is entered', async () => {
    const mockServices = [
      { id: 1, nombre: 'Service 1', descripcion: 'Description 1' },
      { id: 2, nombre: 'Service 2', descripcion: 'Description 2' }
    ];

    handleGetServiceList.mockResolvedValue({ data: { data: mockServices } });

    render(
      <Router>
        <ServicesAllPageCl />
      </Router>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar servicios/i);
      fireEvent.change(searchInput, { target: { value: 'Service 1' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
    });
  });
});

