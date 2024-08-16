// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Reference to the loader element
const loader = document.getElementById('loader');

// Show the loader
function showLoader() {
  loader.style.display = 'block';
}

// Hide the loader
function hideLoader() {
  loader.style.display = 'none';
}

// Load available courses
async function loadAvailableCourses() {
  showLoader(); // Show the loader
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; // Clear existing content

    coursesSnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement('li');
      listItem.classList.add('course-item');
      listItem.innerHTML = `
        <img class='course-item-img' src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
        <h1>${data.name}</h1>
        <div class='course-info'>
          <span><i class="fa-solid fa-book-open"></i> 20 Classes</span>
          <span><i class="fa-solid fa-user"></i> 400 Students</span>
        </div>
        <span class='line'></span>
        <div class='instructor-info'>
          <h5>Free</h5>
          <span><img src="./image/istockphoto-640933526-612x612.jpg" alt="Instructor"> Jhon Smith</span>
        </div>
      `;
      courseList.appendChild(listItem);

      listItem.addEventListener('click', () => {
        window.location.href = `course-detail.html?id=${doc.id}`;
      });
    });

    // Display message if no courses found
    if (courseList.children.length === 0) {
      courseList.innerHTML = '<p>No courses found.</p>';
    }
  } catch (error) {
    console.error('Error loading available courses:', error);
  } finally {
    hideLoader(); // Hide the loader
  }
}

// Load enrolled courses
async function loadEnrolledCourses(userId) {
  showLoader(); // Show the loader
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const enrolledCourses = userDoc.data().enrolledCourses || [];
      const enrolledCoursesContainer = document.getElementById('enrolled-courses');
      enrolledCoursesContainer.innerHTML = ''; // Clear existing content

      for (const courseId of enrolledCourses) {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(courseDocRef);
        if (courseDoc.exists()) {
          const data = courseDoc.data();
          const courseItem = document.createElement('div');
          courseItem.classList.add('course-item');
          courseItem.innerHTML = `
            <img class='course-item-img' src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
            <h1>${data.name}</h1>
            <div class='course-info'>
              <span><i class="fa-solid fa-book-open"></i> 20 Classes</span>
              <span><i class="fa-solid fa-user"></i> 400 Students</span>
            </div>
            <span class='line'></span>
            <div class='instructor-info'>
              <h5>Free</h5>
              <span><img src="./image/istockphoto-640933526-612x612.jpg" alt="Instructor"> Jhon Smith</span>
            </div>
          `;
          enrolledCoursesContainer.appendChild(courseItem);

          courseItem.addEventListener('click', () => {
            window.location.href = `learning.html?id=${courseDoc.id}`;
          });
        }
      }

      // Display message if no enrolled courses found
      if (enrolledCoursesContainer.children.length === 0) {
        enrolledCoursesContainer.innerHTML = '<p>You have not enrolled in any courses yet.</p>';
      }
    } else {
      console.error('User document not found.');
    }
  } catch (error) {
    console.error('Error loading enrolled courses:', error);
  } finally {
    hideLoader(); // Hide the loader
  }
}

// Handle user authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        // Display user's initials
        const initials = userData.firstName.charAt(0).toUpperCase();
        document.getElementById('user-initials').textContent = initials;
        // Update UI with user data
        document.getElementById('user-name-display').textContent = userData.firstName + ' ' + userData.lastName;
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    // Load user-specific data
    loadAvailableCourses();
    loadEnrolledCourses(user.uid);
  } else {
    window.location.href = 'login.html';
  }
});

// Handle dropdown profile button click
document.getElementById('profile-button').addEventListener('click', () => {
  window.location.href = 'profile.html';
});

// Handle search input
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const courseItems = document.querySelectorAll('.course-item');
  let found = false;
  courseItems.forEach((item) => {
    const courseName = item.querySelector('h1').textContent.toLowerCase();
    if (courseName.includes(query)) {
      item.style.display = 'block';
      found = true;
    } else {
      item.style.display = 'none';
    }
  });

  // Show message if no course matches the search query
  if (!found) {
    document.getElementById('course-list').innerHTML = '<p>No courses match your search.</p>';
  }
});

// Handle category filter
const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', (event) => {
  const category = event.target.value;
  const courseItems = document.querySelectorAll('.course-item');
  let found = false;
  courseItems.forEach((item) => {
    const courseCategory = item.dataset.category; // Assuming you add a data-category attribute to each course item
    if (category === '' || courseCategory === category) {
      item.style.display = 'block';
      found = true;
    } else {
      item.style.display = 'none';
    }
  });

  // Show message if no course matches the category filter
  if (!found) {
    document.getElementById('course-list').innerHTML = '<p>No courses match this category.</p>';
  }
});

// Handle notification icon click
const notificationIcon = document.getElementById('notification-icon');
notificationIcon.addEventListener('click', () => {
  alert('No new notifications.');
});

// Handle logout button click
document.getElementById('logout-button').addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
});
// Toggle dropdown visibility when initials are clicked
const userInitials = document.getElementById('user-initials');
const dropdown = document.querySelector('.dropdown');

userInitials.addEventListener('click', () => {
  dropdown.classList.toggle('dropdownToggler');
});

// Close the dropdown if clicked outside
document.addEventListener('click', (event) => {
  if (!userInitials.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove('dropdownToggler');
  }
});
