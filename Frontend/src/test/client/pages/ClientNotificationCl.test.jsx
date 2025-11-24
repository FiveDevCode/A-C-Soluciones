import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientNotificationCl from '../../../pages/client/ClientNotificationCl';

describe('ClientNotificationCl Component', () => {
  it('should render the title', () => {
    render(<ClientNotificationCl />);
    expect(screen.getByText('Tu historial')).toBeInTheDocument();
  });

  it('should render filter sidebar', () => {
    render(<ClientNotificationCl />);
    expect(screen.getByText(/filtros/i)).toBeInTheDocument();
  });

  it('should render filter categories', () => {
    render(<ClientNotificationCl />);
    expect(screen.getByText('Tipo de acción')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Tipo Sistema')).toBeInTheDocument();
  });

  it('should render notification cards', () => {
    render(<ClientNotificationCl />);
    const cards = screen.getAllByText(/solicitud de revisión enviada/i);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render card content correctly', () => {
    render(<ClientNotificationCl />);
    expect(screen.getByText(/planta/i)).toBeInTheDocument();
  });
});

