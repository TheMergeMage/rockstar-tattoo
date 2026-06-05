/* aftercare.js — Toggle tattoo and piercing aftercare content */

(function () {
  var validTypes = {
    tattoo: true,
    piercing: true,
  };

  function normalizeType(value) {
    if (validTypes[value]) return value;
    return 'tattoo';
  }

  function updateState(type, options) {
    var activeType = normalizeType(type);
    var buttons = document.querySelectorAll('[data-aftercare-target]');
    var panels = document.querySelectorAll('[data-aftercare-panel]');

    buttons.forEach(function (button) {
      var isActive = button.getAttribute('data-aftercare-target') === activeType;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var isActivePanel = panel.getAttribute('data-aftercare-panel') === activeType;
      panel.hidden = !isActivePanel;
    });

    document.title = (activeType === 'piercing' ? 'Piercing Aftercare' : 'Tattoo Aftercare') + ' | Rockstar Tattoo';

    if (!options || !options.skipUrlUpdate) {
      var nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('type', activeType);
      window.history.replaceState({}, '', nextUrl.toString());
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initialType = normalizeType(new URLSearchParams(window.location.search).get('type'));

    document.querySelectorAll('[data-aftercare-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        updateState(button.getAttribute('data-aftercare-target'));
      });
    });

    updateState(initialType, { skipUrlUpdate: true });
  });
})();
