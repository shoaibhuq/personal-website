import React from "react";
import { render, screen } from "@testing-library/react";
import Projects from "../Projects";

describe("Projects", () => {
  beforeEach(() => {
    render(<Projects />);
  });

  test("renders with correct id for navigation", () => {
    const projectsSection = document.getElementById("projects");
    expect(projectsSection).toBeInTheDocument();
  });

  test("renders section title", () => {
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  });

  test("renders project cards", () => {
    const projectCards = screen.getAllByRole("article");
    expect(projectCards.length).toBeGreaterThan(0);
  });

  test("project cards have required elements", () => {
    const projectCards = screen.getAllByRole("article");

    projectCards.forEach((card) => {
      // Each card should have a title
      expect(card.querySelector("h3")).toBeInTheDocument();

      // Each card should have a description
      expect(card.querySelector("p")).toBeInTheDocument();

      // Each card should have links
      const links = card.querySelectorAll("a");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  test("has proper styling classes", () => {
    const container = document.getElementById("projects");
    expect(container).toHaveClass("py-24", "sm:py-32");
  });
});
