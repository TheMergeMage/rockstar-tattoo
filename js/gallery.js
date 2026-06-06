/* gallery.js - main photo grid artist filter + GLightbox initialization */

(function () {
  function buildGallerySection(title, images, options) {
    var settings = options || {};
    var section = document.createElement('section');
    section.className = 'gallery-section';
    section.dataset.section = settings.section || '';

    if (settings.artist) {
      section.dataset.artist = settings.artist;
    }

    var heading = document.createElement('h2');
    heading.className = 'gallery-section-title';
    heading.textContent = title;

    var grid = document.createElement('div');
    grid.className = 'gallery-section-grid';

    images.forEach(function (img) {
      grid.appendChild(createGalleryLink(img, {
        className: 'gallery-item glightbox ' + settings.lightboxClass,
        galleryName: settings.galleryName,
      }));
    });

    section.appendChild(heading);
    section.appendChild(grid);
    return section;
  }

  function setActiveFilter(filterBtns, activeBtn) {
    filterBtns.forEach(function (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }

  function filterSections(grid, artist) {
    grid.querySelectorAll('.gallery-section').forEach(function (section) {
      section.hidden = artist !== 'all' && section.dataset.artist !== artist;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    grid.classList.add('gallery-section-list');
    grid.innerHTML = '';

    var showcaseClass = 'gallery-lightbox-showcase';
    grid.appendChild(buildGallerySection('Showcase', getShowcaseImages(), {
      section: 'showcase',
      lightboxClass: showcaseClass,
      galleryName: 'gallery-showcase',
    }));

    artistDisplayOrder.forEach(function (artist) {
      var artistClass = 'gallery-lightbox-' + artist;
      grid.appendChild(buildGallerySection(artistDisplayNames[artist], getGalleryImagesByArtist(artist), {
        section: 'artist',
        artist: artist,
        lightboxClass: artistClass,
        galleryName: 'gallery-' + artist,
      }));
    });

    initImageLightbox('.' + showcaseClass);
    artistDisplayOrder.forEach(function (artist) {
      initImageLightbox('.gallery-lightbox-' + artist);
    });

    var filterBtns = document.querySelectorAll('.artist-filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActiveFilter(filterBtns, btn);
        filterSections(grid, btn.dataset.artist);
      });
    });
  });
})();
