// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
// import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-functions.js'; // Import functions
// import firebase from 'firebase/app';
// import './firebase/functions';/

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
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app); // Initialize Firebase Functions

// DOM Elements
const courseForm = document.getElementById('course-form');
const courseNameInput = document.getElementById('course-name');
const courseDescriptionInput = document.getElementById('course-description');
const courseImgInput = document.getElementById('course-img');
const courseImgPreview = document.getElementById('course-img-preview');
const videoFieldsContainer = document.getElementById('video-fields');
const addVideoButton = document.getElementById('add-video');
const courseList = document.getElementById('course-list');

// Handle Authentication
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;
    console.log(`User Email: ${userEmail}`);

    const userDocRef = doc(db, 'users', user.uid); // Assuming roles are stored in the 'users' collection
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userRole = userData.role; // Assuming 'role' field exists in the document
      console.log(`User Role: ${userRole}`);

      // Check if the user is an admin
      if (userRole === 'admin') {
        console.log('Admin logged in.');
        // Add admin-specific functionalities here
      } else {
        console.log('User is not an admin.');
        // Handle non-admin users
      }
    } else {
      console.error('No user document found.');
    }
  } else {
    console.log('No user is signed in.');
  }
});

// Add Video Fields
let videoIndex = 1;
addVideoButton.addEventListener('click', () => {
  const videoFieldHTML = `
    <div class="video-field">
      <label for="video-file-${videoIndex}">Video File:</label>
      <input type="file" id="video-file-${videoIndex}" class="video-file" accept="video/*" required>
      <label for="video-thumb-${videoIndex}">Video Thumbnail:</label>
      <input type="file" id="video-thumb-${videoIndex}" class="video-thumb" accept="image/*">
      <input type="text" id="video-name-${videoIndex}" class="video-name" placeholder="Video Name" required>
    </div>
  `;
  videoFieldsContainer.insertAdjacentHTML('beforeend', videoFieldHTML);
  videoIndex++;
});

// Preview Image
courseImgInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      courseImgPreview.src = event.target.result;
      courseImgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    courseImgPreview.style.display = 'none';
  }
});

courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const courseId = courseForm.getAttribute('data-edit-id');
  const courseName = courseNameInput.value;
  const courseDescription = courseDescriptionInput.value;
  const courseImgFile = courseImgInput.files[0];

  try {
    // Upload course image
    let courseImgUrl = '';
    if (courseImgFile) {
      const imgRef = ref(storage, `course-images/${courseImgFile.name}`);
      await uploadBytes(imgRef, courseImgFile);
      courseImgUrl = await getDownloadURL(imgRef);
    }

    // Prepare course data
    const courseData = {
      name: courseName,
      description: courseDescription,
      image: courseImgUrl || courseImgPreview.src,
      videos: [] // Initialize videos array
    };

    // Handle video uploads
    const videoFiles = document.querySelectorAll('.video-file');
    const videoThumbs = document.querySelectorAll('.video-thumb');
    const videoNames = document.querySelectorAll('.video-name');

    for (let i = 0; i < videoFiles.length; i++) {
      const videoFile = videoFiles[i].files[0];
      const videoThumbFile = videoThumbs[i].files[0];
      const videoName = videoNames[i].value;

      if (videoFile) {
        // Upload video file
        const videoRef = ref(storage, `course-videos/${videoFile.name}`);
        await uploadBytes(videoRef, videoFile);
        const videoUrl = await getDownloadURL(videoRef);

        // Upload video thumbnail if available
        let videoThumbUrl = '';
        if (videoThumbFile) {
          const thumbRef = ref(storage, `course-thumbnails/${videoThumbFile.name}`);
          await uploadBytes(thumbRef, videoThumbFile);
          videoThumbUrl = await getDownloadURL(thumbRef);
        }

        // Add video data to courseData
        courseData.videos.push({
          name: videoName,
          url: videoUrl,
          thumbnail: videoThumbUrl || '' // Use default value if no thumbnail
        });
      }
    }

    // Save course data
    if (courseId) {
      const courseDocRef = doc(db, 'courses', courseId);
      await updateDoc(courseDocRef, courseData);
      alert('Course updated successfully!');
    } else {
      await addDoc(collection(db, 'courses'), courseData);
      alert('Course added successfully!');
    }

    courseForm.reset();
    courseImgPreview.style.display = 'none'; // Hide the preview
    courseForm.removeAttribute('data-edit-id');
    loadCourses(); // Refresh course list

  } catch (error) {
    console.error('Error:', error);
    alert('Error processing course. Please try again.');
  }
});

// Load Courses
async function loadCourses() {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    courseList.innerHTML = ''; // Clear existing list
    coursesSnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${data.image}" alt="Course Image" style="max-width: 100px;">
        <h4>${data.name}</h4>
        <p>${data.description}</p>
        <button data-id="${doc.id}" class="edit-btn">Edit</button>
        <button data-id="${doc.id}" class="delete-btn">Delete</button>
      `;
      courseList.appendChild(listItem);
    });
    setupEditDeleteButtons();
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Complete the delete button functionality
function setupEditDeleteButtons() {
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const courseId = e.target.getAttribute('data-id');
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          courseNameInput.value = courseData.name;
          courseDescriptionInput.value = courseData.description;
          courseImgPreview.src = courseData.image;
          courseImgPreview.style.display = 'block';
          courseForm.setAttribute('data-edit-id', courseId);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const courseId = e.target.getAttribute('data-id');
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        await deleteDoc(courseDocRef);
        alert('Course deleted successfully!');
        loadCourses(); // Refresh course list
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    });
  });
}

// Initial Load of Courses
loadCourses();
// Email Notification Functionality
const emailForm = document.getElementById('emailForm');
const recipientEmailInput = document.getElementById('recipientEmail');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Make an API call to your server to send an email using SendGrid
  fetch('/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientEmail: recipientEmailInput.value,
      subject: subjectInput.value,
      message: messageInput.value
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to send email');
    }
  })
  .then(data => {
    console.log('Email sent successfully:', data);
    alert('Email sent successfully!');
  })
  .catch(error => {
    console.error('Error sending email:', error);
    alert('Error sending email. Please try again.');
  });
});
