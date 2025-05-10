import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackgroundHomeCl from '../../../components/client/BackgroundHomeCl';

jest.mock('../../../assets/client/backgroundHome.png', () => 'logoHome.png');

describe('BackgroundHomeCl Component', () => {
  test('renders company name', () => {
    render(<BackgroundHomeCl />);
    const companyName = screen.getByText(/A & C Soluciones/i);
    expect(companyName).toBeInTheDocument();
  });

  test('renders company phrase', () => {
    render(<BackgroundHomeCl />);
    const companyPhrase = screen.getByText(/Expertos en reparaciones hidroeléctricas/i);
    expect(companyPhrase).toBeInTheDocument();
  });

  test('renders the service button with correct text', () => {
    render(<BackgroundHomeCl />);
    const button = screen.getByRole('button', { name: /ver nuestro servicios/i });
    expect(button).toBeInTheDocument();
  });

  test('has correct button style classes', () => {
    render(<BackgroundHomeCl />);
    const button = screen.getByRole('button', { name: /ver nuestro servicios/i });
    expect(button).toHaveClass('MuiButton-root');
  });
});
