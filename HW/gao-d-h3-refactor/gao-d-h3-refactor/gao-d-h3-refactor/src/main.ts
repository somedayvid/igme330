import * as utils from './utils';
import * as info from './extra-info';

// Define types for arrays
interface WaniKaniData {
  data: {
    level: number;
    meanings: Array<{ meaning: string }>;
    readings?: Array<{ type: string; reading: string }>;
    characters: string;
  };
}

let mainKanjiArray: WaniKaniData[] = [];
let mainVocabArray: WaniKaniData[] = [];
let mainRadicalsArray: WaniKaniData[] = [];
let term: string = "";

const requestHeaders = new Headers({
  Authorization: 'Bearer ' + '89abe689-ce3d-4035-acfd-65d442782f72',
});

// Local storage variables
const prefix = "dg8516-";
const searchTermKey = prefix + "term";
const wordTypeKey = prefix + "type";
const searchByKey = prefix + "searchBy";

const storedTerm = localStorage.getItem(searchTermKey);
const storedType = localStorage.getItem(wordTypeKey);
const storedSearchBy = localStorage.getItem(searchByKey);

window.onload = () => {
  const searchWindow = document.querySelector("#search-term") as HTMLInputElement;
  const typeSelector = document.querySelector("#type") as HTMLSelectElement;
  const searchBySelector = document.querySelector("#search-by") as HTMLSelectElement;

  // Attach event listeners
  document.querySelector("#search")!.addEventListener("click", searchButtonClicked);

  info.showHomeInfo();
  document.querySelector("#title")!.addEventListener("click", info.showHomeInfo);
  searchWindow.addEventListener("change", storeAll);
  typeSelector.addEventListener("change", storeAll);
  searchBySelector.addEventListener("change", storeAll);
  typeSelector.addEventListener("change", displayExplanation);

  // Set stored values if present
  searchWindow.value = storedTerm || "summer";
  typeSelector.value = storedType || "";
  searchBySelector.value = storedSearchBy || "";

  // Fetch all kanji, vocabulary, and radical data
  getAllWords("radical", 'https://api.wanikani.com/v2/subjects?types=radical');
  getAllWords("kanji", 'https://api.wanikani.com/v2/subjects?types=kanji');
  getAllWords("vocabulary", 'https://api.wanikani.com/v2/subjects?types=vocabulary');
};

// Store all locally stored values
const storeAll = (): void => {
  localStorage.setItem(searchTermKey, (document.querySelector("#search-term") as HTMLInputElement).value);
  localStorage.setItem(wordTypeKey, (document.querySelector("#type") as HTMLSelectElement).value);
  localStorage.setItem(searchByKey, (document.querySelector("#search-by") as HTMLSelectElement).value);
}

// Handle search button click
const searchButtonClicked = (): void => {
  const searchType = (document.querySelector("#type") as HTMLSelectElement).value;
  const searchBy = (document.querySelector("#search-by") as HTMLSelectElement).value;
  const resultsInfo = document.querySelector("#num-results") as HTMLElement;
  term = (document.querySelector("#search-term") as HTMLInputElement).value.trim();

  document.querySelector("#display")!.innerHTML = "";

  if (term === "") {
    resultsInfo.innerHTML = searchBy === "level" 
      ? `Please input a number between 1 and 60 (inclusive)!` 
      : `Please input a word into the search bar!`;
  } else {
    resultsInfo.innerHTML = `Searching for ${searchBy === "def" ? "definitions" : "words"} that match "${term}"`;

    if (searchBy === "def") {
      accessByDef(searchType, getArrayForType(searchType));
    } else if (searchBy === "level") {
      accessByLevel(searchType, getArrayForType(searchType));
    }
  }
}

// Get all kanji, vocab, or radical data
const getAllWords = (type: string, initialLink: string): void => {
  fetch(new Request(initialLink, { method: 'GET', headers: requestHeaders }))
    .then(response => response.json())
    .then(responseBody => {
      const tempArray = responseBody.data;
      if (responseBody.pages.next_url) {
        repeatingGetWords(tempArray, type, responseBody.pages.next_url);
      } else {
        mainRadicalsArray = tempArray;
      }
    });
}

// Recursively fetch the remaining pages
const repeatingGetWords = (tempArray: WaniKaniData[], type: string, nextURL: string): void => {
  fetch(new Request(nextURL, { method: 'GET', headers: requestHeaders }))
    .then(response => response.json())
    .then(responseBody => { 
      const updatedArray = tempArray.concat(responseBody.data);
      if (responseBody.pages.next_url) {
        repeatingGetWords(updatedArray, type, responseBody.pages.next_url);
      } else {
        assignArray(type, updatedArray);
      }
    });
}

// Assigns fetched data to the appropriate array
const assignArray = (type: string, array: WaniKaniData[]): void => {
  switch(type) {
    case "kanji": mainKanjiArray = array; break;
    case "vocabulary": mainVocabArray = array; break;
    case "radical": mainRadicalsArray = array; break;
  }
}

// Access and display results based on level
const accessByLevel = (type: string, array: WaniKaniData[]): void => {
  const results = array.filter(item => item.data.level === parseInt(term));
  if (utils.hasResults(results, term)) {
    document.querySelector("#num-results")!.innerHTML = `<p>${results.length} result(s) for level ${term} ${type}</p>`;
    document.querySelector("#display")!.innerHTML = getReadings(type, results);
  }
}

// Access and display results based on definition
const accessByDef = (type: string, array: WaniKaniData[]): void => {
  const results = array.filter(item =>
    item.data.meanings.some(meaning => meaning.meaning === utils.capitalizeEachWord(term))
  );
  if (utils.hasResults(results, term)) {
    document.querySelector("#num-results")!.innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
    document.querySelector("#display")!.innerHTML = getReadings(type, results);
  }
}

// Return array by type
const getArrayForType = (type: string): WaniKaniData[] => {
  switch(type) {
    case "kanji": return mainKanjiArray;
    case "vocabulary": return mainVocabArray;
    case "radical": return mainRadicalsArray;
    default: return [];
  }
}

// Format readings for display
const getReadings = (type: string, results: WaniKaniData[]): string => {
  return results.map(result => displayResultsAsString(type, result)).join('');
}

// Create result string based on type
const displayResultsAsString = (type: string, result: WaniKaniData): string => {
  switch(type) {
    case "radical":
      return `<div class="box is-rounded has-background-danger-light has-text-centered">
        <p id="identifier">Identifier: ${result.data.meanings[0].meaning}</p>
        <p id="character">Character: ${result.data.characters}</p>
        <p id="level">Level: ${result.data.level}</p>
      </div>`;
    case "kanji":
      const onyomi = formatReadings(result.data.readings || [], "onyomi");
      const kunyomi = formatReadings(result.data.readings || [], "kunyomi");
      return `<div class="box is-rounded has-background-danger-light has-text-centered">
        <p id="meanings">Meanings: ${getMeanings(result)}</p>
        <p id="onyomi">Onyomi: ${onyomi || "None"}</p>
        <p id="kunyomi">Kunyomi: ${kunyomi || "None"}</p>
        <p id="slug">Kanji: ${result.data.characters}</p>
        <p id="level">Level: ${result.data.level}</p>
      </div>`;
    case "vocabulary":
      return `<div class="box is-rounded has-background-danger-light has-text-centered">
        <p id="meanings">Meanings: ${getMeanings(result)}</p>
        <p id="readings">Kana: ${result.data.readings![0].reading}</p>
        <p id="slug">Kanji: ${result.data.characters}</p>
        <p id="level">Level: ${result.data.level}</p>
      </div>`;
  }
  return "";
}

// Helper function to get meanings
const getMeanings = (result: WaniKaniData): string => {
  return result.data.meanings.map(m => m.meaning).join(", ");
}

// Helper function to format readings by type
const formatReadings = (readings: Array<{ type: string; reading: string }>, type: string): string => {
  return readings.filter(r => r.type === type).map(r => r.reading).join(", ");
}

const displayExplanation = () => {
  const typeSelector = document.querySelector("#type") as HTMLSelectElement;
  switch(typeSelector.value) {
    case "radical":
      info.explainRadicals();
      break;
    case "kanji":
      info.explainKanji();
      break;
    case "vocabulary":
      info.explainVocabulary();
      break;
  }
}