import { getAuth, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
const firebaseConfig = {
    apiKey: "AIzaSyCbJxbCxOnHSOBFzapebKOvLaPPlNidk38",
    authDomain: "e-learning-686ec.firebaseapp.com",
    projectId: "e-learning-686ec",
    storageBucket: "e-learning-686ec.appspot.com",
    messagingSenderId: "382965941769",
    appId: "1:382965941769:web:27e461560b9af27fa15ad8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to update the display name and save profile data to Firestore
async function updateUserProfile(user, profileData) {
  try {
    await updateProfile(user, { displayName: profileData.displayName });
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, profileData, { merge: true });
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile.');
  }
}

// Load user profile from Firestore or localStorage
async function loadUserProfile(user) {
  const userDoc = doc(db, 'users', user.uid);
  const userProfileSnap = await getDoc(userDoc);

  if (userProfileSnap.exists()) {
    const profileData = userProfileSnap.data();
    document.getElementById('display-name').value = profileData.displayName || '';
    document.getElementById('email').value = profileData.email || '';
    document.getElementById('phone').value = profileData.phone || '';
    document.getElementById('bio').value = profileData.bio || '';
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  } else {
    const localProfile = localStorage.getItem('userProfile');
    if (localProfile) {
      const profileData = JSON.parse(localProfile);
      document.getElementById('display-name').value = profileData.displayName || '';
      document.getElementById('email').value = profileData.email || '';
      document.getElementById('phone').value = profileData.phone || '';
      document.getElementById('bio').value = profileData.bio || '';
    }
  }
}

// Event listener for form submission
document.getElementById('profile-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission
  const profileData = {
    displayName: document.getElementById('display-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    bio: document.getElementById('bio').value,
  };

  if (auth.currentUser) {
    updateUserProfile(auth.currentUser, profileData);
  } else {
    console.error('No user is signed in.');
    alert('No user is signed in.');
  }
});

// Handle authentication state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile(user);
  } else {
    window.location.href = 'login.html'; // Redirect to login if not signed in
  }
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = 'login.html'; // Redirect to login on logout
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
});
