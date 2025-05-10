import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import ServicieCatalogCl from '../../../components/client/ServicieCatalogCl';

describe('ServicieCatalogCl Component', () => {

  const renderWithRouter = (ui) => render(<Router>{ui}</Router>);

  it('should render the main title correctly', () => {
    renderWithRouter(<ServicieCatalogCl />);
    const title = screen.getByText(/SERVICIOS/i);
    expect(title).toBeInTheDocument(); // Check if "SERVICIOS" is in the document
  });

  it('should render the catalog services and their items', () => {
    renderWithRouter(<ServicieCatalogCl />);
    
    const mountTitle = screen.getByText(/MONTAJE Y MANTENIMIENTO DE EQUIPOS DE PRESION/i);
    const plantTitle = screen.getByText(/MANTENIMIENTO PLANTA ELECTRICA DE EMERGENCIA/i);
    const otherTitle = screen.getByText(/OTROS/i);
    const controlPanelTitle = screen.getByText(/TABLEROS DE CONTROL:/i);
    const wellDrillingTitle = screen.getByText(/EXCAVACION DE POZOS PROFUNDOS/i);
    const tankCleaningTitle = screen.getByText(/LAVADO Y DESINFECCION DE TANQUES DE ALMACENAMIENTO DE AGUA POTABLE/i);

    expect(mountTitle).toBeInTheDocument();
    expect(plantTitle).toBeInTheDocument();
    expect(otherTitle).toBeInTheDocument();
    expect(controlPanelTitle).toBeInTheDocument();
    expect(wellDrillingTitle).toBeInTheDocument();
    expect(tankCleaningTitle).toBeInTheDocument();
  });

  it('should render all service links correctly', () => {
    renderWithRouter(<ServicieCatalogCl />);

    // Check if the service links are rendered
    const services = [
      'Bombas centrifugas',
      'Bombas sumergibles tipo lapicero',
      'Bombas nivel freático',
      'Bombas para piscina',
      'Bombas de red contra incendios',
      'Controladores de velocidad variable',
      'Aguas residuales (ptar)',
      'Motor',
      'Sistema eléctrico',
      'Prueba de motor',
      'Instalación y Mantenimiento red contra incendios',
      'Suministro, instalación y mantenimiento a brazos hidráulicos',
      'Diseño y montaje de instalaciones eléctricas',
      'Diseño y montaje de sistemas de iluminación comercial',
      'Instalación de transferencias manuales y automáticas',
      'Diseño y montaje de tableros de control con arrancadores directos, indirectos y variadores de velocidad',
      'Automatizaciones y programación de PLC',
      'Fragua de piscinas',
      'Impermeabilización de tanques de almacenamiento',
      'Impermeabilización de terrazas',
      'Ensamble y mantenimiento preventivo a tableros de control',
      'Pozos de agua nivel fréatico',
      'Realizamos chequeo general de las condiciones físicas del tanque, empaques, válvulas y tuberías'
    ];

    services.forEach(service => {
      const serviceLink = screen.getByText(service);
      expect(serviceLink).toBeInTheDocument();
    });
  });

});
