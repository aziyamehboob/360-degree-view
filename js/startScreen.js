document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("startScreen");
  const actionBtns = document.querySelectorAll(".action-btn");
  const closeIcon = document.querySelector(".close-icon");
  const mapDots = document.querySelectorAll(".map-dot");

  // Menu Elements
  const menuBurger = document.getElementById("menuBurger");
  const sideDrawer = document.getElementById("sideDrawer");
  const closeDrawer = document.getElementById("closeDrawer");

  // Safety check
  if (!startScreen) {
    console.warn("Start screen element not found.");
    return;
  }

  document.body.classList.add("tour-not-started");

  const startTour = (videoId = "#vid1") => {
    startScreen.style.display = "none";
    document.body.classList.remove("tour-not-started");

    // If a specific video is requested (from map dot), play that one
    // Otherwise default to #vid1 (Entrance)

    // Check if changeVideo is available (from index.js)
    if (window.changeVideo && videoId !== "#vid1") {
      // Find the group ID and name based on the video ID (simplified logic)
      // In a real app, we might want a lookup map
      const dot = document.querySelector(`.map-dot[data-video="${videoId.replace('#', '')}"]`);
      const name = dot ? dot.dataset.title : "Location";
      const groupId = `group-${videoId.replace('#', '')}`;

      window.changeVideo(videoId, groupId, name, "0 0 0");
    } else {
      // Default start (Entrance)
      const vid1 = document.getElementById("vid1");
      if (vid1) {
        vid1.play().catch(e => console.log("Auto-play prevented:", e));
      }
    }
  };

  // Attach event listeners to all action buttons (Default Start)
  actionBtns.forEach(btn => {
    btn.addEventListener("click", () => startTour("#vid1"));
  });

  // Attach event listener to close icon
  if (closeIcon) {
    closeIcon.addEventListener("click", () => startTour("#vid1"));
  }

  // Map Dots Click Handler
  mapDots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent bubbling if needed
      const videoId = `#${dot.dataset.video}`;
      startTour(videoId);
    });
  });

  // Menu Interactions
  if (menuBurger && sideDrawer && closeDrawer) {
    menuBurger.addEventListener("click", () => {
      sideDrawer.classList.add("open");
    });

    closeDrawer.addEventListener("click", () => {
      sideDrawer.classList.remove("open");
    });
  }
});