import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HeaderBarCl from '../../../components/client/HeaderBarCl';

jest.mock('../../../assets/common/logoA&C.png', () => 'mockedLogo.png');

describe('HeaderBarCl Component', () => {
  
  test('renders the search input correctly', () => {
    render(
      <BrowserRouter>
        <HeaderBarCl />
      </BrowserRouter>
    );
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders the profile button', () => {
    render(
      <BrowserRouter>
        <HeaderBarCl />
      </BrowserRouter>
    );
    const profileButton = screen.getByRole('button');
    expect(profileButton).toBeInTheDocument();
  });

  test('opens FloatingMenuHomeCl when profile button is clicked', () => {
    render(
      <BrowserRouter>
        <HeaderBarCl />
      </BrowserRouter>
    );
    const profileButton = screen.getByRole('button');
    fireEvent.click(profileButton);
    const floatingMenu = screen.getByTestId('floating-menu');
    expect(floatingMenu).toBeInTheDocument();
  });

  test('navigates to correct page on link click', () => {
    render(
      <BrowserRouter>
        <HeaderBarCl />
      </BrowserRouter>
    );
    const aboutUsLink = screen.getByText(/acerca de nosotros/i);
    fireEvent.click(aboutUsLink);
    expect(window.location.pathname).toBe('/');
  });

  test('triggers search and navigates when "Enter" is pressed', () => {
    render(
      <BrowserRouter>
        <HeaderBarCl />
      </BrowserRouter>
    );
    const searchInput = screen.getByPlaceholderText(/buscar/i);
  
    fireEvent.change(searchInput, { target: { value: 'Test' } });
  
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
  
    expect(window.location.pathname).toBe('/resultado');
    expect(window.location.search).toBe('?data=Test');
  });
});
