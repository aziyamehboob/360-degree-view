document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startTourBtn");
  const startScreen = document.getElementById("startScreen");

  // Safety check
  if (!startBtn || !startScreen) {
    console.warn("Start screen elements not found.");
    return;
  }

  document.body.classList.add("tour-not-started");

  startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    document.body.classList.remove("tour-not-started");
  });
});