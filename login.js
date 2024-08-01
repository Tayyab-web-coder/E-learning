import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Login successful.');
    window.location.href = 'home.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Error during login: ' + error.message);
  }
});

document.getElementById('google-login').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert('Logged in with Google.');
    window.location.href = 'home.html';
  } catch (error) {
    console.error('Google login error:', error);
    alert('Error during Google login: ' + error.message);
  }
});

document.getElementById('facebook-login').addEventListener('click', async () => {
  const provider = new FacebookAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert('Logged in with Facebook.');
    window.location.href = 'home.html';
  } catch (error) {
    console.error('Facebook login error:', error);
    alert('Error during Facebook login: ' + error.message);
  }
});
