document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CONSTANTS & ELEMENTS
  ===================================================== */
  const startScreen = document.getElementById("startScreen");
  const websiteBtn = document.getElementById("action-btn");

  const websiteUrl =
    "https://www.unibz.it/en/faculties/engineering/research/software-engineering-autonomous-systems/lab/hola-hands-on-laboratory";

  document.body.classList.add("tour-not-started");


  /* =====================================================
     WELCOME CARD LOGIC
  ===================================================== */

  // Close welcome card (event delegation – robust)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-icon")) {
      e.stopPropagation();
      const welcomeCard = e.target.closest(".welcome-card");
      if (welcomeCard) {
        welcomeCard.style.display = "none";
      }
    }
  });

  // Visit website button
  if (websiteBtn) {
    websiteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    });
  }

/* =====================================================
   HOME BUTTON – RELOAD PAGE
===================================================== */
const homeBtn = document.querySelector(".home-btn");

if (homeBtn) {
  homeBtn.addEventListener("click", (e) => {
    e.preventDefault();   // stop # jump
    window.location.reload();
  });
}

  /* =====================================================
     START TOUR FUNCTION
  ===================================================== */
  const startTour = (videoId = "#vid1") => {
  // Hide start screen & entry hotspot
  startScreen.style.display = "none";
  toggleAFrameVisibility("entryHotspot", false);
  toggleAFrameVisibility("entryTooltip", false);
  document.body.classList.remove("tour-not-started");

  // Show the main scene
  toggleAFrameVisibility("introSky", false);
  toggleAFrameVisibility("videosphere", true);
  toggleAFrameVisibility("spots", true);

  // Set video1 as active
  const vid1 = document.getElementById("vid1");
  if (vid1) {
    document.querySelector("#videosphere").setAttribute("src", "#vid1");
    vid1.play().catch(() => {});
  }

  // Show first hotspot group
  const groupEl = document.getElementById("group-vid1");
  if (groupEl) groupEl.setAttribute("scale", "1 1 1");

  // Enable autorotate
  isAutorotating = true;
  const cam = document.getElementById("cam");
  cam.setAttribute("look-controls", "enabled", false);

  // Mark first tab as active & visited
  const firstTab = document.querySelector("#topTabs .tab[data-video='vid1']");
  if (firstTab) {
    firstTab.classList.add("active");
    window.visitedSpots.add(firstTab.textContent.trim());
    const visitedCounter = document.getElementById("visitedCount");
    if (visitedCounter) visitedCounter.textContent = window.visitedSpots.size;
  }
};


  /* =====================================================
     ENTRY HOTSPOT
  ===================================================== */
  const entryHotspot = document.getElementById("entryHotspot");
  const entryTooltip = document.getElementById("entryTooltip");

 if (entryHotspot) {
  entryHotspot.addEventListener("click", (e) => {
    e.stopPropagation();
    startTour("#vid1");
  });

  entryHotspot.addEventListener("raycaster-intersected", () => {
    entryHotspot.setAttribute("scale", "1.3 1.3 1.3");
    entryTooltip?.setAttribute("visible", "true");
  });

  entryHotspot.addEventListener("raycaster-intersected-cleared", () => {
    entryHotspot.setAttribute("scale", "1 1 1");
    entryTooltip?.setAttribute("visible", "false");
  });
}
  


  /* =====================================================
     SIDE DRAWER MENU
  ===================================================== */
  const menuBurger = document.getElementById("menuBurger");
  const sideDrawer = document.getElementById("sideDrawer");
  const closeDrawer = document.getElementById("closeDrawer");

  if (menuBurger && sideDrawer && closeDrawer) {
    menuBurger.addEventListener("click", () =>
      sideDrawer.classList.add("open")
    );

    closeDrawer.addEventListener("click", () =>
      sideDrawer.classList.remove("open")
    );
  }


  /* =====================================================
     CONTACT PANEL
  ===================================================== */
  const contactBtn = document.querySelector(".contact-btn");
  const contactPanel = document.getElementById("contactPanel");
  const closeContactPanel = document.getElementById("closeContactPanel");
  const sendContact = document.getElementById("sendContact");

  if (contactBtn && contactPanel) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      contactPanel.classList.add("active");
    });
  }

  if (closeContactPanel && contactPanel) {
    closeContactPanel.addEventListener("click", () =>
      contactPanel.classList.remove("active")
    );
  }

  if (sendContact && contactPanel) {
    sendContact.addEventListener("click", () => {
      const email = document.getElementById("contactEmail")?.value;
      const message = document.getElementById("contactMessage")?.value;

      if (!email || !message) {
        alert("Please fill out both fields.");
        return;
      }

      window.location.href =
        `mailto:your@email.com?subject=Contact%20Form&body=` +
        encodeURIComponent(`${message}\n\nFrom: ${email}`);

      contactPanel.classList.remove("active");
    });
  }


  /* =====================================================
     HELPERS
  ===================================================== */
  function toggleAFrameVisibility(id, visible) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("visible", visible);
  }

});