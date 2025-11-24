import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import MenuSideCl from '../../../components/client/MenuSideCl';
import { MenuProvider } from '../../../components/client/MenuContext';

jest.mock('../../../components/common/Logo', () => ({ src, size }) => <div data-testid="logo">Logo</div>);
jest.mock('../../../assets/common/logoA&C.png', () => 'mockedLogo.png');

describe('MenuSideCl Component', () => {
  const renderWithProvider = (initialPath = '/cliente/inicio') => {
    window.history.pushState({}, 'Test page', initialPath);
    return render(
      <BrowserRouter>
        <MenuProvider>
          <MenuSideCl />
        </MenuProvider>
      </BrowserRouter>
    );
  };

  it('should render menu options', () => {
    renderWithProvider();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Historial')).toBeInTheDocument();
  });

  it('should render logout button', () => {
    renderWithProvider();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('should toggle collapse when button is clicked', () => {
    renderWithProvider();
    const collapseButton = screen.getByRole('button');
    fireEvent.click(collapseButton);
    expect(collapseButton).toBeInTheDocument();
  });

  it('should highlight active menu item', () => {
    renderWithProvider('/cliente/perfil');
    const profileLink = screen.getByText('Perfil').closest('a');
    expect(profileLink).toHaveAttribute('href', '/cliente/perfil');
  });
});

