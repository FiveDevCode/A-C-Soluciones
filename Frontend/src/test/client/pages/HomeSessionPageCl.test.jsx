import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomeSessionPageCl from '../../../pages/client/HomeSessionPageCl';

jest.mock('../../../components/client/BackgroundHomeCl', () => () => <div>Mock BackgroundHomeCl</div>);
jest.mock('../../../components/client/ContentHomeCl', () => () => <div>Mock ContentHomeCl</div>);
jest.mock('../../../components/client/HeaderBarCl', () => () => <div>Mock HeaderBarCl</div>);
jest.mock('../../../components/client/WorkProductCl', () => () => <div>Mock WorkProductCl</div>);
jest.mock('../../../components/client/ServicieCatalogCl', () => () => <div>Mock ServicieCatalogCl</div>);
jest.mock('../../../components/client/FooterHomeCl', () => () => <div>Mock FooterHomeCl</div>);

describe('HomeSessionPageCl Component', () => {
  it('should render all the sections correctly', () => {
    render(
      <Router>
        <HomeSessionPageCl />
      </Router>
    );

    expect(screen.getByText('Mock HeaderBarCl')).toBeInTheDocument();
    expect(screen.getByText('Mock BackgroundHomeCl')).toBeInTheDocument();
    expect(screen.getByText('Mock ContentHomeCl')).toBeInTheDocument();
    expect(screen.getByText('Mock WorkProductCl')).toBeInTheDocument();
    expect(screen.getByText('Mock ServicieCatalogCl')).toBeInTheDocument();
    expect(screen.getByText('Mock FooterHomeCl')).toBeInTheDocument();
  });
});
