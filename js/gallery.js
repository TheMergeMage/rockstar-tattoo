/* gallery.js - main photo grid artist filter + GLightbox initialization */

(function () {
  function buildGalleryItem(img) {
    var a = document.createElement('a');
    a.href = img.src;
    a.className = 'gallery-item glightbox';
    a.dataset.artist = img.artist;
    a.dataset.style = img.style;
    a.dataset.gallery = 'gallery-main';
    a.setAttribute('data-glightbox', 'description: ' + img.alt);

    var image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.loading = 'lazy';

    a.appendChild(image);
    return a;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    galleryImages.forEach(function (img) {
      grid.appendChild(buildGalleryItem(img));
    });

    var filterBtns = document.querySelectorAll('.artist-filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var artist = btn.dataset.artist;

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        grid.querySelectorAll('.gallery-item').forEach(function (item) {
          if (artist === 'all' || item.dataset.artist === artist) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });

    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
      });
    }
  });
})();
