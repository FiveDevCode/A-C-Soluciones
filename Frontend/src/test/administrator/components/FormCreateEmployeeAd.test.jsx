import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormCreateEmployeeAd from '../../../components/administrator/FormCreateEmployeeAd';

describe('FormCreateEmployeeAd Component', () => {
  beforeEach(() => {
    render(<FormCreateEmployeeAd />);
  });

  it('should render all input fields', () => {
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cedula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('should clear inputs when "Limpiar campos" is clicked', () => {
    const nameInput = screen.getByLabelText(/Nombre/i);
    const lastNameInput = screen.getByLabelText(/Apellido/i);

    fireEvent.change(nameInput, { target: { value: 'Juan' } });
    fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });

    fireEvent.click(screen.getByText(/Limpiar campos/i));

    expect(nameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
  });

  it('should submit the form with correct input values', () => {
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Lopez' } });
    fireEvent.change(screen.getByLabelText(/Cedula/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'ana@test.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '555-1234' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'securePass123' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: 'Técnico' } });

    fireEvent.click(screen.getByText(/Registrar/i));

    expect(screen.getByLabelText(/Nombre/i).value).toBe('Ana');
    expect(screen.getByLabelText(/Apellido/i).value).toBe('Lopez');
    expect(screen.getByLabelText(/Cedula/i).value).toBe('12345678');
    expect(screen.getByLabelText(/Correo electrónico/i).value).toBe('ana@test.com');
    expect(screen.getByLabelText(/Teléfono/i).value).toBe('555-1234');
    expect(screen.getByLabelText(/Contraseña/i).value).toBe('securePass123');
    expect(screen.getByLabelText(/Cargo/i).value).toBe('Técnico');
  });
});
