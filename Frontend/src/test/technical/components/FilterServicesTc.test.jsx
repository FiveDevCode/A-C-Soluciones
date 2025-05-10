import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import FilterServicesTc from "../../../components/technical/FilterServicesTc";

describe("FilterServicesTc", () => {
  test("correctly renders the title and icon", () => {
    render(<FilterServicesTc />);

    expect(screen.getByText(/Se encontraron 56 resultados/)).toBeInTheDocument();

    const filterIcon = screen.getByTestId("filter-icon");
    expect(filterIcon).toBeInTheDocument();
  });
  test("the icon is the correct size", () => {
    render(<FilterServicesTc />);

    const filterIcon = screen.getByTestId("filter-icon");
    expect(filterIcon).toHaveStyle("font-size: 20px");
  });

});
