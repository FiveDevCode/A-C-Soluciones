import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock de las imágenes para evitar errores de importación
jest.mock('../../../assets/client/whoHome.png', () => 'whoHome.png');
jest.mock('../../../assets/client/serviceHome.png', () => 'serviceHome.png');

import ContentHomeCl from '../../../components/client/ContentHomeCl';

describe('ContentHomeCl Component', () => {
  test('renders "QUIENES SOMOS?" title', () => {
    render(<ContentHomeCl />);
    const title = screen.getByText(/QUIENES SOMOS\?/i);
    expect(title).toBeInTheDocument();
  });

  test('renders "NUESTROS SERVICIOS" title', () => {
    render(<ContentHomeCl />);
    const title = screen.getByText(/NUESTROS SERVICIOS/i);
    expect(title).toBeInTheDocument();
  });

  test('renders the "Seguir leyendo" buttons', () => {
    render(<ContentHomeCl />);
    const buttons = screen.getAllByRole('button', { name: /Seguir leyendo/i });
    expect(buttons).toHaveLength(2); // Hay dos botones en total
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  test('renders the Who image', () => {
    render(<ContentHomeCl />);
    const img = screen.getByAltText('whoHome.png');
    expect(img).toBeInTheDocument();
  });

  test('renders the Service image', () => {
    render(<ContentHomeCl />);
    const img = screen.getByAltText('serviceHome.png');
    expect(img).toBeInTheDocument();
  });
});