AFRAME.registerComponent('infoicon', {
  schema: {
    text: { type: 'string' },
    model: { type: 'selector' }   // GLB model reference
  },

  init: function () {
    const el = this.el;

    /* --------------------------------------------------
        1. Create ICON MODEL
    -------------------------------------------------- */
    const icon = document.createElement('a-entity');
    icon.setAttribute('gltf-model', this.data.model.getAttribute('src'));
    icon.setAttribute('scale', '0.4 0.4 0.4');
    icon.setAttribute('look-at', '#cam');
    icon.classList.add('clickable');

    el.appendChild(icon);

    /* --------------------------------------------------
        2. Create INFO PANEL
    -------------------------------------------------- */
    const panel = document.createElement('a-plane');
    panel.setAttribute('color', '#faaf52');
    panel.setAttribute('width', 2.5);
    panel.setAttribute('height', 1);
    panel.setAttribute('position', '0 1 0');
    panel.setAttribute('visible', false);
    panel.classList.add('clickable');

    const text = document.createElement('a-text');
    text.setAttribute('value', this.data.text);
    text.setAttribute('color', 'black');
    text.setAttribute('width', 4);
    text.setAttribute('position', '-1.2 1.1 0');
    text.setAttribute('visible', false);

    el.appendChild(panel);
    el.appendChild(text);

    /* --------------------------------------------------
        3. BEHAVIOR
    -------------------------------------------------- */

    // Show panel, hide icon
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.setAttribute('visible', true);
      text.setAttribute('visible', true);
      icon.setAttribute('visible', true);   // still visible, but we dim it
      icon.setAttribute('scale', '0 0 0');  // hide icon
    });

    // Hide panel, show icon again
    panel.addEventListener('mouseleave', () => {
      panel.setAttribute('visible', false);
      text.setAttribute('visible', false);
      icon.setAttribute('scale', '0.4 0.4 0.4');   // restore icon
      icon.setAttribute('visible', true);
    });
  }
});