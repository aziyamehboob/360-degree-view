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
    pivotX.setAttribute("rotation", { x, y: 0, z: 0 });
    pivotY.setAttribute("rotation", { x: 0, y, z: 0 });
  }
});

// ----------------------------
// HOTSPOT COMPONENT
// ----------------------------
AFRAME.registerComponent("spot", {
  schema: {
    linkto: { type: "string" },
    spotgroup: { type: "string" },
    videoname: { type: "string", default: "" }, // friendly name
    rotation: { type: "string", default: "" }
  },
  init: function () {
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
        pivotX.setAttribute("rotation", { x, y: 0, z: 0 });
        pivotY.setAttribute("rotation", { x: 0, y, z: 0 });
      }

      // Resume autorotate
      if (typeof isAutorotating !== "undefined") {
        isAutorotating = true;
        const cam = document.querySelector("#cam");
        cam.setAttribute("look-controls", "enabled", false);
      }

      // ----------------------------
      // Add current spot to visited
      // ----------------------------
      if (!window.visitedSpots) window.visitedSpots = new Set();

      // Use the friendly name from the tab text
      const tabs = document.querySelectorAll(".tab");
      let friendlyName = this.data.videoname || this.data.linkto.replace("#", "");
      tabs.forEach(tab => {
        if (`#${tab.dataset.video}` === this.data.linkto) {
          friendlyName = tab.textContent.trim();
        }
      });

      window.visitedSpots.add(friendlyName);

      // ----------------------------
      // Update tab classes
      // ----------------------------
      tabs.forEach(tab => {
        const tabName = tab.textContent.trim();
        tab.classList.remove("active", "visited");

        if (tabName === friendlyName) {
          tab.classList.add("active"); // current → blue
        } else if (window.visitedSpots.has(tabName)) {
          tab.classList.add("visited"); // visited → green
        }
      });

      // ----------------------------
      // Update visited count
      // ----------------------------
      const visitedCounter = document.getElementById("visitedCount");
      if (visitedCounter) visitedCounter.textContent = window.visitedSpots.size;
    });
  }
});

// ----------------------------
// Hotspots group visibility
// ----------------------------
AFRAME.registerComponent("hotspots", {
  init: function () {
    this.el.addEventListener("showgroup", evt => {
      const groupId = evt.detail.group;
      document.querySelectorAll("[id^='group-']").forEach(g => g.setAttribute("scale", "0 0 0"));
      const groupEl = document.getElementById(groupId);
      if (groupEl) groupEl.setAttribute("scale", "1 1 1");
    });
  }
});
// ----------------------------
// HOTSPOT HOVER LABEL
// ----------------------------
AFRAME.registerComponent('hotspot-hover-label', {
  schema: {
    offsetY: { type: 'number', default: 0.3 }, // vertical offset above hotspot
    baseWidth: { type: 'number', default: 1.5 }, // text width
    baseScale: { type: 'number', default: 0.5 }, // text scale
    textColor: { type: 'color', default: '#ffffff' }, // text color (white for contrast)
    panelColor: { type: 'color', default: '#000000' }, // panel color (black)
    panelPadding: { type: 'number', default: 0.2 }, // ~10px padding
    borderColor: { type: 'color', default: '#ffffff' },
    borderWidth: { type: 'number', default: 0.02 }, // ~2px border
    cornerRadius: { type: 'number', default: 0.05 } // Rounded corners
  },

  init: function () {
    const el = this.el;
    const sceneEl = el.sceneEl;
    this.hideTimer = null;
    this.isHovering = false;

    // Create root tooltip entity
    this.tooltip = document.createElement('a-entity');
    this.tooltip.setAttribute('visible', false);

    // Calculate dimensions
    const contentHeight = 0.3;
    const totalWidth = this.data.baseWidth + (this.data.panelPadding * 2);
    const totalHeight = contentHeight + (this.data.panelPadding * 2);

    // --- Border (Outer Box) ---
    // Replaced a-rounded with a-plane for stability
    const border = document.createElement('a-plane');
    border.setAttribute('width', totalWidth + (this.data.borderWidth * 2));
    border.setAttribute('height', totalHeight + (this.data.borderWidth * 2));
    border.setAttribute('color', this.data.borderColor);
    border.setAttribute('opacity', 1);
    border.classList.add('clickable'); // Make interactive
    border.object3D.position.set(0, 0, 0); // Centered
    this.tooltip.appendChild(border);

    // --- Background (Inner Box) ---
    const bg = document.createElement('a-plane');
    bg.setAttribute('width', totalWidth);
    bg.setAttribute('height', totalHeight);
    bg.setAttribute('color', this.data.panelColor);
    bg.setAttribute('opacity', 0.9);
    bg.classList.add('clickable'); // Make interactive
    // Position slightly in front
    bg.object3D.position.set(0, 0, 0.005);
    this.tooltip.appendChild(bg);

    // --- Text ---
    const text = document.createElement('a-entity');
    text.setAttribute('text', {
      value: el.dataset.name || 'NO-NAME',
      align: 'center',
      color: this.data.textColor,
      width: this.data.baseWidth,
      wrapCount: 20,
      baseline: 'center'
    });
    // Position in front of background
    text.object3D.position.set(0, 0, 0.02);
    text.object3D.scale.set(this.data.baseScale, this.data.baseScale, this.data.baseScale);
    this.tooltip.appendChild(text);

    sceneEl.appendChild(this.tooltip);
    el.hoverText = this.tooltip;

    // ----- Hover Events Logic -----

    // 1. Hover on Hotspot (Arrow)
    el.addEventListener('raycaster-intersected', () => this.onHover());
    el.addEventListener('raycaster-intersected-cleared', () => this.onHoverOut());

    // 2. Hover on Tooltip (Border/Bg)
    border.addEventListener('raycaster-intersected', () => this.onHover());
    border.addEventListener('raycaster-intersected-cleared', () => this.onHoverOut());

    bg.addEventListener('raycaster-intersected', () => this.onHover());
    bg.addEventListener('raycaster-intersected-cleared', () => this.onHoverOut());
  },

  onHover: function () {
    // Clear any pending hide timer
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    // If already visible, do nothing
    if (this.isHovering) return;

    this.isHovering = true;
    this.tooltip.setAttribute('visible', true);
  },

  onHoverOut: function () {
    // Start a timer to hide. If we hover back in (on icon or box), it gets cleared.
    this.hideTimer = setTimeout(() => {
      if (this.hideTimer) {
        this.tooltip.setAttribute('visible', false);
        this.isHovering = false;
      }
    }, 1000); // 1 second delay
  },

  tick: function () {
    if (!this.tooltip) return;

    // Get hotspot world position
    const hotspotWorldPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(hotspotWorldPos);

    // Compute tooltip position above hotspot
    const offsetY = this.data.offsetY;
    this.tooltip.object3D.position.set(
      hotspotWorldPos.x,
      hotspotWorldPos.y + offsetY,
      hotspotWorldPos.z
    );

    // Make tooltip face the camera
    const cam = document.querySelector('#cam');
    if (cam) this.tooltip.object3D.lookAt(cam.object3D.position);
  }
});


AFRAME.registerComponent('arrow-hotspot', {
  schema: {
    // Arrow properties
    arrowScale: { type: 'number', default: 0.035 },
    arrowOffsetX: { type: 'number', default: 0 },
    arrowOffsetY: { type: 'number', default: 0 },
    arrowOffsetZ: { type: 'number', default: 0 },

    // Ring properties
    ringInner: { type: 'number', default: 0.07 },
    ringOuter: { type: 'number', default: 0.075 },
    ringColor: { type: 'color', default: '#0077ff' },
    ringOpacity: { type: 'number', default: 0.85 }
  },

  init: function () {
    this.camera = document.querySelector('#cam');

    // Arrow model
    this.arrow = document.createElement('a-gltf-model');
    this.arrow.setAttribute('src', '#arrowModel');
    this.arrow.classList.add('clickable');
    this.arrow.object3D.position.set(
      this.data.arrowOffsetX,
      this.data.arrowOffsetY,
      this.data.arrowOffsetZ
    );
    this.arrow.object3D.scale.set(
      this.data.arrowScale,
      this.data.arrowScale,
      this.data.arrowScale
    );
    this.el.appendChild(this.arrow);

    // Ring around arrow
    this.ring = document.createElement('a-ring');
    this.ring.setAttribute('radius-inner', this.data.ringInner);
    this.ring.setAttribute('radius-outer', this.data.ringOuter);
    this.ring.setAttribute(
      'material',
      `shader: flat; color: ${this.data.ringColor}; opacity: ${this.data.ringOpacity}; side: double; depthTest: false`
    );
    this.ring.object3D.position.set(0, 0, 0); // ring centered on hotspot
    this.el.appendChild(this.ring);
  },

  tick: function () {
    if (!this.camera || !this.ring) return;

    // Make ring face the camera
    this.ring.object3D.lookAt(this.camera.object3D.position);
  }
});
