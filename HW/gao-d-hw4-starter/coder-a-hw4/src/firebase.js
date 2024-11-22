{/* <script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
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
</script>

const setUpFirebase = () => {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyB_PJYkE06WZFG579mQfmcPsM897RMK-sc",
      authDomain: "newyork-state-map.firebaseapp.com",
      projectId: "newyork-state-map",
      storageBucket: "newyork-state-map.firebasestorage.app",
      messagingSenderId: "1008631890725",
      appId: "1:1008631890725:web:225f461b80b5c11daa90cc"
    };
  
    // Initialize Firebase
      app = initializeApp(firebaseConfig);
  }
  
  const addUserData = id => {
      const db = getDatabase();
      push(ref(db, "favorites"),{
          id
      });
  };
   */}