/* gallery.js - gallery filters, URL state, and GLightbox initialization */

(function () {
  var state = {
    artist: 'all',
    style: 'all',
  };
  var galleryLightbox = null;

  function normalizeArtist(value) {
    return value && (value === 'all' || artistDisplayNames[value]) ? value : 'all';
  }

  function normalizeStyle(value) {
    if (!value || value === 'all') return 'all';

    return galleryImages.some(function (img) { return img.style === value; }) ? value : 'all';
  }

  function getStyleDisplayName(style) {
    return typeof styleDisplayNames !== 'undefined' && styleDisplayNames[style]
      ? styleDisplayNames[style]
      : style;
  }

  function getFilteredImages() {
    return galleryImages.filter(function (img) {
      var matchesArtist = state.artist === 'all' || img.artist === state.artist;
      var matchesStyle = state.style === 'all' || img.style === state.style;
      return matchesArtist && matchesStyle;
    });
  }

  function buildFilterButton(label, className, attrName, value) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute(attrName, value);
    button.setAttribute('aria-pressed', 'false');
    button.textContent = label;
    return button;
  }

  function renderArtistFilters() {
    var bar = document.querySelector('[data-gallery-artist-filters]');
    if (!bar) return;

    bar.innerHTML = '';
    bar.appendChild(buildFilterButton('All', 'filter-btn artist-filter-btn', 'data-artist', 'all'));

    artistDisplayOrder.forEach(function (artist) {
      if (!getGalleryImagesByArtist(artist).length) return;
      bar.appendChild(buildFilterButton(
        artistDisplayNames[artist],
        'filter-btn artist-filter-btn',
        'data-artist',
        artist
      ));
    });
  }

  function renderStyleFilters() {
    var bar = document.querySelector('[data-gallery-style-filters]');
    if (!bar || typeof getGalleryStyles !== 'function') return;

    var styles = getGalleryStyles();
    bar.innerHTML = '';
    bar.hidden = styles.length <= 1;

    if (bar.hidden) return;

    bar.appendChild(buildFilterButton('All Styles', 'filter-btn style-filter-btn', 'data-style', 'all'));

    styles.forEach(function (style) {
      bar.appendChild(buildFilterButton(
        getStyleDisplayName(style),
        'filter-btn style-filter-btn',
        'data-style',
        style
      ));
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
      var contextLabel = typeof settings.contextLabel === 'function'
        ? settings.contextLabel(img)
        : settings.contextLabel;

      grid.appendChild(createGalleryLink(img, {
        className: 'gallery-item glightbox gallery-lightbox',
        galleryName: settings.galleryName,
        contextLabel: contextLabel,
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

    var artistLabel = state.artist !== 'all' ? artistDisplayNames[state.artist] : '';
    var styleLabel = state.style !== 'all' ? getStyleDisplayName(state.style) : '';

    if (artistLabel && styleLabel) {
      summary.textContent = 'Showing ' + artistLabel + ' ' + styleLabel + ' work';
    } else if (artistLabel) {
      summary.textContent = 'Showing ' + artistLabel + ' work';
    } else if (styleLabel) {
      summary.textContent = 'Showing ' + styleLabel + ' artwork';
    } else {
      summary.textContent = 'Showing all artwork';
    }

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
        contextLabel: function (img) {
          return img.artistName || artistDisplayNames[img.artist] || '';
        },
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
    setActiveFilter(document.querySelectorAll('.style-filter-btn'), state.style, 'data-style');
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
    grid.classList.add('gallery-section-list');
    renderArtistFilters();
    renderStyleFilters();

    var artistFilters = document.querySelector('[data-gallery-artist-filters]');
    if (artistFilters) {
      artistFilters.addEventListener('click', function (event) {
        var btn = event.target.closest('.artist-filter-btn');
        if (btn) {
          state.artist = normalizeArtist(btn.dataset.artist);
          applyState(grid, true);
        }
      });
    }

    var styleFilters = document.querySelector('[data-gallery-style-filters]');
    if (styleFilters) {
      styleFilters.addEventListener('click', function (event) {
        var btn = event.target.closest('.style-filter-btn');
        if (btn) {
          state.style = normalizeStyle(btn.dataset.style);
          applyState(grid, true);
        }
      });
    }

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
