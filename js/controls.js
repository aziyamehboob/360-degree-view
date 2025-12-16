// Wait until the scene is fully loaded
document.querySelector('a-scene').addEventListener('loaded', () => {

  // Get camera and pivots
  const camEl = document.getElementById("cam");
  const pivotX = document.getElementById("pivotX");
  const pivotY = document.getElementById("pivotY");

  if (!camEl || !pivotX || !pivotY) {
    console.error("Camera or pivotX/pivotY missing!");
    return;
  }

  // Settings
  const ROTATE_STEP = 0.08; // radians per click
  const TILT_STEP = 0.08;   // radians per click
  const ZOOM_STEP = 2;       // FOV change per click

  // Helper to stop autorotate (from index.js)
  function stopAutoRotateFromControls() {
    if (typeof stopAutoRotate === "function") stopAutoRotate();
  }

  // ----------------------------
  // LEFT / RIGHT (Yaw)
  // ----------------------------
  document.getElementById("viewLeft").onclick = () => {
    pivotY.object3D.rotation.y += ROTATE_STEP;
    stopAutoRotateFromControls();
  };
  document.getElementById("viewRight").onclick = () => {
    pivotY.object3D.rotation.y -= ROTATE_STEP;
    stopAutoRotateFromControls();
  };

  // ----------------------------
  // UP / DOWN (Pitch)
  // ----------------------------
  document.getElementById("viewUp").onclick = () => {
    pivotX.object3D.rotation.x = THREE.MathUtils.clamp(
      pivotX.object3D.rotation.x - TILT_STEP,
      -Math.PI / 2,
      Math.PI / 2
    );
    stopAutoRotateFromControls();
  };
  document.getElementById("viewDown").onclick = () => {
    pivotX.object3D.rotation.x = THREE.MathUtils.clamp(
      pivotX.object3D.rotation.x + TILT_STEP,
      -Math.PI / 2,
      Math.PI / 2
    );
    stopAutoRotateFromControls();
  };

  // ----------------------------
  // ZOOM IN / OUT (FOV)
  // ----------------------------
  document.getElementById("viewIn").onclick = () => {
    const camData = camEl.getAttribute("camera");
    camEl.setAttribute("camera", {
      fov: Math.max(20, camData.fov - ZOOM_STEP)
    });
    stopAutoRotateFromControls();
  };

  document.getElementById("viewOut").onclick = () => {
    const camData = camEl.getAttribute("camera");
    camEl.setAttribute("camera", {
      fov: Math.min(100, camData.fov + ZOOM_STEP)
    });
    stopAutoRotateFromControls();
  };

  // ----------------------------
  // Optional: Show controls if hidden
  // ----------------------------
  const container = document.querySelector('.view-control-buttons');
  if (container) container.style.display = 'flex';
});