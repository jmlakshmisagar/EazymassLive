import { database, auth, storage } from './firebaseConfig.js';
import { set, ref, update, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


function generateToken(length) {
  const charset = '0123456789abcdef';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset[randomIndex];
  }
  return token;
}

async function handleLogin() {
  const storedUid = localStorage.getItem('uid');
  if (storedUid) {
    try {
      const userSnapshot = await get(ref(database, 'users/' + storedUid));
      if (userSnapshot.exists()) {
        const token = generateToken(120);
        window.location.href = `dashboard.html?token=${token}&uid=${storedUid}&token=${token}`;
      } else {
        localStorage.removeItem('uid'); // Remove invalid UID
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  }
}

document.getElementById('submittt').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('inputEmailOrUserID').value;
  const password = document.getElementById('passwordEntry').value;
  const username = document.getElementById('username').value;
  const profilePic = document.getElementById('profilePic').files[0];

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profilePicURL = '';
    if (profilePic) {
      profilePicURL = await uploadProfilePic(profilePic);
    }

    await set(ref(database, 'users/' + user.uid), {
      username: username,
      email: email,
      profile_pic: profilePicURL
    });

    const defaultSubmissionRef = ref(database, `users/${user.uid}/submissions`);
    const newSubmission = {
      weigh_date: new Date().toISOString().split('T')[0],
      weight: 50
    };

    await push(defaultSubmissionRef, newSubmission);

    localStorage.setItem('uid', user.uid); // Store UID in localStorage
    const token = generateToken(250);
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;

  } catch (error) {
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

    localStorage.setItem('uid', user.uid); // Store UID in localStorage
    const token = generateToken(250);
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = ref(database, 'users/' + user.uid);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists()) {
      await set(userRef, {
        username: user.displayName,
        email: user.email,
        profile_pic: user.photoURL || ''
      });

      const defaultSubmissionRef = ref(database, `users/${user.uid}/submissions`);
      const newSubmission = {
        weigh_date: new Date().toISOString().split('T')[0],
        weight: 50
      };

      await push(defaultSubmissionRef, newSubmission);
    } else {
      const userData = userSnapshot.val();
      if (user.photoURL && (!userData.profile_pic || userData.profile_pic !== user.photoURL)) {
        await update(userRef, { profile_pic: user.photoURL });
      }
    }

    localStorage.setItem('uid', user.uid); // Store UID in localStorage
    const token = generateToken(250);
    window.location.href = `dashboard.html?token=${token}&uid=${user.uid}`;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

document.getElementById('googleid1').addEventListener('click', handleGoogleSignIn);
document.getElementById('googleid2').addEventListener('click', handleGoogleSignIn);

async function uploadProfilePic(file) {
  const storageReference = storageRef(storage, 'profilePics/' + file.name);
  await uploadBytes(storageReference, file);
  return await getDownloadURL(storageReference);
}

// Check localStorage for UID on page load
document.addEventListener('DOMContentLoaded', handleLogin);

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
