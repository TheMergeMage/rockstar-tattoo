/* artist-brian.js — Brian's portfolio gallery */

var brianImages = [
  { src: 'assets/images/Artist-Brian/Brian_Lion.jpg', alt: 'Lion color tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Dragon_Star.jpg', alt: 'Dragon and star color tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Rose.jpg', alt: 'Colored rose tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Dove.jpg', alt: 'Dove tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Princess.jpg', alt: 'Princess tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Dia_de_los_Muertos.jpg', alt: 'Dia de los Muertos color tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Hummingbird.jpg', alt: 'Colored hummingbird tattoo by Brian' },
  { src: 'assets/images/Artist-Brian/Brian+Colored+Spring.jpg', alt: 'Colored spring flower tattoo by Brian' },
];

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    /* Build grid items */
    brianImages.forEach(function (img) {
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'gallery-item glightbox';
      a.dataset.gallery = 'artist-brian';
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
