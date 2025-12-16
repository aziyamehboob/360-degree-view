const endTourBtn = document.getElementById("endTourBtn");

// Create summary modal
const summaryModal = document.createElement("div");
summaryModal.id = "summaryModal";

// Add modal HTML
summaryModal.innerHTML = `
  <h2>Tour Summary</h2>
  <p id="visitedSpotsCount">Spots visited: 0</p>
  <ul id="visitedSpotsList"></ul>
  <p><strong>Lab Info:</strong> HOLA - Hands-On Laboratory for Computing Education Research. Inclusive, problem-based learning & teacher training.</p>
  <button id="restartTourBtn">Restart Tour</button>
`;

// Add modal to body
document.body.appendChild(summaryModal);

// END TOUR button click
endTourBtn.addEventListener("click", () => {
  const visitedSet = window.visitedVideos || new Set();

  // Update count
  document.getElementById("visitedSpotsCount").textContent = `Spots visited: ${visitedSet.size}`;

  // Update visited spots list
  const listEl = document.getElementById("visitedSpotsList");
  listEl.innerHTML = ""; // clear previous
  visitedSet.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    listEl.appendChild(li);
  });

  // Show modal
  summaryModal.style.display = "block";
});

// RESTART TOUR button
document.getElementById("restartTourBtn").addEventListener("click", () => {
  summaryModal.style.display = "none";

  // Reset visited videos
  window.visitedVideos = new Set();

  // Reset top tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
    tab.classList.remove("visited");
  });

  // Reset video sphere to first video
  const videosphere = document.querySelector("#videosphere");
  const vid1 = document.querySelector("#vid1");
  if (videosphere && vid1) {
    videosphere.setAttribute("src", "#vid1");
    vid1.play();
  }

  // Reset pivot rotations
  const pivotY = document.querySelector("#pivotY");
  const pivotX = document.querySelector("#pivotX");
  if (pivotY) pivotY.setAttribute("rotation", "0 0 0");
  if (pivotX) pivotX.setAttribute("rotation", "0 0 0");

  // Disable autorotate until user starts
  if (typeof isAutorotating !== "undefined") {
    isAutorotating = false;
    const cam = document.querySelector("#cam");
    cam.setAttribute("look-controls", "enabled", true);
  }

  // Show start screen
  const startScreen = document.getElementById("startScreen");
  if (startScreen) startScreen.style.display = "flex";
});