import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCbJxbCxOnHSOBFzapebKOvLaPPlNidk38",
  authDomain: "e-learning-686ec.firebaseapp.com",
  projectId: "e-learning-686ec",
  storageBucket: "e-learning-686ec.appspot.com",
  messagingSenderId: "382965941769",
  appId: "1:382965941769:web:27e461560b9af27fa15ad8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const courseList = document.getElementById('course-list');

  // Load and display courses
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement('li');
      listItem.classList.add('course-item');
      listItem.classList.add('tilt')
      listItem.innerHTML = `
        <img class='course-item-img'  src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
        <h1>${data.name}</h1>
        <div class='course-info'>
        <span><i class="fa-solid fa-book-open"></i> 20 Classes</span>
        <span><i class="fa-solid fa-user"></i> 400 Students </span>
        </div>
        <span class='line'></span>
        <div class='instructor-info'>
        <h5>Free</h5>
        <span><img src=./image/istockphoto-640933526-612x612.jpg> Jhon Smith</span>
        </div>
      `;
      courseList.appendChild(listItem);

      listItem.addEventListener('click', () => {
        window.location.href = `course-detail.html?id=${doc.id}`;
      });
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  // Auth State Check and Redirection Logic
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in:', user.email);
      window.location.href = 'user.html';
    } else {
      console.log('No user is logged in.');

    }
  });
});

