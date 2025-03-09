import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "../HomePage";

// Mock the child components
jest.mock("../../NavBar", () => () => (
  <div data-testid="navbar">NavBar Component</div>
));
jest.mock("../AboutMe", () => () => (
  <div data-testid="about-me">AboutMe Component</div>
));
jest.mock("../Projects", () => () => (
  <div data-testid="projects">Projects Component</div>
));
jest.mock("../../Footer", () => () => (
  <div data-testid="footer">Footer Component</div>
));

describe("HomePage", () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  test("renders all main sections", () => {
    expect(screen.getByTestId("about-me")).toBeInTheDocument();
    expect(screen.getByTestId("projects")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("has correct layout structure", () => {
    const mainElement = screen.getByRole("main");
    const footerElement = screen.getByRole("contentinfo");

    expect(mainElement).toHaveClass("bg-black");
    expect(footerElement).toHaveClass("bg-black");
  });

  test("maintains proper styling classes", () => {
    const bodyElement = document.querySelector("body");
    const containerDiv = document.querySelector("div.bg-black.h-screen");

    expect(bodyElement).toHaveClass("bg-black", "h-screen");
    expect(containerDiv).toBeInTheDocument();
  });
});
