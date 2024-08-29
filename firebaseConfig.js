import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOzm7Cn9HRbRwYZbIaU3lFZKICT8juw2o",
  authDomain: "authentication-app-eazymass.firebaseapp.com",
  databaseURL:
    "https://authentication-app-eazymass-default-rtdb.firebaseio.com",
  projectId: "authentication-app-eazymass",
  storageBucket: "authentication-app-eazymass.appspot.com",
  messagingSenderId: "35732165848",
  appId: "1:35732165848:web:ff2dd1f37b26b0d98af3ad",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { database, auth, storage };
