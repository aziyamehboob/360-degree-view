
// Initialize view control buttons
function initViewControlButtons() {
  const cameraEl = document.querySelector("#cam");
  const pivotEl = document.querySelector("#pivot");
  const speed = 0.02;
  const zoomStep = 0.5;

  if (!cameraEl || !pivotEl) return;

  // Rotation buttons
  document.getElementById("viewLeft").onclick = () => pivotEl.object3D.rotation.y += speed;
  document.getElementById("viewRight").onclick = () => pivotEl.object3D.rotation.y -= speed;
  document.getElementById("viewUp").onclick = () => 
    cameraEl.object3D.rotation.x = Math.max(cameraEl.object3D.rotation.x - speed, -Math.PI / 2);
  document.getElementById("viewDown").onclick = () => 
    cameraEl.object3D.rotation.x = Math.min(cameraEl.object3D.rotation.x + speed, Math.PI / 2);

  // Zoom buttons
  document.getElementById("viewIn").onclick = () => 
    cameraEl.object3D.position.z = Math.max(cameraEl.object3D.position.z - zoomStep, 1);
  document.getElementById("viewOut").onclick = () => 
    cameraEl.object3D.position.z += zoomStep;
}

// Make buttons visible and initialize them
function enableControls() {
  document.body.classList.add("view-control-buttons");
  document.querySelectorAll('.viewControlButton').forEach(btn => btn.style.display = 'block');
  initViewControlButtons();
}

// Ensure buttons load after scene is ready
AFRAME.registerSystem('controls-loader', {
  init: function() {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    scene.addEventListener('loaded', () => {
      // Slight delay to make sure everything is rendered
      setTimeout(() => enableControls(), 100);
    });
  }
});

// Expose globally so index.js can call after video switch
window.enableControls = enableControls;