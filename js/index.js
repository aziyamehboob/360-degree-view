// ----------------------------
// GLOBAL VARIABLES
// ---------------------------

const camera = document.querySelector("#cam");
const menuBar = document.getElementById("menuLeft");
const menuIcon = document.getElementById("menuIcon");
const videoMenu = document.getElementById("videoMenu");
const currentVideoName = document.getElementById("currentVideoName");
const videosphere = document.querySelector("#videosphere");

// ----------------------------
// MENU TOGGLE
// ----------------------------
menuIcon.addEventListener("click", () => {
  videoMenu.style.display = videoMenu.style.display === "block" ? "none" : "block";
});

// ----------------------------
// CHANGE VIDEO FUNCTION
// ----------------------------
window.changeVideo = function(videoId, groupId, videoName, rotation) {
  // Change 360° video
  const vidEl = document.querySelector(videoId);
  videosphere.setAttribute("src", videoId);
  if (vidEl) vidEl.play();

  if (rotation) camera.setAttribute("rotation", rotation);

  // Enable autorotation
  isAutorotating = true;
  camera.setAttribute("look-controls", "enabled: false");

  // Hide all hotspot groups
  document.querySelectorAll("#spots > a-entity")
    .forEach(g => g.setAttribute("scale", "0 0 0"));

  // Show the selected hotspot group
  const groupEl = document.getElementById(groupId);
  if (groupEl) groupEl.setAttribute("scale", "1 1 1");

  // Update menu label
  currentVideoName.textContent = videoName;

  // Highlight active menu item
  document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
  const menuItem = document.querySelector(`[data-video='${videoId.replace('#','')}']`);
  if (menuItem) menuItem.classList.add("active");
}

// ----------------------------
// MENU ITEM CLICK HANDLER
// ----------------------------
document.querySelectorAll("#videoMenu li").forEach(li => {
  li.addEventListener("click", () => {
    const vidId = `#${li.dataset.video}`;
    const groupId = li.dataset.group;
    const name = li.textContent;
    const rotation = li.dataset.rotation;

    changeVideo(vidId, groupId, name, rotation);

    videoMenu.style.display = "none";
  });
});

// ----------------------------
// AUTO-ROTATE COMPONENT
// ----------------------------
let isAutorotating = true;
const autoRotateBtn = document.getElementById("autoRotateBtn");
const autoRotateIcon = document.getElementById("autoRotateIcon");
const cam = document.querySelector("#cam");
const pivot = document.querySelector("#pivot");

// Update button icon and look-controls state
function updateButton() {
  autoRotateIcon.src = isAutorotating ? "assets/img/pause.png" : "assets/img/play.png";
  cam.setAttribute("look-controls", "enabled", !isAutorotating); // enable drag only when paused
}

// Button click toggles autorotate
autoRotateBtn.addEventListener("click", () => {
  isAutorotating = !isAutorotating;
  updateButton();
});

// Click anywhere on scene toggles autorotate (like Marzipano)
document.querySelector("a-scene").addEventListener("mousedown", () => {
  isAutorotating = false;
  updateButton();
});
document.querySelector("a-scene").addEventListener("touchstart", () => {
  isAutorotating = false;
  updateButton();
});

// Autorotate tick
AFRAME.registerComponent("auto-rotate-pivot", {
  schema: { speed: { type: "number", default: 2 } },

  tick: function (time, timeDelta) {
    if (!isAutorotating) return;
    const radiansPerMs = THREE.MathUtils.degToRad(this.data.speed) / 1000;
    pivot.object3D.rotation.y += radiansPerMs * timeDelta;
  }
});  