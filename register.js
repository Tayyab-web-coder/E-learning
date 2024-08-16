import { auth, db } from './firebaseConfig.js'; // Adjust this path according to your file structure
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('register-form');
  const passwordInput = document.getElementById('register-password');
  const strengthBar = document.getElementById('strength-bar').children;
  const messagebox = document.querySelector('.messagebox');
  const message = document.querySelector('.message');
  const warnIcon = document.querySelector('.fa-exclamation');
  const strengthIcon = document.querySelector('.strength-icon');

  // Password strength checker
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    let strength = 0;

    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Update strength bar and message
    Array.from(strengthBar).forEach((div, index) => {
      if (index < strength) {
        div.classList.add('strong');
        div.classList.remove('weak', 'moderate');
      } else {
        div.classList.remove('strong', 'weak', 'moderate');
        if (index === 0 && strength === 1) div.classList.add('weak');
        if (index === 1 && strength === 2) div.classList.add('moderate');
      }
    });

    // Update message box
    if (password.length === 0) {
      messagebox.style.visibility = 'hidden';
    } else {
      if (password.length >= 3) {
        message.innerHTML = 'Password must be at least 8 characters';
        messagebox.style.visibility = 'visible';
        messagebox.style.color = 'red';
        warnIcon.style.border = '2px solid red';
      }
      if (password.length >= 8) {
        message.innerHTML = 'Password is moderate';
        messagebox.style.visibility = 'visible';
        messagebox.style.color = 'black';
        warnIcon.style.border = '2px solid black';
      }
      if (password.length >= 10) {
        message.innerHTML = 'Password is strong';
        messagebox.style.visibility = 'visible';
        messagebox.style.color = 'black';
        warnIcon.style.border = '2px solid black';
      }
    }

    // Toggle strength icon
    if (strength > 0) {
      strengthIcon.classList.remove('fa-eye-slash');
      strengthIcon.classList.add('fa-eye');
    } else {
      strengthIcon.classList.add('fa-eye-slash');
      strengthIcon.classList.remove('fa-eye');
    }
  });

  // Toggle password visibility
  strengthIcon.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      strengthIcon.classList.remove('fa-eye-slash');
      strengthIcon.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      strengthIcon.classList.remove('fa-eye');
      strengthIcon.classList.add('fa-eye-slash');
    }
  });

  // Handle form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = passwordInput.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const role = email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';

      await setDoc(doc(db, 'users', userId), { role, email, firstName, lastName });

      if (role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'login.html';
      }

      alert('Signup successful. Please log in.');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error during signup: ' + error.message);
    }
  });

  // Handle authentication state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'user.html';
          }
        } else {
          console.log('No such user document');
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
      }

      const pendingCourseId = sessionStorage.getItem('pendingCourseId');
      if (pendingCourseId) {
        window.location.href = `courseplay.html?id=${pendingCourseId}`;
        sessionStorage.removeItem('pendingCourseId');
      } else {
        window.location.href = 'user.html';
      }
    }
  });
});
