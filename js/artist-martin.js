/* artist-martin.js — Martin's portfolio gallery */

var martinImages = [
  { src: 'assets/images/Artist-Martin/Martin_Skeleton.JPEG', alt: 'Skeleton tattoo by Martin' },
  { src: 'assets/images/Artist-Martin/Martin_Mini_Skull_Lady.JPEG', alt: 'Mini skull lady tattoo by Martin' },
];

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    /* Build grid items */
    martinImages.forEach(function (img) {
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'gallery-item glightbox';
      a.dataset.gallery = 'artist-martin';
      a.setAttribute('data-glightbox', 'description: ' + img.alt);

      var image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.loading = 'lazy';

      a.appendChild(image);
      grid.appendChild(a);
    });

    /* GLightbox */
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
