// Import Firebase modules
import { getAuth, sendPasswordResetEmail, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbJxbCxOnHSOBFzapebKOvLaPPlNidk38",
  authDomain: "e-learning-686ec.firebaseapp.com",
  projectId: "e-learning-686ec",
  storageBucket: "e-learning-686ec.appspot.com",
  messagingSenderId: "382965941769",
  appId: "1:382965941769:web:27e461560b9af27fa15ad8"
};// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

let isRegistering = false;

// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-password');
  
  togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type');
      if (type === 'password') {
          passwordInput.setAttribute('type', 'text');
          togglePassword.classList.remove('fa-eye');
          togglePassword.classList.add('fa-eye-slash');
      } else {
          passwordInput.setAttribute('type', 'password');
          togglePassword.classList.remove('fa-eye-slash');
          togglePassword.classList.add('fa-eye');
      }
  });
});

// Handle forgot password
document.getElementById('forgot-password').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  if (email) {
      try {
          await sendPasswordResetEmail(auth, email);
          alert('Password reset email sent!');
      } catch (error) {
          console.error('Error:', error.code, error.message);
          alert('Error sending password reset email. Please try again.');
      }
  } else {
      alert('Please enter your email address.');
  }
});

// Define loading functions
function showLoading() {
  const loadingIndicator = document.getElementById('loading');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }
}

function hideLoading() {
  const loadingIndicator = document.getElementById('loading');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
}

// Handle user redirection
async function handleUserRedirection(user) {
  try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          const role = userDoc.data().role;
          const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
          window.location.replace(redirectUrl);
      } else {
          isRegistering = true;
          // Handle non-existent user scenario (e.g., redirect to registration)
          window.location.replace('register.html');
      }
  } catch (error) {
      console.error('Error checking user document:', error);
      alert('An error occurred while checking user registration. Please try again.');
  } finally {
      hideLoading();
  }
}

// Auth state change listener
onAuthStateChanged(auth, (user) => {
  if (user && !isRegistering) {
      handleUserRedirection(user);
  } else {
      hideLoading();
  }
});

// Handle login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showLoading();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      window.location.replace(redirectUrl);
    } else {
      console.error('No user document found');
      alert('No user document found');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Error during login: ' + error.message);
    window.location.href = 'register.html';
  } finally {
    hideLoading();
  }
});

// Handle Google login
document.getElementById('google-login').addEventListener('click', async (e) => {
  e.preventDefault();
  showLoading();

  const provider = new GoogleAuthProvider();
  try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
          handleUserRedirection(user);
      }
  } catch (error) {
      console.error('Google login error:', error);
      alert('Error during Google login: ' + error.message);
  } finally {
      hideLoading();
  }
});

// Handle Facebook login
document.getElementById('facebook-login').addEventListener('click', async (e) => {
  e.preventDefault();
  showLoading();

  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      window.location.replace(redirectUrl);
    } else {
      console.error('No user document found');
      isRegistering = true;
      alert('User does not exist, redirecting to registration...');
      window.location.href = 'register.html';
    }
  } catch (error) {
    console.error('Facebook login error:', error);
    alert('Error during Facebook login: ' + error.message);
  } finally {
    hideLoading();
  }
});
