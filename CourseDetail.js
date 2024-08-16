import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');

  if (courseId) {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        document.getElementById('course-img').src = courseData.image;
        document.getElementById('course-name').textContent = courseData.name;
        document.getElementById('course-description').textContent = courseData.description;
      } else {
        console.log('Course not found.');
      }
    } catch (error) {
      console.error('Error getting course:', error);
    }
  }

  const enrollButton = document.getElementById('enroll-button');
  enrollButton.addEventListener('click', async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is authenticated, proceed to enroll
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          enrolledCourses: arrayUnion(courseId)
        });
        alert('You have successfully enrolled in the course!');
        
        // Redirect with the courseId in the URL
        window.location.href = `courseplay.html?id=${courseId}`; // Redirect to the enrolled courses page
      } else {
        // Store the course ID in sessionStorage before redirecting to the register page
        sessionStorage.setItem('pendingCourseId', courseId);
        window.location.href = 'register.html';
      }
    });
  });
  
});
