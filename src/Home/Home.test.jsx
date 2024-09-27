import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home'; // Adjust the import as necessary

describe('Home Component', () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = vi.fn();
    
    render(<Home />);
  });

  it("input field must be present", () => {
    const inputElement = screen.getByPlaceholderText("Enter the word to search");
    expect(inputElement).toBeInTheDocument();
  });

  it("search button must be present", () => {
    const buttonElement = screen.getByRole("button", { name: /search/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("if input field empty then show error message", async () => {
    const buttonElement = screen.getByRole("button", { name: /search/i });
    await userEvent.click(buttonElement);

    const errorMessage = await screen.findByText("Input field empty."); // Ensure this matches the actual error message
    expect(errorMessage).toBeInTheDocument();
  });

  // Add additional tests as needed...
});
