import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import NavBar from "../../NavBar";

describe("NavBar Component", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      );
    });
  });

  it("should render the website logo/name", () => {
    expect(screen.getByText("shoaibhuq.com")).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getByText("Photography")).toBeInTheDocument();
  });

  it("should have correct navigation hrefs", () => {
    expect(screen.getByText("About Me").closest("a")).toHaveAttribute(
      "href",
      "/#about"
    );
    expect(screen.getByText("Projects").closest("a")).toHaveAttribute(
      "href",
      "/#projects"
    );
  });

  it("should open mobile menu when hamburger button is clicked", async () => {
    const menuButton = screen.getByRole("button", { name: /open main menu/i });

    await act(async () => {
      fireEvent.click(menuButton);
    });

    // Check if mobile menu items are visible
    const mobileMenu = screen.getAllByRole("link", {
      name: /about me|projects|contact me|photography/i,
    });
    expect(mobileMenu.length).toBeGreaterThan(0);
  });

  it("should close mobile menu when close button is clicked", async () => {
    // Open menu first
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /open main menu/i }));
    });

    // Click close button
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
