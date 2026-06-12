/* reveal.js - restrained scroll reveal for nonessential polish */

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = document.querySelectorAll(
    '.services-section, .gallery-preview-section, .promo-tile-section, .testimonials-section, .final-cta-section, .artist-card, .artist-profile, .artist-conversion-panel, .gallery-section, .contact-detail, .contact-action-panel, .contact-map-panel, .aftercare-panel, .aftercare-help-panel, .promo-tile'
  );

  if (!targets.length) return;

  document.body.classList.add('reveal-ready');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12,
  });

  targets.forEach(function (target) {
    target.classList.add('reveal');
    observer.observe(target);
  });
})();
