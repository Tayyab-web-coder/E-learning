import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    const startLearningButton = document.getElementById('start-learning-button');
    console.log('startLearningButton:', startLearningButton);

    if (!startLearningButton) {
        console.error('Element with ID "start-learning-button" not found.');
        return;
    }

    // Retrieve the course ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        try {
            // Fetch course data from Firestore
            const courseDoc = await getDoc(doc(db, 'courses', courseId));
            if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                const messageElement = document.getElementById('message');
                messageElement.textContent = `You have successfully enrolled in ${courseData.name}.`;
            } else {
                console.log('Course not found.');
                alert('Course not found.');
            }
        } catch (error) {
            console.error('Error retrieving course data:', error);
            alert('Error retrieving course data. Please try again later.');
        }

        startLearningButton.addEventListener('click', () => {
            console.log('Start Learning button clicked');
            window.location.href = `learning.html?id=${courseId}`;
        });
    } else {
        alert('Course ID not found.');
    }
});
