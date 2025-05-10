import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ListSevicesTc from "../../../components/technical/ListSevicesTc";
import { MemoryRouter } from 'react-router-dom'; // Importamos MemoryRouter

jest.mock('../../../assets/technical/serviceTehc.png', () => 'logoA&C.png');

describe("ListSevicesTc", () => {

  test("Verify that the 'View' icon is present", () => {
    render(
      <MemoryRouter>
        <ListSevicesTc />
      </MemoryRouter>
    );

    const icon = document.querySelector("svg.fa-arrow-right");
    expect(icon).toBeInTheDocument(); 
  });

  test("The 'View' link is present in every notification", () => {
    render(
      <MemoryRouter>
        <ListSevicesTc />
      </MemoryRouter>
    );

    const links = screen.getAllByText("Ver");
    expect(links).toHaveLength(3); 
  });

});
