import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
const firebaseConfig = {
    apiKey: "AIzaSyCbJxbCxOnHSOBFzapebKOvLaPPlNidk38",
    authDomain: "e-learning-686ec.firebaseapp.com",
    projectId: "e-learning-686ec",
    storageBucket: "e-learning-686ec.appspot.com",
    messagingSenderId: "382965941769",
    appId: "1:382965941769:web:27e461560b9af27fa15ad8"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const displayCourses = async () => {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.classList.add('course-item');
            listItem.onclick = () => {
                window.location.href = `course-detail.html?id=${doc.id}`;
            };
            listItem.classList.add('tilt')
            listItem.innerHTML = `
          <img src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
          <span>${data.name}</span>
        `;
            courseList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    displayCourses();
});

