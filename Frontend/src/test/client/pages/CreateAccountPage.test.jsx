import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateAccountPageCl from '../../../pages/client/CreateAccountPageCl';
import '@testing-library/jest-dom';


jest.mock('../../../assets/common/logoA&C.png', () => 'test-file-stub');

describe('CreateAccountPageCl Component', () => {
  it('should render the page with all the elements correctly', () => {
    const { container } = render(
      <Router>
        <CreateAccountPageCl />
      </Router>
    );


    const logoImage = screen.getByRole('img');
    expect(logoImage).toBeInTheDocument();

    const title = screen.getByText(/Crear una cuenta/i);
    const subtitle = screen.getByText(/Por favor completa todos lo campos para crear tu cuenta/i);
    
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
