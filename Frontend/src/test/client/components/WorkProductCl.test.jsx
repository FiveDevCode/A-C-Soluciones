import { render, screen } from '@testing-library/react';
import WorkProductCl from '../../../components/client/WorkProductCl';

jest.mock('../../../assets/client/logoAltamira.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoBft.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoJohn.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoPanda.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoPentair.png', () => 'test-file-stub');
jest.mock('../../../assets/client/logoWeg.png', () => 'test-file-stub');

describe('WorkProductCl Component', () => {
  it('should render all logos correctly', () => {
    render(<WorkProductCl />);

    const logos = screen.getAllByRole('img');
    expect(logos).toHaveLength(6);
  });
});
