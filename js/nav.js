/* nav.js - shared navigation, mobile actions, and footer year */

function toggleNav(isOpen) {
  var overlay = document.getElementById('nav-overlay');
  var hamburger = document.getElementById('hamburger');
  var newOpen = !isOpen;

  if (overlay) {
    overlay.classList.toggle('nav-open', newOpen);
    overlay.setAttribute('aria-hidden', newOpen ? 'false' : 'true');
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', newOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', newOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  document.body.classList.toggle('has-nav-open', newOpen);

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
  var navOpen = false;
  var lastFocused = null;
  var inertTargets = [];

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

  function getFocusable(container) {
    if (!container) return [];
    return Array.prototype.slice.call(container.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      var rect = el.getBoundingClientRect();
      var style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });
  }

  function setBackgroundInert(isInert) {
    inertTargets.forEach(function (el) {
      if (!el) return;
      if (isInert) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }

  function handleOverlayKeydown(e) {
    if (!navOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeNav();
      return;
    }

    if (e.key !== 'Tab') return;

    var focusable = getFocusable(overlay);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (!overlay.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (document.activeElement === overlay) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function focusNavStart() {
    var focusTarget = closeBtn || overlay;
    if (!focusTarget) return;

    if (focusTarget === overlay && !overlay.hasAttribute('tabindex')) {
      overlay.setAttribute('tabindex', '-1');
    }

    focusTarget.focus({ preventScroll: true });

    if (document.activeElement !== focusTarget) {
      focusTarget.focus();
    }
  }

  function lockBackgroundIfFocused() {
    if (overlay && overlay.contains(document.activeElement)) {
      setBackgroundInert(true);
    }
  }

  function openNav() {
    if (navOpen) return;
    navOpen = true;
    lastFocused = document.activeElement;
    toggleNav(false);
    closeDropdowns();
    document.addEventListener('keydown', handleOverlayKeydown);
    focusNavStart();
    lockBackgroundIfFocused();

    window.requestAnimationFrame(function () {
      if (!overlay.contains(document.activeElement)) {
        focusNavStart();
      }
      lockBackgroundIfFocused();
    });

    [80, 180].forEach(function (delay) {
      window.setTimeout(function () {
        if (!overlay.contains(document.activeElement)) {
          focusNavStart();
        }
        lockBackgroundIfFocused();
      }, delay);
    });
  }

  function closeNav() {
    if (!navOpen) return;
    navOpen = false;
    toggleNav(true);
    closeDropdowns();
    setBackgroundInert(false);
    document.removeEventListener('keydown', handleOverlayKeydown);

    var returnTarget = lastFocused && document.contains(lastFocused) ? lastFocused : hamburger;
    if (returnTarget && typeof returnTarget.focus === 'function') {
      returnTarget.focus();
    }
  }

  function injectMobileActions() {
    if (document.querySelector('.mobile-action-bar')) return;

    var bar = document.createElement('nav');
    bar.className = 'mobile-action-bar';
    bar.setAttribute('aria-label', 'Quick actions');

    var actions = [
      {
        label: 'Call',
        href: 'tel:7027499914',
        primary: true,
        icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z"></path>'
      },
      {
        label: 'Directions',
        href: 'https://www.google.com/maps/dir/?api=1&destination=450%20Fremont%20Suite%20109%2C%20Las%20Vegas%2C%20NV%2089101',
        icon: '<path d="M12 21s7-5.33 7-12A7 7 0 0 0 5 9c0 6.67 7 12 7 12z"></path><circle cx="12" cy="9" r="2.4"></circle>'
      },
      {
        label: 'Gallery',
        href: 'gallery.html',
        icon: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path>'
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/rckstrta2/',
        external: true,
        icon: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle>'
      }
    ];

    actions.forEach(function (action) {
      var link = document.createElement('a');
      link.className = 'mobile-action-link' + (action.primary ? ' is-primary' : '');
      link.href = action.href;
      link.setAttribute('aria-label', action.label);
      if (action.external) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
      link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + action.icon + '</svg><span>' + action.label + '</span>';
      bar.appendChild(link);
    });

    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-action-bar');
  }

  function updateHeaderState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    header.classList.toggle('is-compact', window.scrollY > 24);
  }

  if (overlay) {
    overlay.setAttribute('aria-modal', 'true');
    inertTargets = Array.prototype.slice.call(document.body.children).filter(function (el) {
      return el !== overlay && !el.classList.contains('mobile-action-bar');
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeNav();
    });

    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (navOpen) closeNav();
      else openNav();
    });
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

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item-dropdown')) {
      closeDropdowns();
    }
  });

  window.addEventListener('popstate', function () {
    if (navOpen) closeNav();
  });

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
  injectMobileActions();

  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
