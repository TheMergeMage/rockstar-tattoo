/* home-gallery.js - homepage preview from the shared gallery source */

(function () {
  function ensureCtaSlide() {
    var existing = document.getElementById('homepage-gallery-cta-slide');
    if (existing) return existing;

    var slide = document.createElement('div');
    slide.id = 'homepage-gallery-cta-slide';
    slide.style.display = 'none';
    slide.innerHTML = '<div class="homepage-lightbox-cta"><a href="gallery.html" class="btn-secondary">See Full Gallery &rarr;</a></div>';
    document.body.appendChild(slide);
    return slide;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.gallery-preview-grid');
    if (!grid || typeof galleryImages === 'undefined') return;

    var homepageImages = getHomepageGalleryImages();
    grid.innerHTML = '';

    homepageImages.forEach(function (img) {
      grid.appendChild(createGalleryLink(img, {
        className: 'homepage-gallery-item homepage-preview-lightbox',
        galleryName: 'homepage-preview',
      }));
    });

    ensureCtaSlide();

    var ctaAnchor = document.createElement('a');
    ctaAnchor.href = '#homepage-gallery-cta-slide';
    ctaAnchor.className = 'homepage-preview-lightbox';
    ctaAnchor.dataset.gallery = 'homepage-preview';
    ctaAnchor.dataset.type = 'inline';
    ctaAnchor.hidden = true;
    ctaAnchor.tabIndex = -1;
    ctaAnchor.setAttribute('aria-hidden', 'true');
    grid.appendChild(ctaAnchor);

    initImageLightbox('.homepage-preview-lightbox');
  });
})();
