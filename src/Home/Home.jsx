import { useState, useRef } from "react";

function Home() {
  // State variables to hold searched word, meanings, audio URL, and error messages
  const [searchedWord, setSearchedWord] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  // Base URL for the dictionary API
  const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const audioRef = useRef(null); // Ref to control audio playback

  // Function to handle the search operation
  async function handleSearch(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    if (searchedWord === "") {
      // Show error if input is empty
      setError("Input field empty");
    } else {
      setError(""); // Clear error message
      try {
        // Fetch data from the API
        let response = await fetch(`${baseUrl}${searchedWord}`);
        const data = await response.json();

        // Update meanings state with fetched data
        setMeanings(data[0].meanings);
        
        // Set audio URL if available
        if (data[0].phonetics.length > 0) {
          setAudioUrl(data[0].phonetics[0].audio);
          
          // If audio is currently playing, pause and reload
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
          }
        } else {
          setAudioUrl(""); // Reset audio URL if not available
        }
      } catch (error) {
        console.log("Word not found");
        setError("Word not found"); // Show error if the word is not found
      }
    }
  }

  // Function to handle closing the results
  function handleClose() {
    // Reset all state variables to initial values
    setMeanings([]);
    setAudioUrl("");
    setSearchedWord("");
  }

  return (
    <section>
      <header>
        <h1>Online Word Search!</h1>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message if present */}
      </header>
      
      <form onSubmit={handleSearch}>
        <label htmlFor="search-input">Enter word:</label>
        <input
          id="search-input"
          type="text"
          placeholder="Enter the word to search"
          value={searchedWord}
          onChange={(event) => {
            setSearchedWord(event.target.value);
            setError(""); // Clear error when typing
          }}
        />
        <button type="submit">Search</button> {/* Use type="submit" for the button */}
      </form>

      <section>
        {meanings.length > 0 && (
          <div>
            <button onClick={handleClose} style={{ float: "right", cursor: "pointer" }}>
              X {/* Button to close the results */}
            </button>
            {meanings.map((meaning, index) => (
              <div key={index}>
                <h4>{meaning.partOfSpeech}</h4> {/* Display part of speech */}
                {meaning.definitions.map((definition, defIndex) => (
                  <div key={defIndex}>
                    <p>{definition.definition}</p> {/* Display definition */}
                  </div>
                ))}
              </div>
            ))}
            {audioUrl && (
              <audio controls ref={audioRef} role="audio"> {/* Audio player for pronunciation */}
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default Home;
