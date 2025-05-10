import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FormLogin from '../../../components/common/FormLogin';
import '@testing-library/jest-dom';


describe('FormLogin Component', () => {
  it('should render email and password fields, forgot password link and buttons', () => {
    render(
      <Router>
        <FormLogin />
      </Router>
    );

    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();

    const forgotLink = screen.getByText(/Has olvidado tu contraseña/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute('href', '/ForgotPasswordPage');

    expect(screen.getByRole('button', { name: /Iniciar sesion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  it('should update email and password state on change', () => {
    render(
      <Router>
        <FormLogin />
      </Router>
    );

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
