import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceOpenCl from '../../../components/client/ServiceOpenCl';

jest.mock('../../../components/client/ScreenRequestCl', () => ({ requestId, onClose }) => 
  requestId ? <div data-testid="screen-request">Screen Request</div> : null
);
jest.mock('../../../components/client/GetIconServiceCl', () => () => <div data-testid="service-icon">Icon</div>);

describe('ServiceOpenCl Component', () => {
  const mockService = {
    id: 1,
    nombre: 'Test Service',
    descripcion: 'Test Description'
  };

  it('should render service modal', () => {
    render(<ServiceOpenCl servicio={mockService} onClose={jest.fn()} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should render service description', () => {
    render(<ServiceOpenCl servicio={mockService} onClose={jest.fn()} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ServiceOpenCl servicio={mockService} onClose={onClose} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should open request screen when button is clicked', () => {
    render(<ServiceOpenCl servicio={mockService} onClose={jest.fn()} />);
    const requestButton = screen.getByText(/solicitar revisión/i);
    fireEvent.click(requestButton);
    expect(screen.getByTestId('screen-request')).toBeInTheDocument();
  });
});

