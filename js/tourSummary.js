const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const summaryModal = document.getElementById("summaryModal");
const videosphere1 = document.querySelector("#videosphere");
const cam = document.querySelector("#cam");

// ----------------------------
// END TOUR BUTTON
// ----------------------------
endTourBtn.addEventListener("click", () => {
  // Pause current video
  const videosphere1 = document.querySelector("#videosphere");
  const currentVidId = videosphere1.getAttribute("src");
  const videoEl = document.querySelector(currentVidId);
  if (videoEl) videoEl.pause();

  // Stop autorotate
  isAutorotating = false;
  cam.setAttribute("look-controls", "enabled", true);

  // Build modal content
  const visitedSet = window.visitedSpots || new Set();
  let html = `<h2>Tour Summary</h2>`;
  html += `<p>Spots visited: ${visitedSet.size}</p>`;
  html += `<ul>`;
  visitedSet.forEach(name => html += `<li>${name}</li>`);
  html += `</ul>`;
  html += `<p><strong>Lab Info:</strong> HOLA - Hands-On Laboratory for Computing Education Research. Inclusive, problem-based learning & teacher training.</p>`;
  summaryContent.innerHTML = html;

  // Show modal
  summaryModal.style.display = "block";
});

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location.reload(); // reload the page and go back to start screen
  });
}