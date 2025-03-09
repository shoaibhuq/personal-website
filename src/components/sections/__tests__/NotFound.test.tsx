import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import NotFound from "../NotFound";

describe("NotFound Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  });

  it("should display 404 error message", () => {
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("should display error description", () => {
    const errorText = screen.getByText(
      /sorry, we couldn't find the page you're looking for/i
    );
    expect(errorText).toBeInTheDocument();
  });

  it("should have a working back to home link", () => {
    const homeLink = screen.getByText(/back to home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });
});
