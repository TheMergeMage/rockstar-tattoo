/* testimonials.js - continuous homepage testimonial ribbon */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var viewport = document.querySelector('.testimonials-viewport');
    if (!viewport) return;

    var track = viewport.querySelector('.testimonials-grid');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.testimonial-card'));
    if (cards.length < 2) return;

    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    viewport.classList.add('is-carousel-ready');
  });
})();
