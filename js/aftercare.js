/* aftercare.js - tattoo/piercing tabs plus scan-friendly section controls */

(function () {
  var validTypes = {
    tattoo: true,
    piercing: true,
  };

  function normalizeType(value) {
    if (validTypes[value]) return value;
    return 'tattoo';
  }

  function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function buildAccordionSections(panel) {
    if (!panel || panel.dataset.enhanced === 'true') return;

    var children = Array.prototype.slice.call(panel.children);
    var rebuilt = document.createDocumentFragment();
    var currentSection = null;
    var currentBody = null;
    var sectionIndex = 0;

    children.forEach(function (child) {
      if (child.tagName && child.tagName.toLowerCase() === 'h3') {
        sectionIndex += 1;
        var title = child.textContent;
        var sectionId = panel.dataset.aftercarePanel + '-' + slugify(title);
        var bodyId = sectionId + '-body';
        currentSection = document.createElement('section');
        currentSection.className = 'aftercare-topic' + (sectionIndex === 1 ? ' is-open' : '');
        currentSection.id = sectionId;

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'aftercare-topic-toggle';
        button.setAttribute('aria-expanded', sectionIndex === 1 ? 'true' : 'false');
        button.setAttribute('aria-controls', bodyId);
        button.textContent = title;

        currentBody = document.createElement('div');
        currentBody.className = 'aftercare-topic-body';
        currentBody.id = bodyId;

        currentSection.appendChild(button);
        currentSection.appendChild(currentBody);
        rebuilt.appendChild(currentSection);
        return;
      }

      if (currentBody) {
        currentBody.appendChild(child);
      } else {
        rebuilt.appendChild(child);
      }
    });

    panel.innerHTML = '';
    panel.appendChild(rebuilt);
    panel.dataset.enhanced = 'true';

    panel.querySelectorAll('.aftercare-topic-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        var topic = button.closest('.aftercare-topic');
        var isOpen = topic.classList.toggle('is-open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  function updateSectionNav(activeType) {
    var nav = document.getElementById('aftercare-section-nav');
    var panel = document.querySelector('[data-aftercare-panel="' + activeType + '"]');
    if (!nav || !panel) return;

    nav.innerHTML = '';
    panel.querySelectorAll('.aftercare-topic').forEach(function (topic) {
      var button = topic.querySelector('.aftercare-topic-toggle');
      if (!button) return;
      var link = document.createElement('a');
      link.href = '#' + topic.id;
      link.textContent = button.textContent;
      nav.appendChild(link);
    });
  }

  function restartPanelFade(panel) {
    if (!panel) return;
    panel.classList.remove('is-fading-in');
    void panel.offsetWidth;
    panel.classList.add('is-fading-in');
    window.setTimeout(function () {
      if (!panel.hidden) panel.classList.remove('is-fading-in');
    }, 1000);
  }

  function updateState(type, options) {
    var activeType = normalizeType(type);
    var buttons = document.querySelectorAll('[data-aftercare-target]');
    var panels = document.querySelectorAll('[data-aftercare-panel]');
    var activePanel = null;

    buttons.forEach(function (button) {
      var isActive = button.getAttribute('data-aftercare-target') === activeType;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var isActivePanel = panel.getAttribute('data-aftercare-panel') === activeType;
      panel.hidden = !isActivePanel;
      if (isActivePanel) activePanel = panel;
      else panel.classList.remove('is-fading-in');
    });

    restartPanelFade(activePanel);
    updateSectionNav(activeType);
    document.title = (activeType === 'piercing' ? 'Piercing Aftercare' : 'Tattoo Aftercare') + ' | Rockstar Tattoo';

    if (!options || !options.skipUrlUpdate) {
      var nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('type', activeType);
      window.history.replaceState({}, '', nextUrl.toString());
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initialType = normalizeType(new URLSearchParams(window.location.search).get('type'));
    document.querySelectorAll('[data-aftercare-panel]').forEach(buildAccordionSections);

    document.querySelectorAll('[data-aftercare-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        updateState(button.getAttribute('data-aftercare-target'));
      });
    });

    var printButton = document.getElementById('aftercare-print');
    if (printButton) {
      printButton.addEventListener('click', function () {
        window.print();
      });
    }

    updateState(initialType, { skipUrlUpdate: true });
  });
})();
