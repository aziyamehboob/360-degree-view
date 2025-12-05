// ----------------------------
// HOTSPOT COMPONENTS
// ----------------------------

// ----------------------------
// Spot click handler
// ----------------------------
AFRAME.registerComponent("spot", {
  schema: {
    linkto: { type: "string" },
    spotgroup: { type: "string" },
    videoname: { type: "string", default: "" }
  },

  init: function() {
    const el = this.el;
    const videosphere = document.querySelector("#videosphere");
    const currentVideoName = document.getElementById("currentVideoName");

    el.addEventListener("click", () => {
      // Change 360° video
      videosphere.setAttribute("src", this.data.linkto);
      const videoEl = document.querySelector(this.data.linkto);
      if (videoEl) videoEl.play();
  // show controls


      // Show relevant hotspot group
      this.el.sceneEl.querySelector("#spots").emit("showgroup", { group: this.data.spotgroup });

      // Update menu label
      if (currentVideoName && this.data.videoname) {
        currentVideoName.textContent = this.data.videoname;
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

// ----------------------------
// Hotspot hover label
// ----------------------------
AFRAME.registerComponent('hotspot-hover-label', {
  schema: { offset: {type:'vec3', default:{x:0,y:2,z:0}}, scale:{type:'number', default:1} },
  init: function() {
    const el = this.el;
    const sceneEl = el.sceneEl;
    const text = document.createElement('a-entity');
    text.setAttribute('text', { value: el.dataset.name || 'NO-NAME', align:'center', color:'#fff', width:2 });
    text.setAttribute('scale', `${this.data.scale} ${this.data.scale} ${this.data.scale}`);
    text.setAttribute('visible', false);
    sceneEl.appendChild(text);
    el.hoverText = text;

    el.addEventListener('mouseenter', () => text.setAttribute('visible', true));
    el.addEventListener('mouseleave', () => text.setAttribute('visible', false));
  },
  tick: function() {
    if (!this.el.hoverText) return;
    // Update position every frame
    const worldPos = new THREE.Vector3();
    this.el.object3D.localToWorld(worldPos);
    this.el.hoverText.object3D.position.copy(worldPos);
    this.el.hoverText.object3D.position.add(new THREE.Vector3(
      this.data.offset.x,
      this.data.offset.y,
      this.data.offset.z
    ));
    // Make text face camera
    const cam = document.querySelector('#cam');
    if (cam) this.el.hoverText.object3D.lookAt(cam.object3D.position);
  }
});