import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecommendedServiceFullWidth from '../../../components/client/RecomendCategoryHomeCl';
import { handleGetService } from '../../../controllers/administrator/getServiceAd.controller';

jest.mock('../../../controllers/administrator/getServiceAd.controller');
jest.mock('../../../components/client/ServiceOpenCl', () => ({ servicio, onClose }) => 
  servicio ? <div data-testid="service-modal">Service Modal</div> : null
);

describe('RecomendCategoryHomeCl Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    handleGetService.mockImplementation(() => new Promise(() => {}));
    render(<RecommendedServiceFullWidth id={1} />);
    expect(screen.queryByText(/recomendado/i)).not.toBeInTheDocument();
  });

  it('should render service when data is loaded', async () => {
    const mockService = {
      nombre: 'Test Service',
      descripcion: 'Test Description'
    };

    handleGetService.mockResolvedValue({ data: { data: mockService } });

    render(<RecommendedServiceFullWidth id={1} />);

    await waitFor(() => {
      expect(screen.getByText('Test Service')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  it('should render recommended tag', async () => {
    const mockService = {
      nombre: 'Test Service',
      descripcion: 'Test Description'
    };

    handleGetService.mockResolvedValue({ data: { data: mockService } });

    render(<RecommendedServiceFullWidth id={1} tag="Recomendado" />);

    await waitFor(() => {
      expect(screen.getByText('Recomendado')).toBeInTheDocument();
    });
  });
});

