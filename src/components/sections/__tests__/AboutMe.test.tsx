import React from "react";
import { render, screen } from "@testing-library/react";
import AboutMe from "../AboutMe";

// Mock framer-motion to avoid animation-related issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("AboutMe", () => {
  beforeEach(() => {
    render(<AboutMe />);
  });

  test("renders with correct id for navigation", () => {
    const aboutSection = document.getElementById("about");
    expect(aboutSection).toBeInTheDocument();
  });

  test("renders background pattern SVG", () => {
    const svgPattern = document.querySelector("pattern");
    expect(svgPattern).toBeInTheDocument();
    expect(svgPattern).toHaveAttribute(
      "id",
      "1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
    );
  });

  test("has proper styling classes", () => {
    const container = document.getElementById("about");
    expect(container).toHaveClass("relative", "isolate");
  });

  test("renders background decorative elements", () => {
    const decorativeSvg = screen.getByRole("presentation");
    expect(decorativeSvg).toHaveClass(
      "absolute",
      "inset-x-0",
      "top-0",
      "-z-10"
    );
  });
});
