/* #1 - The Firebase setup code goes here  - both imports, `firebaseConfig` and `app` */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// Your web app's Firebase configuration

const init = () =>{
  const firebaseConfig = {
    apiKey: "AIzaSyB_PJYkE06WZFG579mQfmcPsM897RMK-sc",
    authDomain: "newyork-state-map.firebaseapp.com",
    projectId: "newyork-state-map",
    storageBucket: "newyork-state-map.firebasestorage.app",
    messagingSenderId: "1008631890725",
    appId: "1:1008631890725:web:225f461b80b5c11daa90cc"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);		
}
  
/* #2 - Also bring over your `writeHighScoreData()` helper function */
const addFavoriteData = arrayOfFavorites => {
  const db = getDatabase();
  const scoresRef = ref(db, "users");
  const newScoreRef = push(scoresRef,{
    arrayOfFavorites
  });
}

export {addFavoriteData, init}