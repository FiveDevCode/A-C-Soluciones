import { render, screen } from "@testing-library/react";
import MenuSide from "../../../components/common/MenuSide";
import { BrowserRouter } from "react-router-dom"; 
import '@testing-library/jest-dom';

jest.mock('../../../assets/common/logoA&C.png', () => 'logoA&C.png');

describe("MenuSide", () => {
  test("correctly renders the logo and menu title", () => {
    render(
      <BrowserRouter>
        <MenuSide />
      </BrowserRouter>
    );

    const logoElement = screen.getByRole("img");
    expect(logoElement).toHaveAttribute("src", "logoA&C.png");

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  test("renders the menu options", () => {
    render(
      <BrowserRouter>
        <MenuSide />
      </BrowserRouter>
    );

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Mis solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Enviar solicitud")).toBeInTheDocument();
    expect(screen.getByText("Mis reportes")).toBeInTheDocument();
    expect(screen.getByText("Ver historial")).toBeInTheDocument();
    expect(screen.getByText("Configuracion")).toBeInTheDocument();
    expect(screen.getByText("Salir")).toBeInTheDocument();
  });

  test("las opciones de menú son enlaces correctos", () => {
    render(
      <BrowserRouter>
        <MenuSide />
      </BrowserRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(8);
  });
});
