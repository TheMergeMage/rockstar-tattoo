/* artist-tempt.js — Tempt's portfolio gallery */

var temptImages = [
  { src: 'assets/images/Artist-Tempt/Tempt_Daisy_Anchor.jpg', alt: 'Daisy anchor tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Hummingbird_before-and-after.jpg', alt: 'Hummingbird tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Aries.jpg', alt: 'Aries zodiac tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Colored_Garden.jpg', alt: 'Colored garden tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Peonies.jpg', alt: 'Peonies tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Koi.jpg', alt: 'Koi fish tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Skulls.jpg', alt: 'Skulls tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt_Snake_Sleeve.jpg', alt: 'Snake sleeve tattoo by Tempt' },
  { src: 'assets/images/Artist-Tempt/Tempt+3_pic_sleeve.jpg', alt: 'Multi-image sleeve tattoo by Tempt' },
];

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    /* Build grid items */
    temptImages.forEach(function (img) {
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'gallery-item glightbox';
      a.dataset.gallery = 'artist-tempt';
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
