import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
  authDomain: "panel-481bd.firebaseapp.com",
  projectId: "panel-481bd",
  storageBucket: "panel-481bd.appspot.com",
  messagingSenderId: "529328619298",
  appId: "1:529328619298:web:248714d17f4d19b489af7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
