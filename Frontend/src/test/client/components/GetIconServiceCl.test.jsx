import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import getIconByService from '../../../components/client/GetIconServiceCl';

describe('GetIconServiceCl Function', () => {
  it('should return pump icon for centrifuga', () => {
    const { container } = render(getIconByService('Bomba Centrifuga'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should return water icon for pozos', () => {
    const { container } = render(getIconByService('Pozos Profundos'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should return bolt icon for electric services', () => {
    const { container } = render(getIconByService('Instalaciones Eléctricas'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should return tools icon as default', () => {
    const { container } = render(getIconByService('Unknown Service'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should return pool icon for piscina', () => {
    const { container } = render(getIconByService('Piscina'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should return lightbulb icon for iluminación', () => {
    const { container } = render(getIconByService('Iluminación'));
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

