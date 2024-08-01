document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
    authDomain: "panel-481bd.firebaseapp.com",
    projectId: "panel-481bd",
    storageBucket: "panel-481bd.appspot.com",
    messagingSenderId: "529328619298",
    appId: "1:529328619298:web:248714d17f4d19b489af7b"
  };
  
  // Initialize Firebase only if it hasn't been initialized yet
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const role = userDoc.data().role;
          if (role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'user.html';
          }
        } else {
          console.error('No such user document!');
          window.location.href = 'index.html'; // Redirect to home if no user document is found
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        window.location.href = 'index.html'; // Redirect to home on error
      }
    } else {
      document.body.style.visibility = 'visible'; // Show content if not authenticated
    }
  });

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signup successful:', userCredential.user.uid);
        const role = email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';
        await setDoc(doc(db, 'users', userCredential.user.uid), { role });
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        alert('Signup successful. Please log in.');
      } catch (error) {
        console.error('Signup error:', error);
        alert('Error during signup: ' + error.message);
      }
    });
    
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;

      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const userDoc = await db.collection('users').doc(cred.user.uid).get();
        if (userDoc.exists) {
          const role = userDoc.data().role;
          if (role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'user.html';
          }
        } else {
          console.error('No such user document!');
          alert('No such user document!');
        }
      } catch (err) {
        console.error('Error during login:', err);
        alert('Error during login: ' + err.message);
      }
    });
  }
});
