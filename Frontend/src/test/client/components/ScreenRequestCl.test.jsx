import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScreenRequestCl from '../../../components/client/ScreenRequestCl';
import { handleCreateRequest } from '../../../controllers/client/createRequestCl.controller';

jest.mock('../../../controllers/client/createRequestCl.controller');
jest.mock('../../../components/common/ScreenSuccess', () => ({ children, onClose }) => 
  children ? <div data-testid="success-screen">{children}</div> : null
);
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ id: '1' }))
}));

describe('ScreenRequestCl Component', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<ScreenRequestCl requestId={1} onClose={jest.fn()} />);
    expect(screen.getByLabelText(/dirección de servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción del problema/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comentarios/i)).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    render(<ScreenRequestCl requestId={1} onClose={jest.fn()} />);
    const addressInput = screen.getByLabelText(/dirección de servicio/i);
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });
    expect(addressInput.value).toBe('Test Address');
  });

  it('should submit form successfully', async () => {
    handleCreateRequest.mockResolvedValue({});
    const onClose = jest.fn();
    
    render(<ScreenRequestCl requestId={1} onClose={onClose} />);
    
    const addressInput = screen.getByLabelText(/dirección de servicio/i);
    const descriptionInput = screen.getByLabelText(/descripción del problema/i);
    
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    const submitButton = screen.getByText(/confirmar/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleCreateRequest).toHaveBeenCalled();
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<ScreenRequestCl requestId={1} onClose={onClose} />);
    const cancelButton = screen.getByText(/cancelar/i);
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});

