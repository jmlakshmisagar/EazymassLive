import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, update, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOzm7Cn9HRbRwYZbIaU3lFZKICT8juw2o",
  authDomain: "authentication-app-eazymass.firebaseapp.com",
  databaseURL: "https://authentication-app-eazymass-default-rtdb.firebaseio.com",
  projectId: "authentication-app-eazymass",
  storageBucket: "authentication-app-eazymass.appspot.com",
  messagingSenderId: "35732165848",
  appId: "1:35732165848:web:ff2dd1f37b26b0d98af3ad"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Generate a random hexadecimal token of given length
function generateToken(length) {
  const charset = '0123456789abcdef';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset[randomIndex];
  }
  return token;
}

document.getElementById('submittt').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('inputEmailOrUserID').value;
  const password = document.getElementById('passwordEntry').value;
  const username = document.getElementById('username').value;
  const profilePic = document.getElementById('profilePic').files[0]; // Assuming profile picture input

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profilePicURL = '';
    if (profilePic) {
      profilePicURL = await uploadProfilePic(profilePic);
    }

    // Set user details
    await set(ref(database, 'users/' + user.uid), {
      username: username,
      email: email,
      profile_pic: profilePicURL
    });

    // Create a default submission with current date and default weight of 50
    const defaultSubmissionRef = ref(database, `users/${user.uid}/submissions`);
    const newSubmission = {
      weigh_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      weight: 50 // Default weight value
    };

    // Push new submission
    await push(defaultSubmissionRef, newSubmission);

    // Generate token
    const token = generateToken(250);

    // Redirect with token
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;

  } catch (error) {
    console.error('Error creating user or adding default submission:', error.message);
    alert('Error: ' + error.message);
  }
});

document.getElementById('login-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('inputEmailOrUser').value;
  const password = document.getElementById('passwordEntrylogin').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const date = new Date();
    await update(ref(database, 'users/' + user.uid), {
      last_login: date
    });

    // Retrieve user data to check if it exists
    const userSnapshot = await get(ref(database, 'users/' + user.uid));
    if (userSnapshot.exists()) {
      console.log('User Data:', userSnapshot.val());
    } else {
      console.log('User data not found for UID:', user.uid);
    }

    // Generate token
    const token = generateToken(250);

    // Redirect with token
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;
  } catch (error) {
    console.error('Error logging in:', error.message);
    alert('Error: ' + error.message);
  }
});

// Function to handle Google Sign-In for multiple buttons
const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists
    const userRef = ref(database, 'users/' + user.uid);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      // New user, set default data
      await set(userRef, {
        username: user.displayName,
        email: user.email,
        profile_pic: user.photoURL || ''
      });

      // Create a default submission with current date and default weight of 50
      const defaultSubmissionRef = ref(database, `users/${user.uid}/submissions`);
      const newSubmission = {
        weigh_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        weight: 50 // Default weight value
      };

      // Push new submission
      await push(defaultSubmissionRef, newSubmission);
    } else {
      // Existing user, update profile picture if not already set
      const userData = userSnapshot.val();
      if (user.photoURL && (!userData.profile_pic || userData.profile_pic !== user.photoURL)) {
        await update(userRef, { profile_pic: user.photoURL });
      }
    }

    // Generate token
    const token = generateToken(250);

    // Redirect with token
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;
  } catch (error) {
    console.error('Error with Google Sign-In:', error.message);
    alert('Error: ' + error.message);
  }
};

// Add event listeners to Google Sign-In buttons
document.getElementById('googleid1').addEventListener('click', handleGoogleSignIn);
document.getElementById('googleid2').addEventListener('click', handleGoogleSignIn);

// Function to upload profile picture to Firebase Storage
async function uploadProfilePic(file) {
  const storageReference = storageRef(storage, 'profilePics/' + file.name);
  await uploadBytes(storageReference, file);
  return await getDownloadURL(storageReference);
}
