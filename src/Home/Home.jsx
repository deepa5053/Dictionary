import { useState, useRef } from "react";

function Home() {
  // State to hold the searched word
  const [searchedWord, setSearchedWord] = useState("");

  // State to hold the meanings fetched from the API
  const [meanings, setMeanings] = useState([]);

  // State to hold the audio URL for pronunciation
  const [audioUrl, setAudioUrl] = useState("");

  // API base URL for dictionary lookup
  const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

  // Reference to control the audio element
  const audioRef = useRef(null);

  // Function to handle search request
  async function handleSearch(event) {
    event.preventDefault(); // Prevent form submission refresh
    if (searchedWord === "") {
      // Show alert if search field is empty
      console.log("empty");
      window.alert("Search field is empty");
    } else {
      try {
        // Fetch data from the dictionary API
        let response = await fetch(`${baseUrl}${searchedWord}`, {
          method: "GET",
        });

        const data = await response.json();
        console.log(data); // Log the received data for debugging

        // Set meanings from the API response
        setMeanings(data[0].meanings);

        // If phonetics data is available, set the audio URL
        if (data[0].phonetics.length > 0) {
          setAudioUrl(data[0].phonetics[0].audio);

          // If there's an existing audioRef, pause and reload the audio to reset it
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
          }
        } else {
          // Clear audio URL if no phonetics are found
          setAudioUrl("");
        }
      } 
      catch (error) {
        // Log error if the word is not found
        console.log("Word not found");
      }
    }
  }

  // Function to clear the displayed meanings and audio when the X button is clicked
  function handleClose() {
    setMeanings([]); // Clear the meanings
    setAudioUrl(""); // Clear the audio URL
    setSearchedWord(""); // Clear the searched word input
  }

  return (
    <section>
      <section>
        <h1>Online word search !!!</h1>
        <form>
          <label> Enter word : </label>
          <input
            type="text"
            placeholder="Enter the word to search"
            value={searchedWord} // Bind input value to the searchedWord state
            onChange={(event) => {
              setSearchedWord(event.target.value); // Update searchedWord state when input changes
            }}
          />
          <button onClick={(event) => handleSearch(event)}> Search </button>
        </form>
      </section>
      <section>
       
        {meanings.length > 0 && (
          <div>
            <button onClick={handleClose} style={{ float: "right", cursor: "pointer" }}>
              X
            </button>
            {meanings.map((meaning, index) => (
              <div key={index}>
                <h4>{meaning.partOfSpeech}</h4>
                {meaning.definitions.map((definition, defIndex) => (
                  <div key={defIndex}>
                    <p>{definition.definition}</p>
                  </div>
                ))}
              </div>
            ))}
            {audioUrl && (
             <audio controls ref={audioRef} role="audio">
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
