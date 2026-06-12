/* gallery.js - gallery filters, URL state, and GLightbox initialization */

(function () {
  var state = {
    artist: 'all',
    style: 'all',
  };

  function normalizeArtist(value) {
    return value && (value === 'all' || artistDisplayNames[value]) ? value : 'all';
  }

  function normalizeStyle(value) {
    return value && styleDisplayNames[value] ? value : 'all';
  }

  function getFilteredImages() {
    return galleryImages.filter(function (img) {
      var artistMatch = state.artist === 'all' || img.artist === state.artist;
      var styleMatch = state.style === 'all' || img.style === state.style;
      return artistMatch && styleMatch;
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
        className: 'gallery-item glightbox ' + settings.lightboxClass,
        galleryName: settings.galleryName,
        showMeta: true,
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

  function updateCounts() {
    var counts = getGalleryFilterCounts(galleryImages);

    document.querySelectorAll('.artist-filter-btn').forEach(function (btn) {
      var artist = btn.dataset.artist;
      var count = counts.artists[artist] || 0;
      btn.querySelector('.filter-count').textContent = String(count);
    });

    document.querySelectorAll('.style-filter-btn').forEach(function (btn) {
      var style = btn.dataset.filter;
      var count = counts.styles[style] || 0;
      btn.querySelector('.filter-count').textContent = String(count);
    });
  }

  function renderSummary() {
    var summary = document.getElementById('gallery-filter-summary');
    var clear = document.getElementById('gallery-clear-filters');
    if (!summary || !clear) return;

    var parts = [];
    if (state.artist !== 'all') parts.push(artistDisplayNames[state.artist]);
    if (state.style !== 'all') parts.push(getStyleDisplayName(state.style));

    summary.textContent = parts.length ? 'Showing ' + parts.join(' / ') + ' work' : 'Showing all artwork';
    clear.hidden = state.artist === 'all' && state.style === 'all';
  }

  function updateUrl() {
    var params = new URLSearchParams(window.location.search);

    if (state.artist === 'all') params.delete('artist');
    else params.set('artist', state.artist);

    if (state.style === 'all') params.delete('style');
    else params.set('style', state.style);

    var next = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', next);
  }

  function renderGallery(grid) {
    var filtered = getFilteredImages();
    grid.classList.toggle('is-filter-all', state.artist === 'all' && state.style === 'all');
    grid.classList.toggle('is-filtered', state.artist !== 'all' || state.style !== 'all');
    grid.dataset.activeArtist = state.artist;
    grid.dataset.activeStyle = state.style;
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
        state.style = 'all';
        applyState(grid, true);
      });
      return;
    }

    if (state.artist === 'all' && state.style === 'all') {
      grid.appendChild(buildGallerySection('Artist Showcase', getShowcaseImages(), {
        section: 'showcase',
        lightboxClass: 'gallery-lightbox-showcase',
        galleryName: 'gallery-showcase',
      }));
    }

    artistDisplayOrder.forEach(function (artist) {
      var images = filtered.filter(function (img) { return img.artist === artist; });
      if (!images.length) return;

      grid.appendChild(buildGallerySection(artistDisplayNames[artist], images, {
        section: 'artist',
        artist: artist,
        lightboxClass: 'gallery-lightbox-' + artist,
        galleryName: 'gallery-' + artist,
      }));
    });

    initImageLightbox('.gallery-lightbox-showcase');
    artistDisplayOrder.forEach(function (artist) {
      initImageLightbox('.gallery-lightbox-' + artist);
    });
  }

  function applyState(grid, shouldUpdateUrl) {
    setActiveFilter(document.querySelectorAll('.artist-filter-btn'), state.artist, 'data-artist');
    setActiveFilter(document.querySelectorAll('.style-filter-btn'), state.style, 'data-filter');
    renderSummary();
    renderGallery(grid);
    if (shouldUpdateUrl) updateUrl();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    var params = new URLSearchParams(window.location.search);
    state.artist = normalizeArtist(params.get('artist'));
    state.style = normalizeStyle(params.get('style'));

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      var count = document.createElement('span');
      count.className = 'filter-count';
      count.setAttribute('aria-hidden', 'true');
      count.textContent = '0';
      btn.appendChild(count);
    });

    updateCounts();

    document.querySelectorAll('.artist-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.artist = normalizeArtist(btn.dataset.artist);
        applyState(grid, true);
      });
    });

    document.querySelectorAll('.style-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.style = normalizeStyle(btn.dataset.filter);
        applyState(grid, true);
      });
    });

    var clear = document.getElementById('gallery-clear-filters');
    if (clear) {
      clear.addEventListener('click', function () {
        state.artist = 'all';
        state.style = 'all';
        applyState(grid, true);
      });
    }

    applyState(grid, false);
  });
})();
