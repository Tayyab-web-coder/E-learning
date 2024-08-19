// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
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
// const functions = getFunctions(app); // Initialize Firebase Functions

// DOM Elements
const courseForm = document.getElementById('course-form');
const courseNameInput = document.getElementById('course-name');
const courseDescriptionInput = document.getElementById('course-description');
const courseImgInput = document.getElementById('course-img');
const courseImgPreview = document.getElementById('course-img-preview');
const videoFieldsContainer = document.getElementById('video-fields');
const addVideoButton = document.getElementById('add-video');
const courseList = document.getElementById('course-list');
// const logoutButton = document.getElementById('logout-btn'); // Logout button

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
      listItem.classList.add('tilt')
      listItem.innerHTML = `
        <img src="${data.image}" alt="Course Image" style="max-width: 100px;">
        <h4>${data.name}</h4>
        <p>${data.description}</p>
        <button data-id="${doc.id}" class="edit-course">Edit</button>
        <button data-id="${doc.id}" class="delete-course">Delete</button>
      `;
      courseList.appendChild(listItem);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-course').forEach(button => {
      button.addEventListener('click', (e) => {
        const courseId = e.target.getAttribute('data-id');
        loadCourseForEditing(courseId);
      });
    });

    document.querySelectorAll('.delete-course').forEach(button => {
      button.addEventListener('click', async (e) => {
        const courseId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this course?')) {
          await deleteDoc(doc(db, 'courses', courseId));
          loadCourses(); // Refresh course list
        }
      });
    });

  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Load Course for Editing
async function loadCourseForEditing(courseId) {
  try {
    const courseDocRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseDocRef);
    const data = courseDoc.data();

    courseNameInput.value = data.name;
    courseDescriptionInput.value = data.description;
    if (data.image) {
      courseImgPreview.src = data.image;
      courseImgPreview.style.display = 'block';
    }
    // Clear existing video fields and add new ones
    videoFieldsContainer.innerHTML = '';
    data.videos.forEach((video, index) => {
      const videoFieldHTML = `
        <div class="video-field">
          <label for="video-file-${index}">Video File:</label>
          <input type="file" id="video-file-${index}" class="video-file" accept="video/*">
          <label for="video-thumb-${index}">Video Thumbnail:</label>
          <input type="file" id="video-thumb-${index}" class="video-thumb" accept="image/*">
          <input type="text" id="video-name-${index}" class="video-name" value="${video.name}" placeholder="Video Name">
        </div>
      `;
      videoFieldsContainer.insertAdjacentHTML('beforeend', videoFieldHTML);
      // Set thumbnail preview if available
      if (video.thumbnail) {
        const thumbInput = document.getElementById(`video-thumb-${index}`);
        const thumbPreview = document.createElement('img');
        thumbPreview.src = video.thumbnail;
        thumbPreview.style.maxWidth = '100px';
        thumbInput.parentElement.appendChild(thumbPreview);
      }
    });
    // Set course ID for editing
    courseForm.setAttribute('data-edit-id', courseId);

  } catch (error) {
    console.error('Error loading course for editing:', error);
  }
}
let logoutButton = document.getElementById('logout-button'); // Updated ID

// Logout Functionality
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('You have been logged out.');
    window.location.href = 'login.html'; // Redirect to login page
  } catch (error) {
    console.error('Error signing out:', error);
    alert('Error signing out. Please try again.');
  }
});

// Initial Load
loadCourses();


document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form data
  var userEmail = document.getElementById('user_email').value;
  var userName = document.getElementById('user_name').value;
  var message = document.getElementById('message').value;

  // Send email
  emailjs.send('service_bmihnmh', 'template_ui0hmhu', {
      user_email: userEmail,
      user_name: userName,
      message: message
  })
  .then(function(response) {
      alert('Email sent successfully!');
      // Clear the form
      document.getElementById('emailForm').reset();
  }, function(error) {
      alert('Failed to send email: ' + error.text);
  });
});