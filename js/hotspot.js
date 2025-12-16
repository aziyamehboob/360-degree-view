// ----------------------------
// CAMERA ROTATION HANDLER
// ----------------------------
AFRAME.registerComponent("set-view", {
  schema: { rotation: { type: "string" } },
  init: function () {
    const pivotY = document.querySelector("#pivotY");
    const pivotX = document.querySelector("#pivotX");

    if (!this.data.rotation) return;

    const [x, y, z] = this.data.rotation.split(" ").map(Number);

    pivotX.setAttribute("rotation", { x: x, y: 0, z: 0 });
    pivotY.setAttribute("rotation", { x: 0, y: y, z: 0 });
  }
});

// ----------------------------
// HOTSPOT COMPONENT
// ----------------------------
AFRAME.registerComponent("spot", {
  schema: {
    linkto: { type: "string" },
    spotgroup: { type: "string" },
    videoname: { type: "string", default: "" },
    rotation: { type: "string", default: "" }
  },
  init: function() {
    const el = this.el;
    const videosphere = document.querySelector("#videosphere");
    const pivotY = document.querySelector("#pivotY");
    const pivotX = document.querySelector("#pivotX");

    el.addEventListener("click", () => {
      // Change video
      videosphere.setAttribute("src", this.data.linkto);
      const videoEl = document.querySelector(this.data.linkto);
      if (videoEl) videoEl.play();

      // Show hotspot group
      this.el.sceneEl.querySelector("#spots").emit("showgroup", { group: this.data.spotgroup });

      // Apply starting rotation
      if (this.data.rotation && pivotX && pivotY) {
        const [x, y] = this.data.rotation.split(" ").map(Number);
        pivotX.setAttribute("rotation", { x: x, y: 0, z: 0 });
        pivotY.setAttribute("rotation", { x: 0, y: y, z: 0 });
      }

      // Resume autorotate
      if (typeof isAutorotating !== "undefined") {
        isAutorotating = true;
        const cam = document.querySelector("#cam");
        cam.setAttribute("look-controls", "enabled", false);
      }

      // ----------------------------
      // Update Top Tabs
      // ----------------------------
      if (!window.visitedVideos) window.visitedVideos = new Set();

      // Add current video to visited
      window.visitedVideos.add(this.data.linkto);

      // Update all tabs
      document.querySelectorAll(".tab").forEach(tab => {
        const vid = `#${tab.dataset.video}`;
        tab.classList.remove("active");
        tab.classList.remove("visited");
        if (window.visitedVideos.has(vid)) {
          tab.classList.add("visited"); // green for visited
        }
      });

      const activeTab = document.querySelector(`.tab[data-video='${this.data.linkto.replace('#','')}']`);
      if (activeTab) activeTab.classList.add("active"); // blue for current

      // ----------------------------
      // Update visited count UI (if exists)
      // ----------------------------
      const visitedCounter = document.getElementById("visitedCount");
      if (visitedCounter) {
        visitedCounter.textContent = window.visitedVideos.size;
      }
    });
  }
});

// ----------------------------
// Hotspots group visibility
// ----------------------------
AFRAME.registerComponent("hotspots", {
  init: function() {
    this.el.addEventListener("showgroup", evt => {
      const groupId = evt.detail.group;
      document.querySelectorAll("[id^='group-']").forEach(g => g.setAttribute("scale", "0 0 0"));
      const groupEl = document.getElementById(groupId);
      if (groupEl) groupEl.setAttribute("scale", "1 1 1");
    });
  }
});