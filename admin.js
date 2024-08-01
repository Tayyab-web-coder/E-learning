import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
    authDomain: "panel-481bd.firebaseapp.com",
    projectId: "panel-481bd",
    storageBucket: "panel-481bd.appspot.com",
    messagingSenderId: "529328619298",
    appId: "1:529328619298:web:248714d17f4d19b489af7b"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const fileList = document.getElementById('file-list');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const logoutButton = document.getElementById('logout-button'); // Correctly reference the logout button

  // Check if the user is an admin
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        alert('You do not have permission to access this page.');
        window.location.href = 'index.html';
      }
    } else {
      alert('You need to log in to access this page.');
      window.location.href = 'index.html';
    }
  });

  // Handle file upload
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('file').files[0];
    const description = document.getElementById('file-description').value;

    if (file) {
      const storageRef = ref(storage, 'files/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressText.innerHTML = progress.toFixed(0) + '%';
          progressBar.children[0].style.width = progress.toFixed(0) + '%';
        }, 
        (error) => {
          console.error('Upload failed:', error);
          alert('Upload failed: ' + error.message);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const fileData = {
              name: file.name,
              description,
              url: downloadURL,
              createdAt: new Date()
            };
            setDoc(doc(db, 'files', file.name), fileData).then(() => {
              alert('File uploaded successfully.');
              loadFiles();
            }).catch((error) => {
              console.error('Error storing file data:', error);
              alert('Error storing file data: ' + error.message);
            });
          });
        }
      );
    } else {
      alert('Please select a file to upload.');
    }
  });

  // Load and display files
  const loadFiles = async () => {
    fileList.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'files'));
    querySnapshot.forEach((doc) => {
      const file = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `<a href="${file.url}" target="_blank">${file.name}</a> - ${file.description} <button onclick="deleteFile('${file.name}')">Delete</button>`;
      fileList.appendChild(li);
    });
  };

  loadFiles();

  // Handle file deletion
  window.deleteFile = async (fileName) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        const fileRef = ref(storage, 'files/' + fileName);
        await deleteObject(fileRef);
        await deleteDoc(doc(db, 'files', fileName));
        alert('File deleted successfully.');
        loadFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting file: ' + error.message);
      }
    }
  };

  // Handle logout
  logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('Logged out successfully.');
      window.location.href = 'index.html';
    }).catch((error) => {
      console.error('Error logging out:', error);
      alert('Error logging out: ' + error.message);
    });
  });
});
