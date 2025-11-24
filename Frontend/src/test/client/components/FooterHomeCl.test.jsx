import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import FooterHomeCl from '../../../components/client/FooterHomeCl';

jest.mock('../../../assets/common/logoA&C.png', () => 'logoA&C.png');

describe('FooterHomeCl Component', () => {
  test('renders the copyright text', () => {
    render(
      <Router>
        <FooterHomeCl />
      </Router>
    );
    const copyrightText = screen.getByText(/© A & C Soluciones 2025/i);
    expect(copyrightText).toBeInTheDocument();
  });

  test('renders the logo image with correct src', () => {
    render(
      <Router>
        <FooterHomeCl />
      </Router>
    );
    const logoImage = screen.getByRole('img'); 
    expect(logoImage).toHaveAttribute('src', 'logoA&C.png');
  });

  test('renders the correct footer links', () => {
    render(
      <Router>
        <FooterHomeCl />
      </Router>
    );
    const aboutLink = screen.getByRole('link', { name: /acerca de nosotros/i });
    expect(aboutLink).toBeInTheDocument();
    
    const privacyLink = screen.getByRole('link', { name: /politicas de privacidad/i });
    expect(privacyLink).toBeInTheDocument();
    
    const faqLink = screen.getByRole('link', { name: /preguntas frecuentes/i });
    expect(faqLink).toBeInTheDocument();
    
    const termsLink = screen.getByRole('link', { name: /términos y condiciones/i });
    expect(termsLink).toBeInTheDocument();
  });

  test('ensures footer links have correct href attributes', () => {
    render(
      <Router>
        <FooterHomeCl />
      </Router>
    );
    const aboutLink = screen.getByRole('link', { name: /acerca de nosotros/i });
    expect(aboutLink).toHaveAttribute('href', '/about-us');
    
    const privacyLink = screen.getByRole('link', { name: /politicas de privacidad/i });
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
    
    const faqLink = screen.getByRole('link', { name: /preguntas frecuentes/i });
    expect(faqLink).toHaveAttribute('href', '/faq');
    
    const termsLink = screen.getByRole('link', { name: /términos y condiciones/i });
    expect(termsLink).toHaveAttribute('href', '/terms-and-conditions');
  });
});