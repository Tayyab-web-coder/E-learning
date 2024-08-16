import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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
const auth = getAuth(app);
const storage = getStorage(app);

const courseId = new URLSearchParams(window.location.search).get('id');
// Global variables to track progress
let videosWatched = 0;
let totalVideos = 0;
let currentVideoIndex = null;
let progressInterval = null;

async function fetchAndDisplayCourse() {
    if (!courseId) {
        alert("Course ID is missing in the URL. Please select a valid course.");
        window.location.href = "/course.html";
        return;
    }

    try {
        const courseRef = doc(db, "courses", courseId);
        const docSnap = await getDoc(courseRef);

        if (docSnap.exists()) {
            const courseData = docSnap.data();

            // Fetch and display course name and image
            const courseNameElement = document.querySelector('.main-video .title');
            const courseImageElement = document.querySelector('.main-video .course-img');

            courseNameElement.textContent = courseData.name || 'Course Title';
            courseImageElement.src = courseData.image || "default-image.jpg";

            const videoListElement = document.querySelector('.video-playlist .videos');
            videoListElement.innerHTML = '';

            if (Array.isArray(courseData.videos)) {
                totalVideos = courseData.videos.length;
                courseData.videos.forEach((video, index) => {
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video');
                    videoElement.setAttribute('data-id', video.id);
                    videoElement.setAttribute('data-index', index);

                    // Display index, video thumbnail, and video name
                    videoElement.innerHTML = `
                        <p>${index + 1 > 9 ? index + 1 : '0' + (index + 1)}.</p>
                        <img src=${video.thumbnail || 'default-thumbnail.jpg'} alt="Video Thumbnail">
                        <h3 class="title">${video.name}</h3>
                    `;

                    // Check if the video was already watched (saved in localStorage)
                    const watchedStatus = localStorage.getItem(`video-watched-${courseId}-${index}`);
                    if (watchedStatus === 'true') {
                        videoElement.classList.add('watched');
                        videosWatched++;
                    }

                    videoElement.addEventListener('click', () => {
                        playVideo(video.url, index);
                    });

                    videoListElement.appendChild(videoElement);
                });

                // Update progress after loading videos
                updateCourseProgress();

                // Resume the last played video if available
                const lastPlayedIndex = localStorage.getItem(`last-played-video-${courseId}`);
                if (lastPlayedIndex !== null) {
                    playVideo(courseData.videos[lastPlayedIndex].url, parseInt(lastPlayedIndex));
                }
            }
        } else {
            alert("No course found. Please select a valid course.");
            window.location.href = "/course.html";
        }
    } catch (error) {
        console.error("Error fetching course data:", error);
    }
}

function playVideo(url, index) {
    const courseImageElement = document.querySelector('.main-video .course-img');
    const videoPlayer = document.querySelector('.main-video video');

    // Hide the course image and display the video player
    courseImageElement.style.display = 'none';
    videoPlayer.style.display = 'block';

    // Resume video from the last timestamp if available
    const savedTimestamp = localStorage.getItem(`video-timestamp-${courseId}-${index}`);
    if (savedTimestamp) {
        videoPlayer.currentTime = parseFloat(savedTimestamp);
    }

    videoPlayer.src = url;
    videoPlayer.play();

    // Highlight the current video in the playlist
    const previousActiveVideo = document.querySelector('.video.active');
    if (previousActiveVideo) {
        previousActiveVideo.classList.remove('active');
    }
    const currentVideoElement = document.querySelector(`.video[data-index="${index}"]`);
    currentVideoElement.classList.add('active');

    // Save the current video index
    currentVideoIndex = index;

    // Save the current playing video index to resume later
    localStorage.setItem(`last-played-video-${courseId}`, index);

    // Track video progress
    trackVideoProgress(videoPlayer, index);
}

function trackVideoProgress(videoPlayer, index) {
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    progressInterval = setInterval(() => {
        const currentTime = videoPlayer.currentTime;
        const duration = videoPlayer.duration;

        if (duration > 0) {
            const watchedPercentage = (currentTime / duration) * 100;
            if (watchedPercentage >= 60) {
                markVideoAsWatched(index);
                clearInterval(progressInterval);
            }
        }
    }, 1000);
}

function markVideoAsWatched(index) {
    const videos = document.querySelectorAll('.video');
    if (!videos[index].classList.contains('watched')) {
        videos[index].classList.add('watched');
        videosWatched++;
        localStorage.setItem(`video-watched-${courseId}-${index}`, 'true'); // Save watched status
        updateCourseProgress();
    }
}

function updateCourseProgress() {
    const progress = (videosWatched / totalVideos) * 100;
    document.getElementById("courseProgressBar").value = progress;
    document.getElementById("progressPercentage").textContent = `${videosWatched}/${totalVideos} videos watched (${Math.round(progress)}%)`;
}

// Save video timestamp before the page unloads
window.addEventListener('beforeunload', () => {
    const videoPlayer = document.querySelector('.main-video video');
    if (currentVideoIndex !== null && videoPlayer) {
        const currentTime = videoPlayer.currentTime;
        localStorage.setItem(`video-timestamp-${courseId}-${currentVideoIndex}`, currentTime);
    }
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "/login.html";
    }
});

document.addEventListener('DOMContentLoaded', fetchAndDisplayCourse);
