AFRAME.registerComponent('infoicon', {
  schema: {
    text: { type: 'string' },
    model: { type: 'string' },
    scale: { type: 'vec3', default: { x: 0.36, y: 0.36, z: 0.36 } },
    ringInner: { type: 'number', default: 0.5 },
    ringOuter: { type: 'number', default: 0.55 },
    ringColor: { type: 'color', default: '#0077ff'  },
    ringOpacity: { type: 'number', default: 0.7 },
    textWidth: { type: 'number', default: 4 },
    panelPadding: { type: 'number', default: 0.2 },
    panelHeight: { type: 'number', default: 0.9 },
    panelOffsetY: { type: 'number', default: 1.5 }
  },

  init: function () {
    const el = this.el;
    this.camera = document.querySelector('#cam');

    // ----- Info Icon Model -----
    this.icon = document.createElement('a-entity');
    this.icon.setAttribute('gltf-model', this.data.model);
    this.icon.setAttribute('scale', `${this.data.scale.x} ${this.data.scale.y} ${this.data.scale.z}`);
    this.icon.classList.add('clickable');
    el.appendChild(this.icon);

    // ----- Ring Around Icon -----
    this.ring = document.createElement('a-ring');
    this.ring.setAttribute('radius-inner', this.data.ringInner);
    this.ring.setAttribute('radius-outer', this.data.ringOuter);
    this.ring.setAttribute('material', `color: ${this.data.ringColor}; opacity: ${this.data.ringOpacity}; side: double; shader: flat`);
    this.ring.object3D.position.set(0, 0, 0); 
    el.appendChild(this.ring);

    // ----- Tooltip Panel -----
    this.tooltip = document.createElement('a-entity');
    this.tooltip.setAttribute('visible', false);

    // Background panel
    const bg = document.createElement('a-plane');
    bg.setAttribute('width', this.data.textWidth + this.data.panelPadding);
    bg.setAttribute('height', this.data.panelHeight);
    bg.setAttribute('material', { color: '#fff', opacity: 0.9 });
    bg.object3D.position.set(0, 0, 0);
    this.tooltip.appendChild(bg);

    // Text
    const text = document.createElement('a-entity');
    text.setAttribute('text', {
      value: this.data.text,
      align: 'center',
      color: '#000',
      width: this.data.textWidth,
      wrapCount: 24
    });
    text.object3D.position.set(0, 0, 0.01);
    this.tooltip.appendChild(text);

    // Position above the icon
    this.tooltip.object3D.position.set(0, this.data.panelOffsetY, 0);
    el.appendChild(this.tooltip);

    // ----- Hover Events -----
    el.addEventListener('raycaster-intersected', () => {
      this.tooltip.setAttribute('visible', true);
      this.markVisited();
    });
    el.addEventListener('raycaster-intersected-cleared', () => {
      this.tooltip.setAttribute('visible', false);
    });
  },

  tick: function () {
    if (!this.camera) return;
    // Ring and panel face camera
    this.ring.object3D.lookAt(this.camera.object3D.position);
    this.tooltip.object3D.lookAt(this.camera.object3D.position);
  },

  markVisited: function () {
    // Example: add to visited spots
    if (!window.visitedSpots) window.visitedSpots = new Set();
    window.visitedSpots.add(this.data.text);
  }
});
