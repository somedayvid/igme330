import * as utils from './utils.js';
import * as info from './extra-info.js';

let mainKanjiArray = [];
let mainVocabArray = [];
let mainRadicalsArray = [];
let term = "";
let timesToLoop = 0;

const requestHeaders =
new Headers({
  Authorization: 'Bearer ' +  ' 89abe689-ce3d-4035-acfd-65d442782f72 ',
});
 
//local storage variables
const prefix = "dg8516-";
const searchTermKey = prefix + "term";
const wordTypeKey = prefix + "type";
const searchByKey = prefix + "searchBy";

const storedTerm = localStorage.getItem(searchTermKey);
const storedType = localStorage.getItem(wordTypeKey);
const storedSearchBy = localStorage.getItem(searchByKey);

window.onload = () => {
  const searchWindow = document.querySelector("#search-term");
  const typeSelector = document.querySelector("#type");
  const searchBySelector = document.querySelector("#search-by");

  //attaches const to actions the user can take
  document.querySelector("#search").onclick = searchButtonClicked;

  info.showHomeInfo();
  document.querySelector("#title").onclick = info.showHomeInfo;
  searchWindow.onchange = storeAll;
  typeSelector.onchange = storeAll;
  searchBySelector.onchange = storeAll;
  typeSelector.onchange = displayExplanation;

  //checks and puts stored terms into each interactible item
  if(storedTerm){
    searchWindow.value = storedTerm;
  }
  else{
    searchWindow.value = "summer";
  }
  if(storedType){
    typeSelector.value = storedType;
  }
  else{
    typeSelector.value = "";
  }
  if(storedSearchBy){
    searchBySelector.value = storedSearchBy;
  }
  else{
    searchBySelector.value = "";
  }

  //gets all api information for japanese writing systems
  getAllWords("radical",'https://api.wanikani.com/v2/subjects?types=radical');
  getAllWords("kanji", 'https://api.wanikani.com/v2/subjects?types=kanji');
  getAllWords("vocabulary", 'https://api.wanikani.com/v2/subjects?types=vocabulary');
};

//is called each time a locally stored value is changed to ensure all changes are accounted for
const storeAll = () => {
  localStorage.setItem(searchTermKey, document.querySelector("#search-term").value);
  localStorage.setItem(wordTypeKey, document.querySelector("#type").value);
  localStorage.setItem(searchByKey, document.querySelector("#search-by").value);
}

//gets the button search options and passes them into the data accessor
const searchButtonClicked = () => {
  const searchType = document.querySelector("#type").value;
  const searchBy = document.querySelector("#search-by").value;
  const resultsInfo = document.querySelector("#num-results");
  term = document.querySelector("#search-term").value;

  document.querySelector("#display").innerHTML = "";

  term = term.trim();

  //checks if the search term even exists first, and gives user feedback
  if(term == ""){
    if(searchBy == "level"){
      resultsInfo.innerHTML = `Please input a number between 1 and 60(inclusive)!`;
    }
    else if(searchBy == "def"){
      resultsInfo.innerHTML = `Please input a word into the search bar!`;
    }
  }
  else{

  switch(searchBy){
    case "def":
      resultsInfo.innerHTML = `Searching for definitions that match "${term}"`;
      switch(searchType){
        case "radical":
          accessByDef(searchType, mainRadicalsArray);
          break;
        case "vocabulary":
          accessByDef(searchType, mainVocabArray);
          break;
        case "kanji":
          accessByDef(searchType, mainKanjiArray);
          break;
      }
      break;
    case "level":
      resultsInfo.innerHTML = `Searching for words from level "${term}"`;
      switch(searchType){
        case "radical":
          accessByLevel(searchType, mainRadicalsArray);
          break;
        case "vocabulary":
          accessByLevel(searchType, mainVocabArray);
          break;
        case "kanji":
          accessByLevel(searchType, mainKanjiArray);
          break;
      }
      break;
    }
  }
}

//gets all the kanji from the api
const getAllWords = (type, initialLink) => {
  let tempArray = [];

  fetch(new Request(initialLink, {
    method: 'GET',
    headers: requestHeaders
  }))
    .then(response => response.json())
    .then(responseBody => {
      //grabs initial page of information into temporary array
      tempArray = responseBody.data;
      //radical information only encompasses one page so it exits early, for the other types,
      //we have to loop through the rest of the pages
      if(responseBody.pages.next_url != null){
        repeatingGetWords(tempArray, type, responseBody.pages.next_url);
      }
      else mainRadicalsArray = tempArray;
    }
  );
}

//recursive method that gathers the rest of all the api data and stores them on the page
const repeatingGetWords = (tempArray, type, nextURL) => {
    fetch(new Request(nextURL, {
      method: 'GET',
      headers: requestHeaders}))
      .then(response => response.json())
      .then(responseBody => { 
        //setting information into a temporary array and getting next page url
        const emptyArray = tempArray;
        tempArray = emptyArray.concat(responseBody.data);
        nextURL = responseBody.pages.next_url;
        //continues to loop if there is more information to get
        if(nextURL != null){
          repeatingGetWords(tempArray, type, nextURL);
        }
        else{
          //setting them to the array that they belong to
         switch(type){
          case "kanji":
            mainKanjiArray = tempArray.slice(0);
            break;
          case "vocabulary":
            mainVocabArray = tempArray.slice(0);
            break;
         }
        }
      }
  );
}

//checks for words that are the user input level, and then gathers them in a great string
const accessByLevel = (type, array) => {
  let results = [];
  let bigString = "";

  for(let i = 0; i< array.length;i++){
    if(array[i].data.level == term.trim()){
      results.push(array[i]);
    }
  }

  if(utils.hasResults(results, term)){
    document.querySelector("#num-results").innerHTML = `<p>${results.length} result(s) for level ${term} ${type}</p>`;
    document.querySelector("#display").innerHTML = getReadings(type, results, bigString);
  }
}

//checks for words that contain the user input, and then gathers them in a great string
const accessByDef = (type, array) => {
  let results = [];
  let bigString = "";

  //first checks if the user input term will net any results
  for(let i = 0; i < array.length;i++){
    for(let k = 0; k < array[i].data.meanings.length;k++){
      if(array[i].data.meanings[k].meaning == utils.capitalizeEachWord(term)){
        results.push(array[i]);
      }
    }
  }
  //if not then returns nothing and displays that there were no results
  if(utils.hasResults(results, term)){
    document.querySelector("#num-results").innerHTML = `<p>${results.length} result(s) for "${term}"</p>`;
    document.querySelector("#display").innerHTML = getReadings(type, results, bigString);
  }
}

//gets all neccesary readings and information for each type
const getReadings = (type, results, bigString) => {
switch(type){
  case "radical":
    for(let i = 0; i < results.length;i++)
    {
      bigString += displayResultsAsString(type, results, i);
    }
    return bigString;
  case "kanji":
    for(let z = 0; z < results.length;z++){
      let meaningsString = "";
  
      //loops through the meanings data and adds the data to a meanings string
      let meaningsArray = results[z].data.meanings;
      for(let j = 0; j < meaningsArray.length;j++){
        meaningsString += meaningsArray[j].meaning;
        if(meaningsArray.length > j + 1){
          meaningsString += ", ";
        }
      }
  
    let readingsArray = results[z].data.readings;
  
    let OnString = "";
    let KunString = "";
  
    //can get both readings by looping through the arrays 
    for(let h = 0; h < readingsArray.length;h++){
      if(readingsArray[h].type == "onyomi"){
        OnString += readingsArray[h].reading;
        //checks each reading for if the type is onyomi and the next reading in the array as well
        //then adds them to the onyomi string
        if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "onyomi"){
          OnString += ", ";
        }
      }
      //same process for kunyomi as the onyomi readings
      else if(readingsArray[h].type == "kunyomi"){
        KunString += readingsArray[h].reading;
        if(h + 1 < readingsArray.length && readingsArray[h + 1].type == "kunyomi"){
          KunString += ", ";
        }
      }
    }
    //some kanji have no readings for onyomi or kunyomi so display none instead
    if(OnString == ""){
      OnString = "None";
    }
    if(KunString == ""){
      KunString = "None";
    }
      bigString += displayResultsAsString(type, results, z,meaningsString,"", OnString, KunString, );
    }
    return bigString;
  case "vocabulary":
    for(let z = 0; z < results.length;z++){
      let meaningsString = "";
      let readingsString = "";
  
      //loops through the meanings data and adds the data to a meanings string
      let meaningsArray = results[z].data.meanings;
      for(let j = 0; j < meaningsArray.length;j++){
        meaningsString += meaningsArray[j].meaning;
        if(meaningsArray.length > j + 1){
          meaningsString += ", ";
        }
      }
  
      //if the type specifically is vocabulary then there is only one reading
        let readingsArray = results[z].data.readings;
        for(let j = 0; j < readingsArray.length;j++){
          readingsString += readingsArray[j].reading;
          if(readingsArray.length > j + 1){
            readingsString += ", ";
        }
      }
      bigString += displayResultsAsString(type, results, z, meaningsString, readingsString);
    }
    return bigString;
}
}

//contains all the ways that each type is represented in a string and returns it to be added to a greater string
const displayResultsAsString = (type, resultsArray, index ,meanings = "", readings ="", onyomis="", kunyomis="") => {
  switch(type){
    case "radical":
      return `<div class="box is-rounded has-background-danger-light has-text-centered">
      <p id="identifier">Identifier: ${resultsArray[index].data.meanings[0].meaning}</p>
      <p id="character">Character: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
      </div>`;
    case "kanji":
      return `<div class = "box is-rounded has-background-danger-light has-text-centered">
      <p id="meanings">Meanings: ${meanings}</p>
      <p id="onyomi">Onyomi: ${onyomis}</p>
      <p id="kunyomi">Kunyomi: ${kunyomis}</p>
      <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
    </div>`;
    case "vocabulary":
      return `<div class="box is-rounded has-background-danger-light has-text-centered">
      <p id="meanings">Meanings: ${meanings}</p>
      <p id="readings">Kana: ${readings}</p>
      <p id="slug">Kanji: ${resultsArray[index].data.characters}</p>
      <p id="level">Level: ${resultsArray[index].data.level}</p>
    </div>`;
  }
}

//adjusts the explanation present each time the type is changed
const displayExplanation = () => {
switch(document.querySelector("#type").value){
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