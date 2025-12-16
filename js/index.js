// ----------------------------
// GLOBAL VARIABLES
// ----------------------------
const camera = document.querySelector("#cam");
const videosphere = document.querySelector("#videosphere");
const pivot = document.querySelector("#pivotY");
const cam = document.querySelector("#cam");
const autoRotateBtn = document.getElementById("autoRotateBtn");
const autoRotateIcon = document.getElementById("autoRotateIcon");

let isAutorotating = true;
const tabs = document.querySelectorAll("#topTabs .tab");
const visitedVideos = new Set();

// ----------------------------
// TAB COLOR LOGIC
// ----------------------------
function setActiveTab(videoId) {
  tabs.forEach(tab => {
    if (tab.dataset.video === videoId.replace('#', '')) {
      tab.classList.add("active");
      tab.classList.remove("visited");
    } else if (visitedVideos.has(tab.dataset.video)) {
      tab.classList.add("visited");
      tab.classList.remove("active");
    } else {
      tab.classList.remove("active", "visited");
    }
  });
}

// ----------------------------
// CHANGE VIDEO FUNCTION
// ----------------------------
window.changeVideo = function (videoId, groupId, videoName, rotation) {
  const vidEl = document.querySelector(videoId);
  videosphere.setAttribute("src", videoId);
  if (vidEl) vidEl.play();

  if (rotation) {
    const rot = rotation.split(" ").map(Number);
    pivot.setAttribute("rotation", `${rot[0]} ${rot[1]} ${rot[2]}`);
  }

  isAutorotating = true;
  camera.setAttribute("look-controls", "enabled: false");
  updateButton();

  document.querySelectorAll("#spots > a-entity").forEach(g => g.setAttribute("scale", "0 0 0"));

  const groupEl = document.getElementById(groupId);
  if (groupEl) groupEl.setAttribute("scale", "1 1 1");

  visitedVideos.add(videoId.replace('#', ''));
  setActiveTab(videoId);
}

// ----------------------------
// TAB CLICK HANDLER
// ----------------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const vidId = `#${tab.dataset.video}`;
    const groupId = `group-${tab.dataset.video}`;
    const name = tab.textContent;
    const rotation = "0 0 0";
    changeVideo(vidId, groupId, name, rotation);
  });
});

// ----------------------------
// START TOUR BUTTON
// ----------------------------
const startBtn = document.getElementById("startTourBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";

    const vidId = "#vid1";
    const entranceVideo = document.getElementById("vid1");
    entranceVideo.play();
    videosphere.setAttribute("src", vidId);

    visitedVideos.add("vid1");
    setActiveTab(vidId);

    isAutorotating = true;
    updateButton();
  });
}


// ----------------------------
// AUTO-ROTATE LOGIC
// ----------------------------
function updateButton() {
  autoRotateIcon.src = isAutorotating ? "assets/images/pause.png" : "assets/images/play.png";
  cam.setAttribute("look-controls", "enabled", !isAutorotating);
}

autoRotateBtn.addEventListener("click", () => {
  isAutorotating = !isAutorotating;
  updateButton();
});

document.querySelector("a-scene").addEventListener("mousedown", () => {
  isAutorotating = false;
  updateButton();
});
document.querySelector("a-scene").addEventListener("touchstart", () => {
  isAutorotating = false;
  updateButton();
});

AFRAME.registerComponent("auto-rotate-pivot", {
  schema: { speed: { type: "number", default: 2 } },
  tick: function (time, timeDelta) {
    if (!isAutorotating) return;
    const radiansPerMs = THREE.MathUtils.degToRad(this.data.speed) / 1000;
    pivot.object3D.rotation.y += radiansPerMs * timeDelta;
  }
});

function stopAutoRotate() {
  isAutorotating = false;
  updateButton();
}