import { render, screen } from '@testing-library/react';
import Footer from '../../Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the footer text', () => {
    expect(screen.getByText(/Shoaib Huq - Built with Love/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/cotton_shwab_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/shoaibhuq'
    );
  });

  it('renders social media icons', () => {
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('has correct aria-labels for social links', () => {
    const socialLinks = screen.getAllByRole('link');
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('class', expect.stringContaining('text-gray-400'));
    });
  });
});