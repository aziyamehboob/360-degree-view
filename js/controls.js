function initViewControlButtons() {
  const cameraEl = document.querySelector("#cam");
  const pivotEl = document.querySelector("#pivot");
  const speed = 0.02;
  const zoomStep = 0.5;

  if (!cameraEl || !pivotEl) return;

  document.getElementById("viewLeft").onclick = () => pivotEl.object3D.rotation.y += speed;
  document.getElementById("viewRight").onclick = () => pivotEl.object3D.rotation.y -= speed;
  document.getElementById("viewUp").onclick = () => cameraEl.object3D.rotation.x = Math.max(cameraEl.object3D.rotation.x - speed, -Math.PI/2);
  document.getElementById("viewDown").onclick = () => cameraEl.object3D.rotation.x = Math.min(cameraEl.object3D.rotation.x + speed, Math.PI/2);

  document.getElementById("viewIn").onclick = () => cameraEl.object3D.position.z = Math.max(cameraEl.object3D.position.z - zoomStep, 1);
  document.getElementById("viewOut").onclick = () => cameraEl.object3D.position.z += zoomStep;
}

// Ensure buttons stay visible
function enableControls() {
  document.body.classList.add("view-control-buttons");
  document.querySelectorAll('.viewControlButton').forEach(btn => btn.style.display = 'block');
  initViewControlButtons();
}


// Load controls after scene fully loaded
AFRAME.registerSystem('controls-loader', {
  init: function() {
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      setTimeout(() => enableControls(), 100);
    });
  }
});