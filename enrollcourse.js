import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const enrolledCoursesList = document.getElementById('enrolled-courses');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const enrolledCourses = userDoc.data().enrolledCourses || [];
        
        for (const courseId of enrolledCourses) {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            const courseItem = document.createElement('div');
            courseItem.innerHTML = `
              <img src="${courseData.image}" alt="${courseData.name}" style="width:100px;height:100px;">
              <h3>${courseData.name}</h3>
              <p>${courseData.description}</p>
            `;
            enrolledCoursesList.appendChild(courseItem);
          }
        }
      }
    } else {
      // Optionally, you can redirect to login or registration if not authenticated
      window.location.href = 'register.html';
    }
  });
});
