import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment } from  "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const parks = {
  "p79"   : "Letchworth State Park",
  "p20"   : "Hamlin Beach State Park",
  "p180"  : "Brookhaven State Park",
  "p35"   : "Allan H. Treman State Marine Park",
  "p118"  : "Stony Brook State Park",
  "p142"  : "Watkins Glen State Park",
  "p62"   : "Taughannock Falls State Park",
  "p84"   : "Selkirk Shores State Park",
  "p43"   : "Chimney Bluffs State Park",
  "p200"  : "Shirley Chisholm State Park",
  "p112"  : "Saratoga Spa State Park"
};

const firebaseConfig = {
  apiKey: "AIzaSyB_PJYkE06WZFG579mQfmcPsM897RMK-sc",
  authDomain: "newyork-state-map.firebaseapp.com",
  projectId: "newyork-state-map",
  storageBucket: "newyork-state-map.firebasestorage.app",
  messagingSenderId: "1008631890725",
  appId: "1:1008631890725:web:225f461b80b5c11daa90cc"
};

const init = () => {
  initializeApp(firebaseConfig);
}

const incrementLikes = ID => {
  const db = getDatabase();
  const name = parks[ID];
  const favRef = ref(db, 'favorites/' + name, ID);
  set(favRef, {
      name,
      ID,
      likes: increment(1)
  });
};

const decrementLikes = ID =>{
  const db = getDatabase();
  const name = parks[ID];
  const favRef = ref(db, 'favorites/' + name, ID);
  set(favRef, {
      name,
      ID,
      likes: increment(-1)
  });
}

const getLikes = () =>{
  const db = getDatabase();
  const favRef = ref(db, 'favorites');

  const popularityDisplay = document.querySelector("#pop-display");

  const favsChanged = snapshot => {
    popularityDisplay.innerHTML = "";
    snapshot.forEach(score => {
      const childKey = score.key;
      const childData = score.val();
      popularityDisplay.innerHTML += `<li>${childData.name}(${childData.ID}) - Likes: ${childData.likes}</li>`;
    });
  }

  onValue(favRef,favsChanged);
}

export {incrementLikes, init, getLikes, decrementLikes}