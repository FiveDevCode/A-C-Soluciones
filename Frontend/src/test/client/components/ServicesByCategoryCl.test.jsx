import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesByCategoryCl from '../../../components/client/ServicesByCategoryCl';
import { handleGetServiceList } from '../../../controllers/client/getServiceListCl.controller';

jest.mock('../../../controllers/client/getServiceListCl.controller');
jest.mock('../../../components/client/ServiceOpenCl', () => ({ servicio, onClose }) => 
  servicio ? <div data-testid="service-modal">Service Modal</div> : null
);
jest.mock('react-slick', () => {
  return function Slider({ children }) {
    return <div data-testid="slider">{children}</div>;
  };
});

describe('ServicesByCategoryCl Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title', () => {
    handleGetServiceList.mockResolvedValue({ data: { data: [] } });

    render(<ServicesByCategoryCl />);

    expect(screen.getByText(/servicios por categoría/i)).toBeInTheDocument();
  });

  it('should render services grouped by category', async () => {
    const mockServices = [
      { id: 1, nombre: 'Bomba Centrifuga', descripcion: 'Test bomba' },
      { id: 2, nombre: 'Motor Eléctrico', descripcion: 'Test motor' }
    ];

    handleGetServiceList.mockResolvedValue({ data: { data: mockServices } });

    render(<ServicesByCategoryCl />);

    await waitFor(() => {
      expect(screen.getByText('Bomba Centrifuga')).toBeInTheDocument();
    });
  });

  it('should handle empty services list', async () => {
    handleGetServiceList.mockResolvedValue({ data: { data: [] } });

    render(<ServicesByCategoryCl />);

    await waitFor(() => {
      expect(screen.getByText(/servicios por categoría/i)).toBeInTheDocument();
    });
  });
});

