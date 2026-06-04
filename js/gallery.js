/* gallery.js — Photo grid filter + GLightbox initialization */

var galleryImages = [
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Traditional', alt: 'Traditional American eagle tattoo, bold outlines and classic color fill', style: 'traditional' },
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Realism', alt: 'Realism portrait tattoo with fine detail shading', style: 'realism' },
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Geometric', alt: 'Geometric mandala pattern tattoo with precise linework', style: 'geometric' },
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Black+Grey', alt: 'Black and grey rose tattoo with soft shading', style: 'black-grey' },
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Color', alt: 'Full color watercolor-style butterfly tattoo', style: 'color' },
  { src: 'https://placehold.co/600x800/1a1a1a/666?text=Piercings', alt: 'Body piercing jewelry on ear with gold and silver rings', style: 'piercings' },
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
