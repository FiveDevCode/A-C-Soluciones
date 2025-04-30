// WorkProductCl.test.jsx
import { render, screen } from '@testing-library/react';
import WorkProductCl from '../../../components/client/WorkProductCl';

// Mock de imágenes para evitar el error de "Unexpected token"
jest.mock('../../../assets/client/logoAltamira.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoBft.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoJohn.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoPanda.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoPentair.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoWeg.png', () => 'test-file-stub');

describe('WorkProductCl Component', () => {
  it('should render all logos correctly', () => {
    render(<WorkProductCl />);

    // Verifica si los logos están siendo renderizados
    const logos = screen.getAllByRole('img');
    expect(logos).toHaveLength(6); // Asegúrate de que haya 6 imágenes
  });
});
