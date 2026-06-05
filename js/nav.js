/* nav.js — Mobile hamburger overlay */

function toggleNav(isOpen) {
  var overlay = document.getElementById('nav-overlay');
  var hamburger = document.getElementById('hamburger');
  var newOpen = !isOpen;

  if (overlay) {
    if (newOpen) {
      overlay.classList.add('nav-open');
    } else {
      overlay.classList.remove('nav-open');
    }
    overlay.setAttribute('aria-hidden', newOpen ? 'false' : 'true');
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', newOpen ? 'true' : 'false');
  }

  return {
    ariaExpanded: newOpen ? 'true' : 'false',
    hasOpenClass: newOpen,
  };
}

(function () {
  var hamburger = document.getElementById('hamburger');
  var overlay = document.getElementById('nav-overlay');
  var closeBtn = document.getElementById('nav-close');
  var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  var isOpen = false;

  function setDropdownState(dropdown, open) {
    if (!dropdown) return;
    var toggle = dropdown.querySelector('.nav-dropdown-toggle');
    dropdown.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeDropdowns() {
    document.querySelectorAll('.nav-item-dropdown.is-open').forEach(function (dropdown) {
      setDropdownState(dropdown, false);
    });
  }

  function openNav() {
    isOpen = true;
    toggleNav(false);
    closeDropdowns();
    trapFocus(overlay);
  }

  function closeNav() {
    isOpen = false;
    toggleNav(true);
    closeDropdowns();
    if (hamburger) hamburger.focus();
  }

  if (hamburger) {
    hamburger.addEventListener('click', openNav);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var dropdown = toggle.closest('.nav-item-dropdown');
      var nextOpen = !(dropdown && dropdown.classList.contains('is-open'));
      closeDropdowns();
      setDropdownState(dropdown, nextOpen);
    });
  });

  if (overlay) {
    /* Close when clicking on the backdrop (not on nav links) */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeNav();
    });

    /* Close nav links click */
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item-dropdown')) {
      closeDropdowns();
    }
  });

  /* Close on back button */
  window.addEventListener('popstate', function () {
    if (isOpen) closeNav();
  });

  /* Basic focus trap */
  function trapFocus(container) {
    var focusable = container.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    first.focus();
    container.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        closeNav();
        container.removeEventListener('keydown', handler);
        return;
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* Set copyright year */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
