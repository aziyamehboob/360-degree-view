AFRAME.registerComponent('face-camera', {
  tick: function () {
    const cam = document.querySelector('#cam');
    if (!cam) return;
    this.el.object3D.lookAt(cam.object3D.position);
  }
});

AFRAME.registerComponent('infoicon', {
  schema: {
    text: { type: 'string' },
    model: { type: 'string' },
    scale: { type: 'vec3', default: {x: 0.36, y: 0.36, z: 0.36} }
  },

init: function () {
  const el = this.el;

  const icon = document.createElement('a-entity');
  icon.setAttribute('gltf-model', this.data.model);
  icon.setAttribute('scale', `${this.data.scale.x} ${this.data.scale.y} ${this.data.scale.z}`);
  icon.classList.add('clickable');
  el.appendChild(icon);

  const panel = document.createElement('a-entity');
  panel.setAttribute('mixin', 'hotspot-text');
  panel.setAttribute('text', { value: this.data.text });
  panel.setAttribute('visible', false);
  panel.setAttribute('position', '0 1.5 0');
  panel.setAttribute('face-camera', '');
  panel.classList.add('clickable');
  el.appendChild(panel);

  // Wait for model to load before adding click
  icon.addEventListener('model-loaded', () => {
    icon.addEventListener('click', () => {
      icon.setAttribute('visible', false);
      panel.setAttribute('visible', true);
    });
  });

  panel.addEventListener('click', () => {
    panel.setAttribute('visible', false);
    icon.setAttribute('visible', true);
  });
}
});