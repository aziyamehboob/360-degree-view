document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("startScreen");
  const closeIcon = document.querySelector(".close-icon");
  const websiteUrl = "https://www.unibz.it/en/faculties/engineering/research/software-engineering-autonomous-systems/lab/hola-hands-on-laboratory";

  // Visit Website button
const websiteBtn = document.getElementById("action-btn");
if (websiteBtn) {
  websiteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling
    window.open(websiteUrl, "_blank", "noopener,noreferrer");
    // Don't start the tour
  });
}

// Close/cancel inside welcome card
if (closeIcon) {
  closeIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling
    const welcomeCard = document.querySelector(".welcome-card");
    if (welcomeCard) welcomeCard.style.display = "none"; // hide only the card
    // Don't start the tour
  });
}

  document.body.classList.add("tour-not-started");

  const startTour = (videoId = "#vid1") => {
    startScreen.style.display = "none";
    document.body.classList.remove("tour-not-started");

    const introSky = document.getElementById("introSky");
    if (introSky) introSky.setAttribute("visible", "false");

    const videosphere = document.getElementById("videosphere");
    if (videosphere) videosphere.setAttribute("visible", "true");

    const spots = document.getElementById("spots");
    if (spots) spots.setAttribute("visible", "true");

    if (window.changeVideo && videoId !== "#vid1") {
      const groupId = `group-${videoId.replace('#', '')}`;
      const name = "Location";
      window.changeVideo(videoId, groupId, name, "0 0 0");
    } else {
      const vid1 = document.getElementById("vid1");
      if (vid1) vid1.play().catch(e => console.log("Auto-play prevented:", e));
    }
  };

  // 3D Hotspot Click Handler
  const entryHotspot = document.getElementById("entryHotspot");
  const entryTooltip = document.getElementById("entryTooltip");

  if (entryHotspot) {
    entryHotspot.addEventListener("click", () => startTour("#vid1"));

    entryHotspot.addEventListener("mouseenter", () => {
      entryHotspot.setAttribute("scale", "1.3 1.3 1.3");
      if (entryTooltip) entryTooltip.setAttribute("visible", "true");
    });
    entryHotspot.addEventListener("mouseleave", () => {
      entryHotspot.setAttribute("scale", "1 1 1");
      if (entryTooltip) entryTooltip.setAttribute("visible", "false");
    });
  }

  // Menu Interactions
  const menuBurger = document.getElementById("menuBurger");
  const sideDrawer = document.getElementById("sideDrawer");
  const closeDrawer = document.getElementById("closeDrawer");

  if (menuBurger && sideDrawer && closeDrawer) {
    menuBurger.addEventListener("click", () => sideDrawer.classList.add("open"));
    closeDrawer.addEventListener("click", () => sideDrawer.classList.remove("open"));
  }
});

//contact us 
document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.querySelector(".contact-btn");
  const contactPanel = document.getElementById("contactPanel");
  const closeContactPanel = document.getElementById("closeContactPanel");
  const sendContact = document.getElementById("sendContact");

  // Open contact panel
  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      contactPanel.classList.add("active"); // slide in
    });
  }

  // Close contact panel
  if (closeContactPanel) {
    closeContactPanel.addEventListener("click", () => {
      contactPanel.classList.remove("active"); // slide out
    });
  }

  // Send message
  if (sendContact) {
    sendContact.addEventListener("click", () => {
      const email = document.getElementById("contactEmail").value;
      const message = document.getElementById("contactMessage").value;

      if (!email || !message) {
        alert("Please fill out both fields.");
        return;
      }

      // Open email client
      window.location.href = `mailto:your@email.com?subject=Contact%20Form&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;

      contactPanel.classList.remove("active"); // slide out
    });
  }
});
