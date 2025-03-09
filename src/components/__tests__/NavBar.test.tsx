import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";

// Mock the heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  Bars3Icon: () => <div data-testid="bars-icon" />,
  XMarkIcon: () => <div data-testid="x-mark-icon" />,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NavBar", () => {
  beforeEach(() => {
    renderWithRouter(<NavBar />);
  });

  test("renders logo/home link", () => {
    const homeLink = screen.getByText("shoaibhuq.com");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  test("renders navigation items", () => {
    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getByText("Photography")).toBeInTheDocument();
  });

  test("mobile menu button toggles menu", () => {
    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    expect(menuButton).toBeInTheDocument();

    // Click to open menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();

    // Find close button and click it
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(screen.getByTestId("bars-icon")).toBeInTheDocument();
  });

  test("has correct styling classes", () => {
    const header = document.querySelector("header");
    expect(header).toHaveClass(
      "border-white",
      "border",
      "bg-black/70",
      "backdrop-blur-sm"
    );

    const nav = document.querySelector("nav");
    expect(nav).toHaveClass(
      "mx-auto",
      "flex",
      "max-w-7xl",
      "items-center",
      "justify-between"
    );
  });
});
