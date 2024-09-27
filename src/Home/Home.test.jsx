import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, afterAll, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Home from "./Home";
import userEvent from "@testing-library/user-event";

// Setting up the Mock Service Worker (MSW)
const server = setupServer(
  http.get("/hello", () => {
    return HttpResponse.json([
      {
        word: "hello",
        phonetics: [
          {
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=75797336",
            license: {
              name: "BY-SA 4.0",
              url: "https://creativecommons.org/licenses/by-sa/4.0",
            },
          },
          {
            text: "/həˈləʊ/",
            audio:
              "https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3",
            sourceUrl:
              "https://commons.wikimedia.org/w/index.php?curid=9021983",
            license: {
              name: "BY 3.0 US",
              url: "https://creativecommons.org/licenses/by/3.0/us",
            },
          },
          { text: "/həˈloʊ/", audio: "" },
        ],
        meanings: [
          {
            partOfSpeech: "noun",
            definitions: [
              {
                definition: '"Hello!" or an equivalent greeting.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: ["greeting"],
            antonyms: [],
          },
          {
            partOfSpeech: "verb",
            definitions: [
              {
                definition: 'To greet with "hello".',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: [],
            antonyms: [],
          },
          {
            partOfSpeech: "interjection",
            definitions: [
              {
                definition:
                  "A greeting (salutation) said when meeting someone or acknowledging someone’s arrival or presence.",
                synonyms: [],
                antonyms: [],
                example: "Hello, everyone.",
              },
              // Additional definitions...
            ],
            synonyms: [],
            antonyms: ["bye", "goodbye"],
          },
        ],
        license: {
          name: "CC BY-SA 3.0",
          url: "https://creativecommons.org/licenses/by-sa/3.0",
        },
        sourceUrls: ["https://en.wiktionary.org/wiki/hello"],
      },
    ]);
  })
);

// Start the server before tests and close it afterward
beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Home Component", () => {
  // Render the Home component before each test
  beforeEach(() => {
    render(<Home />);
  });

  // Test if input field is present
  it("should display the input field", () => {
    const inputElement = screen.getByPlaceholderText("Enter the word to search");
    expect(inputElement).toBeInTheDocument();
  });

  // Test if search button is present
  it("should display the search button", () => {
    const buttonElement = screen.getByRole("button", { name: "Search" });
    expect(buttonElement).toBeInTheDocument();
  });

  // Test error message when input field is empty
  it("should show an error message when input field is empty", async () => {
    const buttonElement = screen.getByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const errorMessage = screen.getByText("Input field empty");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  // Test API mock and display data
  it("should display data from mock API", async () => {
    const inputElement = screen.getByPlaceholderText("Enter the word to search");
    await userEvent.type(inputElement, "hello");
    const buttonElement = screen.getByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      expect(screen.getByText("noun")).toBeInTheDocument();
    });
  });

  // Test if audio is displayed correctly
  it("should display audio from mock API", async () => {
    const inputElement = screen.getByPlaceholderText("Enter the word to search");
    await userEvent.type(inputElement, "hello");
    const buttonElement = screen.getByRole("button", { name: "Search" });
    userEvent.click(buttonElement);
    await waitFor(() => {
      const audioElement = screen.getByRole("audio");
      expect(audioElement).toBeInTheDocument();
      expect(audioElement.querySelector("source")).toHaveAttribute(
        "src",
        "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"
      );
    });
  });
});
