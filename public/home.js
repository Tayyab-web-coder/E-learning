// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
// import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';
// import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// const firebaseConfig = {
//   apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
//   authDomain: "panel-481bd.firebaseapp.com",
//   projectId: "panel-481bd",
//   storageBucket: "panel-481bd.appspot.com",
//   messagingSenderId: "529328619298",
//   appId: "1:529328619298:web:248714d17f4d19b489af7b"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// document.addEventListener('DOMContentLoaded', () => {
//   const signupForm = document.getElementById('signup-form');
//   const loginForm = document.getElementById('login-form');

//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       try {
//         const userDoc = await getDoc(doc(db, 'users', user.uid));
//         if (userDoc.exists()) {
//           const role = userDoc.data().role;
//           const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
//           if (window.location.pathname !== `/${redirectUrl}`) {
//             window.location.href = redirectUrl;
//           }
//         } else {
//           console.error('No user document found');
//           if (window.location.pathname !== '/index.html') {
//             window.location.href = 'index.html';
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//         if (window.location.pathname !== '/index.html') {
//           window.location.href = 'index.html';
//         }
//       }
//     } else {
//       document.body.style.visibility = 'visible';
//     }
//   });

//   signupForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('signup-email').value;
//     const password = document.getElementById('signup-password').value;
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const role = email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';
//       await setDoc(doc(db, 'users', userCredential.user.uid), { role, email });
//       document.getElementById('signup-email').value = '';
//       document.getElementById('signup-password').value = '';
//       alert('Signup successful. Please log in.');
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert('Error during signup: ' + error.message);
//     }
//   });

//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
//       if (userDoc.exists()) {
//         const role = userDoc.data().role;
//         const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
//         if (window.location.pathname !== `/${redirectUrl}`) {
//           window.location.href = redirectUrl;
//         }
//       } else {
//         console.error('No user document found');
//         alert('No user document found');
//       }
//       document.getElementById('login-email').value = '';
//       document.getElementById('login-password').value = '';
//     } catch (error) {
//       console.error('Login error:', error);
//       alert('Error during login: ' + error.message);
//     }
//   });
// });
