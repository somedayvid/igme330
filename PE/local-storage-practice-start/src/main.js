import * as storage from "./storage.js"
let items = [];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  // loop though items and stick each array element into an <li>
  // use array.map()!
  // update the innerHTML of the <ol> already on the page
  const itemList = document.querySelector("#list");
  let listItemsTogether = "";
  items.map(e => listItemsTogether += `<li>${e}</li>`);
  itemList.innerHTML = listItemsTogether;
  saveToStorage();
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = () => {
  const str = document.querySelector("#thing-text").value;
  if(str.length){
    items.push(str);
    document.querySelector("#thing-text").value = ""; 
    showItems();
  }
};

const clearList = () =>{
  items.splice(0, items.length);
  showItems();
}

const saveToStorage = () =>{
  storage.writeToLocalStorage("savedItems", items);
}

// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
const init = () =>{
  const incomingItems = storage.readFromLocalStorage("savedItems");
  if(Array.isArray(incomingItems)){
    items = incomingItems;
    showItems();
  }
  document.querySelector("#btn-add").addEventListener("click", addItem); 
  document.querySelector("#btn-clear").addEventListener("click", clearList);
  
}
// When the page loads:
// - load in the `items` array from storage.js and display the current items
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array

// Got it working? 
// - Add a "Clear List" button that empties the items array
window.onload = init;
