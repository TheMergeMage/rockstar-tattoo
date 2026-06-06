/* home-gallery.js - homepage preview from the shared gallery source */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.gallery-preview-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    grid.innerHTML = '';
    galleryImages.slice(0, 6).forEach(function (img) {
      var image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.loading = 'lazy';
      grid.appendChild(image);
    });
  });
})();
