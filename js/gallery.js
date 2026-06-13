/* gallery.js - gallery filters, URL state, and GLightbox initialization */

(function () {
  var state = {
    artist: 'all',
  };
  var galleryLightbox = null;

  function normalizeArtist(value) {
    return value && (value === 'all' || artistDisplayNames[value]) ? value : 'all';
  }

  function getFilteredImages() {
    return galleryImages.filter(function (img) {
      return state.artist === 'all' || img.artist === state.artist;
    });
  }

  function buildGallerySection(title, images, options) {
    var settings = options || {};
    var section = document.createElement('section');
    section.className = 'gallery-section';
    section.dataset.section = settings.section || '';

    if (settings.artist) section.dataset.artist = settings.artist;

    var heading = document.createElement('h2');
    heading.className = 'gallery-section-title';
    heading.textContent = title;

    var grid = document.createElement('div');
    grid.className = 'gallery-section-grid';

    images.forEach(function (img) {
      grid.appendChild(createGalleryLink(img, {
        className: 'gallery-item glightbox gallery-lightbox',
        galleryName: settings.galleryName,
        contextLabel: settings.contextLabel,
      }));
    });

    section.appendChild(heading);
    section.appendChild(grid);
    return section;
  }

  function setActiveFilter(filterBtns, activeValue, attrName) {
    filterBtns.forEach(function (btn) {
      var isActive = btn.getAttribute(attrName) === activeValue;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function renderSummary() {
    var summary = document.getElementById('gallery-filter-summary');
    var clear = document.getElementById('gallery-clear-filters');
    if (!summary || !clear) return;

    summary.textContent = state.artist !== 'all'
      ? 'Showing ' + artistDisplayNames[state.artist] + ' work'
      : 'Showing all artwork';
    clear.hidden = state.artist === 'all';
  }

  function updateUrl() {
    var params = new URLSearchParams(window.location.search);

    if (state.artist === 'all') params.delete('artist');
    else params.set('artist', state.artist);

    params.delete('style');

    var next = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', next);
  }

  function renderGallery(grid) {
    var filtered = getFilteredImages();
    if (galleryLightbox && typeof galleryLightbox.destroy === 'function') {
      galleryLightbox.destroy();
    }
    galleryLightbox = null;

    grid.classList.toggle('is-filter-all', state.artist === 'all');
    grid.classList.toggle('is-filter-artist', state.artist !== 'all');
    grid.classList.toggle('is-filtered', state.artist !== 'all');
    grid.dataset.activeArtist = state.artist;
    grid.innerHTML = '';

    if (!filtered.length) {
      var empty = document.createElement('div');
      empty.className = 'gallery-empty';
      empty.innerHTML =
        '<h2>No pieces match this filter.</h2>' +
        '<p>Try another artist or style, or view the full gallery.</p>' +
        '<button type="button" class="btn-secondary" id="gallery-empty-reset">View All Work</button>';
      grid.appendChild(empty);
      var reset = document.getElementById('gallery-empty-reset');
      if (reset) reset.addEventListener('click', function () {
        state.artist = 'all';
        applyState(grid, true);
      });
      return;
    }

    if (state.artist === 'all') {
      grid.appendChild(buildGallerySection('Artist Showcase', getShowcaseImages(), {
        section: 'showcase',
        galleryName: 'gallery-all',
        contextLabel: 'Showcase',
      }));
    }

    artistDisplayOrder.forEach(function (artist) {
      var images = filtered.filter(function (img) { return img.artist === artist; });
      if (!images.length) return;

      grid.appendChild(buildGallerySection(artistDisplayNames[artist], images, {
        section: 'artist',
        artist: artist,
        galleryName: 'gallery-all',
        contextLabel: artistDisplayNames[artist],
      }));
    });

    galleryLightbox = initImageLightbox('.gallery-lightbox', {
      contextBadge: true,
    });
  }

  function applyState(grid, shouldUpdateUrl) {
    setActiveFilter(document.querySelectorAll('.artist-filter-btn'), state.artist, 'data-artist');
    renderSummary();
    renderGallery(grid);
    if (shouldUpdateUrl) updateUrl();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    var params = new URLSearchParams(window.location.search);
    state.artist = normalizeArtist(params.get('artist'));
    grid.classList.add('gallery-section-list');

    document.querySelectorAll('.artist-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.artist = normalizeArtist(btn.dataset.artist);
        applyState(grid, true);
      });
    });

    var clear = document.getElementById('gallery-clear-filters');
    if (clear) {
      clear.addEventListener('click', function () {
        state.artist = 'all';
        applyState(grid, true);
      });
    }

    applyState(grid, false);
  });
})();
