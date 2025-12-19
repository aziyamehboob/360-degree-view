// ----------------------------
// GLOBAL VARIABLES
// ----------------------------
const camera = document.querySelector("#cam");
const videosphere = document.querySelector("#videosphere");
const pivot = document.querySelector("#pivotY");
const autoRotateBtn = document.getElementById("autoRotateBtn");
const autoRotateIcon = document.getElementById("autoRotateIcon");

window.visitedSpots = window.visitedSpots || new Set();
let isAutorotating = true;

const tabs = document.querySelectorAll("#topTabs .tab");

// ----------------------------
// HELPER: Set active tab and visited tabs
// ----------------------------
function setActiveTabByVideoId(videoId) {
  tabs.forEach(tab => {
    const tabName = tab.textContent.trim();
    if (`#${tab.dataset.video}` === videoId) {
      tab.classList.add("active");
      tab.classList.remove("visited");
    } else if (window.visitedSpots.has(tabName)) {
      tab.classList.add("visited");
      tab.classList.remove("active");
    } else {
      tab.classList.remove("active", "visited");
    }
  });
}

// ----------------------------
// TAB CLICK HANDLER
// ----------------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const videoId = `#${tab.dataset.video}`;
    const groupId = `group-${tab.dataset.video}`;
    const friendlyName = tab.textContent.trim();

    // Change video
    const vidEl = document.querySelector(videoId);
    videosphere.setAttribute("src", videoId);
    if (vidEl) vidEl.play();

    // Show hotspot group
    document.querySelectorAll("#spots > a-entity").forEach(g => g.setAttribute("scale", "0 0 0"));
    const groupEl = document.getElementById(groupId);
    if (groupEl) groupEl.setAttribute("scale", "1 1 1");

    // Autorotate
    isAutorotating = true;
    camera.setAttribute("look-controls", "enabled: false");
    updateAutoRotateButton();

    // Add to visited spots
    window.visitedSpots.add(friendlyName);

    // Update visited counter (show names as comma-separated)
const visitedCounter = document.getElementById("visitedCount");
if (visitedCounter) visitedCounter.textContent = window.visitedSpots.size;

    // Set tab classes
    setActiveTabByVideoId(videoId);
  });
});

// ----------------------------
// AUTO-ROTATE LOGIC
// ----------------------------
function updateAutoRotateButton() {
  autoRotateIcon.src = isAutorotating ? "assets/images/pause.png" : "assets/images/play.png";
  camera.setAttribute("look-controls", "enabled", !isAutorotating);
}

autoRotateBtn.addEventListener("click", () => {
  isAutorotating = !isAutorotating;
  updateAutoRotateButton();
});

const sceneEl = document.querySelector("a-scene");

sceneEl.addEventListener("mousedown", (e) => {
  if (e.target.classList?.contains("clickable")) return;
  isAutorotating = false;
  updateAutoRotateButton();
});

sceneEl.addEventListener("touchstart", (e) => {
  if (e.target.classList?.contains("clickable")) return;
  isAutorotating = false;
  updateAutoRotateButton();
});

// ----------------------------
// AUTO ROTATE COMPONENT
// ----------------------------
AFRAME.registerComponent("auto-rotate-pivot", {
  schema: { speed: { type: "number", default: 2 } },
  tick: function (time, timeDelta) {
    if (!isAutorotating) return;
    const radiansPerMs = THREE.MathUtils.degToRad(this.data.speed) / 1000;
    pivot.object3D.rotation.y += radiansPerMs * timeDelta;
  }
});
