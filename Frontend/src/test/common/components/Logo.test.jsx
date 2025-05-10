import { render, screen } from "@testing-library/react";
import Logo from "../../../components/common/Logo";
import '@testing-library/jest-dom'; 

describe("Logo", () => {
  test("renders correctly with the given properties", () => {
    const props = {
      size: "100px",
      min: "50px",
      max: "150px",
      src: "https://example.com/logo.png"
    };

    render(<Logo {...props} />);

    const logoElement = screen.getByRole("img");  

    expect(logoElement).toHaveAttribute("src", "https://example.com/logo.png");

    expect(logoElement).toHaveStyle(`width: ${props.size}`);
    expect(logoElement).toHaveStyle(`min-width: ${props.min}`);
    expect(logoElement).toHaveStyle(`max-width: ${props.max}`);
  });

  test("renders without error if some properties are not passed", () => {
    const props = {
      src: "https://example.com/logo.png"
    };

    render(<Logo {...props} />);

    const logoElement = screen.getByRole("img");

    expect(logoElement).toHaveAttribute("src", "https://example.com/logo.png");

    expect(logoElement).not.toHaveStyle("width: ");
    expect(logoElement).not.toHaveStyle("min-width: ");
    expect(logoElement).not.toHaveStyle("max-width: ");
  });
});
