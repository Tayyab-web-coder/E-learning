// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js';
// Firebase configuration
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

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };
