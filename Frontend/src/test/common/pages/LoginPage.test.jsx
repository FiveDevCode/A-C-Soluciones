import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../../pages/common/LoginPage";

jest.mock('../../../assets/common/logoA&C.png', () => 'logoA&C.png');

describe("LoginPage", () => {
  test("renderiza el logo correctamente", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const logo = screen.getByRole("img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "logoA&C.png");
  });

  test("renderiza el subtítulo 'Inicia sesión con tu cuenta'", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Inicia sesión con tu cuenta/i)).toBeInTheDocument();
  });

});
