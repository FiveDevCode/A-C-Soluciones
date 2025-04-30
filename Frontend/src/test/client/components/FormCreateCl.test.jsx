import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom'; // Importa el BrowserRouter
import FormCreateCl from '../../../components/client/FormCreateCl';

describe('FormCreateCl Component', () => {
  test('renders form fields correctly', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    
    // Verifica que los campos de entrada estén presentes
    const nameField = screen.getByLabelText(/nombre/i);
    const lastNameField = screen.getByLabelText(/apellidos/i);
    const phoneField = screen.getByLabelText(/celular/i);
    const emailField = screen.getByLabelText(/correo electrónico/i);
    const passwordField = screen.getByLabelText(/contraseña/i);
    
    expect(nameField).toBeInTheDocument();
    expect(lastNameField).toBeInTheDocument();
    expect(phoneField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
  });

  test('renders the "Crear cuenta" button', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /crear cuenta/i });
    expect(button).toBeInTheDocument();
  });

  test('renders the "¿Ya tienes cuenta?" link', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    const link = screen.getByText(/¿ya tienes cuenta\?/i);
    expect(link).toBeInTheDocument();
  });

  test('can type into input fields', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    
    // Simula la escritura en los campos
    const nameField = screen.getByLabelText(/nombre/i);
    fireEvent.change(nameField, { target: { value: 'Juan' } });
    expect(nameField.value).toBe('Juan');
    
    const lastNameField = screen.getByLabelText(/apellidos/i);
    fireEvent.change(lastNameField, { target: { value: 'Pérez' } });
    expect(lastNameField.value).toBe('Pérez');
    
    const phoneField = screen.getByLabelText(/celular/i);
    fireEvent.change(phoneField, { target: { value: '1234567890' } });
    expect(phoneField.value).toBe('1234567890');
    
    const emailField = screen.getByLabelText(/correo electrónico/i);
    fireEvent.change(emailField, { target: { value: 'juan.perez@example.com' } });
    expect(emailField.value).toBe('juan.perez@example.com');
    
    const passwordField = screen.getByLabelText(/contraseña/i);
    fireEvent.change(passwordField, { target: { value: 'password123' } });
    expect(passwordField.value).toBe('password123');
  });

  test('can toggle checkboxes for terms and offers', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    
    const termsCheckbox = screen.getByLabelText(/aceptas los términos y condiciones/i);
    const offersCheckbox = screen.getByLabelText(/quiero recibir ofertas personalizadas/i);
    
    // Simula el cambio de estado de los checkboxes
    fireEvent.click(termsCheckbox);
    expect(termsCheckbox.checked).toBe(true);
    
    fireEvent.click(offersCheckbox);
    expect(offersCheckbox.checked).toBe(true);
    
    fireEvent.click(termsCheckbox);
    expect(termsCheckbox.checked).toBe(false);
    
    fireEvent.click(offersCheckbox);
    expect(offersCheckbox.checked).toBe(false);
  });

  test('navigates to login page when "¿Ya tienes cuenta?" link is clicked', () => {
    render(
      <BrowserRouter>
        <FormCreateCl />
      </BrowserRouter>
    );
    
    const link = screen.getByText(/¿ya tienes cuenta\?/i);
    fireEvent.click(link);
    
    // Asumiendo que el enrutamiento funciona correctamente
    expect(window.location.pathname).toBe('/login');
  });
});
