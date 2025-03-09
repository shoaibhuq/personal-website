import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("renders social media links", () => {
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks.length).toBeGreaterThan(0);

    // Check for specific social media links
    const socialIcons = screen.getAllByRole("img", { hidden: true });
    expect(socialIcons.length).toBeGreaterThan(0);
  });

  test("renders copyright text", () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear}`));
    expect(copyrightText).toBeInTheDocument();
  });

  test("has proper styling classes", () => {
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toHaveClass("bg-black");

    const container = footerElement.querySelector("div");
    expect(container).toHaveClass("mx-auto", "max-w-7xl");
  });

  test("social links have proper attributes", () => {
    const socialLinks = screen.getAllByRole("link");

    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
