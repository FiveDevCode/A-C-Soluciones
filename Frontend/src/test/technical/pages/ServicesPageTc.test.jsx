import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ServicesPageTc from "../../../pages/technical/ServicesPageTc";
import '@testing-library/jest-dom';


jest.mock("../../../components/technical/FilterServicesTc", () => () => (
  <div>Filtro</div>
));
jest.mock("../../../components/technical/ListVisitTc", () => () => (
  <div>Lista de servicios</div>
));

describe("ServicesPageTc", () => {
  test("renderiza los componentes FilterServicesTc y ListVisitTc", () => {
    render(
      <MemoryRouter>
        <ServicesPageTc />
      </MemoryRouter>
    );

    expect(screen.getByText("Filtro")).toBeInTheDocument();
    expect(screen.getByText("Lista de servicios")).toBeInTheDocument();
  });
});