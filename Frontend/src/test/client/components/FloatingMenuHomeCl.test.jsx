import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // 👈 Importar router
import '@testing-library/jest-dom';
import FloatingMenuHomeCl from '../../../components/client/FloatingMenuHomeCl';

describe('FloatingMenuHomeCl Component', () => {
  test('renders the menu options', () => {
    render(
      <MemoryRouter>
        <FloatingMenuHomeCl />
      </MemoryRouter>
    );

    const accessibilityOption = screen.getByText(/Accesibilidad/i);
    const profileOption = screen.getByText(/Perfil/i);
    const notificationsOption = screen.getByText(/Notificaciones/i);
    const reportsOption = screen.getByText(/Informes/i);
    const preferencesOption = screen.getByText(/Preferencias/i);
    const darkModeOption = screen.getByText(/Modo Oscuro/i);
    const logoutOption = screen.getByText(/Cerrar sesión/i);

    expect(accessibilityOption).toBeInTheDocument();
    expect(profileOption).toBeInTheDocument();
    expect(notificationsOption).toBeInTheDocument();
    expect(reportsOption).toBeInTheDocument();
    expect(preferencesOption).toBeInTheDocument();
    expect(darkModeOption).toBeInTheDocument();
    expect(logoutOption).toBeInTheDocument();
  });

  test('renders links with correct href attributes', () => {
    render(
      <MemoryRouter>
        <FloatingMenuHomeCl />
      </MemoryRouter>
    );

    const accessibilityLink = screen.getByText(/Accesibilidad/i).closest('a');
    const profileLink = screen.getByText(/Perfil/i).closest('a');
    const notificationsLink = screen.getByText(/Notificaciones/i).closest('a');
    const reportsLink = screen.getByText(/Informes/i).closest('a');
    const preferencesLink = screen.getByText(/Preferencias/i).closest('a');
    const darkModeLink = screen.getByText(/Modo Oscuro/i).closest('a');
    const logoutLink = screen.getByText(/Cerrar sesión/i).closest('a');

    expect(accessibilityLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
    expect(notificationsLink).toBeInTheDocument();
    expect(reportsLink).toBeInTheDocument();
    expect(preferencesLink).toBeInTheDocument();
    expect(darkModeLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();

    expect(accessibilityLink).toHaveAttribute('href', '/accesibility');
    expect(profileLink).toHaveAttribute('href', '/profile');
    expect(notificationsLink).toHaveAttribute('href', '/notifications');
    expect(reportsLink).toHaveAttribute('href', '/reports');
    expect(preferencesLink).toHaveAttribute('href', '/preferences');
    expect(darkModeLink).toHaveAttribute('href', '/dark-mode');
    expect(logoutLink).toHaveAttribute('href', '/logout');
  });
});
