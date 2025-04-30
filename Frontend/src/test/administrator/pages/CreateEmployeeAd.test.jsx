import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import CreateEmployeeAd from "../../../pages/administrator/CreateEmployeeAd";

// Mock de la imagen
jest.mock('../../../assets/administrator/registerEmployeeAd.png', () => 'registerEmployeeAd.png');

describe("CreateEmployeeAd", () => {
  
  test("renderiza la descripción del registro de empleados", () => {
    render(<CreateEmployeeAd />);

    expect(screen.getByText(/Registra aquí a los nuevos empleados/)).toBeInTheDocument();
  });

  test("renderiza el helper de registro de empleados", () => {
    render(<CreateEmployeeAd />);

    expect(screen.getByText(/Por favor, completa todos los campos requeridos/)).toBeInTheDocument();
  });

  test("renderiza el formulario de creación de empleado", () => {
    render(<CreateEmployeeAd />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  test("renderiza el logo correctamente", () => {
    render(<CreateEmployeeAd />);

    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", "registerEmployeeAd.png");
  });

  test("renderiza los elementos de la interfaz con el layout adecuado", () => {
    render(<CreateEmployeeAd />);

    const container = screen.getByText(/Registra aquí a los nuevos empleados/).parentElement;
    expect(container).toHaveStyle("flex-direction: column");
  });

  test("verifica que el texto de la descripción es el correcto", () => {
    render(<CreateEmployeeAd />);

    const descriptionText = screen.getByText(/Registra aquí a los nuevos empleados/);
    expect(descriptionText).toBeInTheDocument();
    expect(descriptionText).toHaveTextContent("Registra aquí a los nuevos empleados ingresando sus datos y rol.");
  });

});
