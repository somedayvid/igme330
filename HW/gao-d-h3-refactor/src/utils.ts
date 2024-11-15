const capitalizeEachWord = (string: string): string => {
  const words = string.split(" ");
  const capitalizedWords = words.map(capitalizeFirstLetter);
  return capitalizedWords.join(" ");
};

const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const lowercaseFirstLetter = (string: string): string => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

// Adjusts feedback to user to ensure their search options are configured correctly
const hasResults = (results: any[], term: string): boolean => {
  const searchBy = document.querySelector("#search-by") as HTMLSelectElement | null;
  const numResultsElement = document.querySelector("#num-results") as HTMLElement | null;

  if (results.length <= 0 && numResultsElement) {
    if (searchBy?.value === "level" && isNaN(Number(term))) {
      numResultsElement.innerHTML = `Please input a NUMBER between 1 and 60 (inclusive) in order to search by LEVEL or choose DEFINITION in the search by dropdown.`;
    } else if (searchBy?.value === "def" && !isNaN(Number(term))) {
      numResultsElement.innerHTML = `Please input a WORD in order to search by DEFINITION or choose LEVEL in the search by dropdown.`;
    } else {
      numResultsElement.innerHTML = `No results found for "${term}"`;
    }
    return false;
  }
  return true;
};

export { capitalizeEachWord, lowercaseFirstLetter, hasResults };
