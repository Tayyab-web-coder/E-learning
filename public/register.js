import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Registration successful.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error during registration: ' + error.message);
  }
});
