import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ServicieCatalogCl from '../../../components/client/ServicieCatalogCl';

describe('ServicieCatalogCl Component', () => {
  it('should render title', () => {
    render(
      <BrowserRouter>
        <ServicieCatalogCl />
      </BrowserRouter>
    );
    expect(screen.getByText('SERVICIOS POR CATEGORÍA')).toBeInTheDocument();
  });

  it('should render service categories', () => {
    render(
      <BrowserRouter>
        <ServicieCatalogCl />
      </BrowserRouter>
    );
    expect(screen.getByText(/montaje y mantenimiento de equipos de presión/i)).toBeInTheDocument();
    expect(screen.getByText(/mantenimiento planta eléctrica de emergencia/i)).toBeInTheDocument();
    expect(screen.getByText(/tableros de control/i)).toBeInTheDocument();
  });

  it('should render service links', () => {
    render(
      <BrowserRouter>
        <ServicieCatalogCl />
      </BrowserRouter>
    );
    expect(screen.getByText('Bombas centrifugas')).toBeInTheDocument();
    expect(screen.getByText('Motor')).toBeInTheDocument();
  });

  it('should have correct links to services page', () => {
    render(
      <BrowserRouter>
        <ServicieCatalogCl />
      </BrowserRouter>
    );
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/cliente/servicios');
    });
  });
});

