// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Fetch course ID from URL
const courseId = new URLSearchParams(window.location.search).get('id');

let videosWatched = 0; // Track the number of videos watched
let totalVideos = 0; // Total number of videos

// Function to fetch and display course data
async function fetchAndDisplayCourse() {
    const courseId = new URLSearchParams(window.location.search).get('id');

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

            // Dynamically update the course name and image
            const courseLogoElement = document.getElementById("course-logo");
            const courseNameElement = document.getElementById("course-name");

            if (courseData.image) {
                courseLogoElement.src = courseData.image;
            } else {
                courseLogoElement.src = 'default-logo.jpg'; // Default logo if not available
            }

            courseNameElement.textContent = courseData.name || 'Course Name Not Available';

            // Update the video list
            const videoList = document.getElementById("video-list");
            videoList.innerHTML = ''; // Clear any existing content

            if (Array.isArray(courseData.videos)) {
                totalVideos = courseData.videos.length; // Set the total number of videos
                courseData.videos.forEach((video, index) => {
                    const videoItem = document.createElement("li");
                    videoItem.classList.add("video-item");
                    videoItem.setAttribute("data-video-url", video.url);

                    videoItem.innerHTML = `
                        <img class="video-thumbnail" src="${video.thumbnail || 'default-thumbnail.jpg'}" alt="Video Thumbnail">
                        <div class="video-name">${video.name || 'Untitled Video'}</div>`;

                    videoItem.addEventListener("click", () => {
                        playVideo(video.url, index);
                    });

                    videoList.appendChild(videoItem);
                });

                updateProgress(); // Initialize progress display
            }
        } else {
            alert("No course found. Please select a valid course.");
            window.location.href = "/course.html";
        }
    } catch (error) {
        console.error("Error fetching course data:", error);
    }
}

// Update progress function
function updateProgress() {
    const progress = (videosWatched / totalVideos) * 100;
    document.getElementById("overallProgressBar").value = progress;
    document.getElementById("progressText").textContent = `${videosWatched}/${totalVideos} videos watched`;
}

// Play video and update progress
function playVideo(url, index) {
    const videoPlayerContainer = document.getElementById("video-player-container");
    const videoPlayer = document.getElementById("lectureVideo");
    const videoSource = document.getElementById("video-source");

    videoSource.src = url;
    videoPlayer.load();
    videoPlayer.play();
    videoPlayerContainer.style.display = "flex";

    videoPlayer.onended = () => {
        markVideoAsWatched(index);
        updateCourseProgress();
    };
}

// Mark video as watched
function markVideoAsWatched(index) {
    const watchedVideos = getWatchedVideos();
    watchedVideos[index] = true;
    localStorage.setItem(`course-${courseId}-progress`, JSON.stringify(watchedVideos));

    const videoItems = document.querySelectorAll(".video-item");
    videoItems[index].classList.add("watched");
}

// Get watched videos from localStorage
function getWatchedVideos() {
    const progress = localStorage.getItem(`course-${courseId}-progress`);
    return progress ? JSON.parse(progress) : [];
}

// Update course progress display
function updateCourseProgress() {
    const videoItems = document.querySelectorAll(".video-item");
    const totalVideos = videoItems.length;
    const watchedVideos = videoItems.length - document.querySelectorAll(".video-item:not(.watched)").length;

    const progressPercentage = (watchedVideos / totalVideos) * 100;
    document.getElementById("progressText").textContent = `Progress: ${watchedVideos} of ${totalVideos} videos watched (${progressPercentage.toFixed(2)}%)`;
}

// Close video player
function closeVideoPlayer() {
    const videoPlayerContainer = document.getElementById("video-player-container");
    const videoPlayer = document.getElementById("lectureVideo");
    
    videoPlayer.pause();
    videoPlayerContainer.style.display = "none";
}

// Initialize the course data fetch
fetchAndDisplayCourse();

// Event listeners for video player controls
document.addEventListener("DOMContentLoaded", () => {
    const courseLogoElement = document.getElementById("course-logo");
    const videoPlayerContainer = document.getElementById("video-player-container");
    const videoPlayer = document.getElementById("lectureVideo");
    const videoSource = document.getElementById("video-source");
    const progressBar = document.getElementById("progressBar");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const muteBtn = document.getElementById("muteBtn");
    const closeBtn = document.getElementById("closeBtn");
    const volumeSlider = document.getElementById("volumeSlider");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const speedSlider = document.getElementById("speedSlider");
    const rewindBtn = document.getElementById("rewindBtn");
    const forwardBtn = document.getElementById("forwardBtn");

    let isPlaying = false;

    // Update progress bar and time displays
    videoPlayer.addEventListener("timeupdate", () => {
        const currentTime = videoPlayer.currentTime;
        const duration = videoPlayer.duration;
        progressBar.value = (currentTime / duration) * 100;
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    });

    // Seek video when progress bar is changed
    progressBar.addEventListener("input", () => {
        const duration = videoPlayer.duration;
        videoPlayer.currentTime = (progressBar.value / 100) * duration;
    });

    // Toggle play/pause
    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            videoPlayer.pause();
            playPauseBtn.textContent = "Play";
        } else {
            videoPlayer.play();
            playPauseBtn.textContent = "Pause";
        }
        isPlaying = !isPlaying;
    });

    // Toggle mute
    muteBtn.addEventListener("click", () => {
        videoPlayer.muted = !videoPlayer.muted;
        muteBtn.textContent = videoPlayer.muted ? "Unmute" : "Mute";
    });

    // Adjust volume
    volumeSlider.addEventListener("input", () => {
        videoPlayer.volume = volumeSlider.value / 100;
    });

    // Adjust playback speed
    speedSlider.addEventListener("input", () => {
        videoPlayer.playbackRate = speedSlider.value;
    });

    // Rewind video by 10 seconds
    rewindBtn.addEventListener("click", () => {
        videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 10);
    });

    // Forward video by 10 seconds
    forwardBtn.addEventListener("click", () => {
        videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 10);
    });

    // Toggle fullscreen
    fullscreenBtn.addEventListener("click", () => {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) { // Firefox
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) { // IE/Edge
            videoPlayer.msRequestFullscreen();
        }
    });

    // Close video player
    closeBtn.addEventListener("click", () => {
        closeVideoPlayer();
    });

    // Hide video container and show course image when video ends
    videoPlayer.addEventListener("ended", () => {
        videoPlayerContainer.style.display = "none";
        courseLogoElement.classList.remove('hidden');
        isPlaying = false;
        playPauseBtn.textContent = "Play";
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
});
