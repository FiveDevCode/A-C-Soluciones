import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

import HeaderBar from "../../../components/common/HeaderBar";

describe("HeaderBar", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("muestra el título correcto según la ruta", () => {
    render(
      <MemoryRouter initialEntries={["/services"]}>
        <Routes>
          <Route path="/services" element={<HeaderBar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Servicios")).toBeInTheDocument();
  });

  test("muestra 'Home' cuando la ruta no está en el diccionario", () => {
    render(
      <MemoryRouter initialEntries={["/ruta-desconocida"]}>
        <Routes>
          <Route path="/ruta-desconocida" element={<HeaderBar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("actualiza el campo de búsqueda al escribir", () => {
    render(
      <MemoryRouter initialEntries={["/services"]}>
        <Routes>
          <Route path="/services" element={<HeaderBar />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Buscar");
    fireEvent.change(input, { target: { value: "pizza" } });

    expect(input.value).toBe("pizza");
  });

  test("navega al hacer Enter en la búsqueda", () => {
    render(
      <MemoryRouter initialEntries={["/services"]}>
        <Routes>
          <Route path="/services" element={<HeaderBar />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Buscar");
    fireEvent.change(input, { target: { value: "pollo" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockedNavigate).toHaveBeenCalledWith("/resultado?data=pollo");
  });

  test("muestra los íconos de campana y usuario", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<HeaderBar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
