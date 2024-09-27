import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home"; // Adjust the import path as needed

describe("Home Component", () => {
  beforeEach(() => {
    render(<Home />);
  });

  test("renders input and search button", () => {
    const input = screen.getByPlaceholderText("Enter the word to search");
    expect(input).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test("shows alert for empty search field", async () => {
    const button = screen.getByRole("button", { name: /search/i });
    userEvent.click(button);

    expect(await screen.findByText("Search field is empty")).toBeInTheDocument();
  });

  test("displays definition and audio when a word is searched", async () => {
    // Mock the fetch request for testing
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              meanings: [
                {
                  partOfSpeech: "noun",
                  definitions: [
                    {
                      definition: "A sample of a word to be defined.",
                    },
                  ],
                },
              ],
              phonetics: [
                {
                  audio: "https://example.com/audio/testword.mp3",
                },
              ],
            },
          ]),
      })
    );

    const input = screen.getByPlaceholderText("Enter the word to search");
    userEvent.type(input, "testword"); // Simulate user typing
    const button = screen.getByRole("button", { name: /search/i });
    userEvent.click(button); // Simulate button click

    // Check for the definition
    expect(await screen.findByText("A sample of a word to be defined.")).toBeInTheDocument();
    // Check for the audio element
    expect(await screen.findByRole("audio")).toBeInTheDocument();
  });

  test("clears meanings and audio when 'X' button is clicked", async () => {
    // Mock the fetch request for testing
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              meanings: [
                {
                  partOfSpeech: "noun",
                  definitions: [
                    {
                      definition: "A sample of a word to be defined.",
                    },
                  ],
                },
              ],
              phonetics: [
                {
                  audio: "https://example.com/audio/testword.mp3",
                },
              ],
            },
          ]),
      })
    );

    const input = screen.getByPlaceholderText("Enter the word to search");
    userEvent.type(input, "testword"); // Simulate user typing
    const button = screen.getByRole("button", { name: /search/i });
    userEvent.click(button); // Simulate button click

    // Wait for the definition to appear
    expect(await screen.findByText("A sample of a word to be defined.")).toBeInTheDocument();

    // Click the 'X' button to clear results
    const clearButton = screen.getByRole("button", { name: /x/i });
    userEvent.click(clearButton);

    // Check that meanings and audio are cleared
    expect(screen.queryByText("A sample of a word to be defined.")).not.toBeInTheDocument();
    expect(screen.queryByRole("audio")).not.toBeInTheDocument();
  });
});
