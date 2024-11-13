const capitalizeEachWord = string => {
  const sentence = string;
  const words = sentence.split(" ");
  const together = words.map(capitalizeFirstLetter);
  return together.join(" ");
}

const capitalizeFirstLetter = word => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const lowercaseFirstLetter = string => {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

//adjusts feedback to user to ensure their search options are configured correctly
const hasResults = (results,term) => {
  if(results.length <= 0){
    if(document.querySelector("#search-by").value == "level" && isNaN(term)){
      document.querySelector("#num-results").innerHTML = `Please input a NUMBER between 1 and 60(inclusive) in order to search by LEVEL or choose DEFINITION in the search by dropdown.`;
    }
    else if(document.querySelector("#search-by").value == "def" && isNaN(term) == false)
    document.querySelector("#num-results").innerHTML = `Please input a WORD in order to search by DEFINITION or choose LEVEL in the search by dropdown.`;
    else{
    document.querySelector("#num-results").innerHTML = `No results found for "${term}"`;
    }
    return false;
  }
  else return true;
}

export {capitalizeEachWord, lowercaseFirstLetter, hasResults};