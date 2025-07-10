import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import CreateEmployeeAd from "../../../pages/administrator/CreateEmployeeAd";

// Mock de la imagen
jest.mock('../../../assets/administrator/registerEmployeeAd.png', () => 'registerEmployeeAd.png');

describe("CreateEmployeeAd", () => {
  
  test("renders the description of the employee record", () => {
    render(<CreateEmployeeAd />);

    expect(screen.getByText(/Registra aquí a los nuevos empleados/)).toBeInTheDocument();
  });

  test("renders the employee registration helper", () => {
    render(<CreateEmployeeAd />);

    expect(screen.getByText(/Por favor, completa todos los campos requeridos/)).toBeInTheDocument();
  });

  test("render the logo correctly", () => {
    render(<CreateEmployeeAd />);

    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", "registerEmployeeAd.png");
  });

  test("renders interface elements with the appropriate layout", () => {
    render(<CreateEmployeeAd />);

    const container = screen.getByText(/Registra aquí a los nuevos empleados/).parentElement;
    expect(container).toHaveStyle("flex-direction: column");
  });

  test("Check that the description text is correct", () => {
    render(<CreateEmployeeAd />);

    const descriptionText = screen.getByText(/Registra aquí a los nuevos empleados/);
    expect(descriptionText).toBeInTheDocument();
    expect(descriptionText).toHaveTextContent("Registra aquí a los nuevos empleados ingresando sus datos y rol.");
  });

});
