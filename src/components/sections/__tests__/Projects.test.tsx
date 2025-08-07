import React from "react";
import { render, screen } from "@testing-library/react";
import Projects from "../Projects";

beforeAll(() => {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // @ts-ignore
  global.IntersectionObserver = IntersectionObserverMock;
});

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
    const projectCards = screen.getAllByRole("listitem");
    expect(projectCards.length).toBeGreaterThan(0);
  });

  test("project cards have required elements", () => {
    const projectCards = screen.getAllByRole("listitem");

    projectCards.forEach((card) => {
      // Each card should have a title
      expect(card.querySelector("div[class*='font-bold']")).toBeInTheDocument();

      // Each card should have a description
      expect(card.querySelector("p")).toBeInTheDocument();

      // Each card should have links
      const links = card.querySelectorAll("a");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  test("has proper styling classes", () => {
    const heading = document.getElementById("projects");
    expect(heading).toHaveClass(
      "text-gray-200",
      "my-10",
      "text-center",
      "font-bold",
      "text-5xl",
      "tracking-tight"
    );
  });
});
