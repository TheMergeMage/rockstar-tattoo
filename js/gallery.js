/* gallery.js — Photo grid filter + GLightbox initialization */

var galleryImages = [
  { src: 'assets/images/homepage-gallery/Tempt_Daisy_Anchor.jpg', alt: 'Daisy anchor tattoo with traditional styling', style: 'traditional' },
  { src: 'assets/images/homepage-gallery/Tempt_Hummingbird_before-and-after.jpg', alt: 'Hummingbird tattoo with realistic detail and shading', style: 'realism' },
  { src: 'assets/images/homepage-gallery/Tempt_Aries.jpg', alt: 'Aries zodiac geometric pattern tattoo', style: 'geometric' },
  { src: 'assets/images/homepage-gallery/Tempt_Skulls.jpg', alt: 'Black and grey skull tattoo artwork', style: 'black-grey' },
  { src: 'assets/images/homepage-gallery/Tempt_Colored_Garden.jpg', alt: 'Full color garden flower tattoo design', style: 'color' },
  { src: 'assets/images/homepage-gallery/Tempt_Peonies.jpg', alt: 'Colorful peony flower tattoo', style: 'color' },
  { src: 'assets/images/homepage-gallery/Tempt_Koi.jpg', alt: 'Traditional Japanese koi fish tattoo', style: 'traditional' },
  { src: 'assets/images/homepage-gallery/Tempt_Snake_Sleeve.jpg', alt: 'Black and grey snake sleeve tattoo', style: 'black-grey' },
  { src: 'assets/images/homepage-gallery/Tempt+3_pic_sleeve.jpg', alt: 'Multi-image sleeve tattoo collection', style: 'geometric' },
];

function filterImages(images, style) {
  if (style === 'all') return images.slice();
  return images.filter(function (img) { return img.style === style; });
}

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    /* Build grid items */
    galleryImages.forEach(function (img) {
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'gallery-item glightbox';
      a.dataset.style = img.style;
      a.dataset.gallery = 'gallery-main';
      a.setAttribute('data-glightbox', 'description: ' + img.alt);

      var image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.loading = 'lazy';

      a.appendChild(image);
      grid.appendChild(a);
    });

    /* Filter buttons */
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var style = btn.dataset.filter;

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var filtered = filterImages(galleryImages, style);
        var filteredSrcs = filtered.map(function (i) { return i.src; });

        grid.querySelectorAll('.gallery-item').forEach(function (item) {
          var img = item.querySelector('img');
          if (style === 'all' || filteredSrcs.indexOf(img.src) !== -1) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
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
