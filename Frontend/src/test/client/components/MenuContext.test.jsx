import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MenuProvider, useMenu } from '../../../components/client/MenuContext';

const TestComponent = () => {
  const { collapsed, setCollapsed } = useMenu();
  return (
    <div>
      <div data-testid="collapsed">{collapsed ? 'true' : 'false'}</div>
      <button onClick={() => setCollapsed(!collapsed)}>Toggle</button>
    </div>
  );
};

describe('MenuContext', () => {
  it('should provide menu context', () => {
    render(
      <MenuProvider>
        <TestComponent />
      </MenuProvider>
    );

    expect(screen.getByTestId('collapsed')).toHaveTextContent('false');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useMenu debe usarse dentro de MenuProvider');
    
    consoleError.mockRestore();
  });
});

