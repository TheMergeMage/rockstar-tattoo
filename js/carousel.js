/* carousel.js - Swiper.js initialization for homepage gallery carousel */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.querySelector('.swiper-wrapper');
    if (!wrapper || typeof galleryImages === 'undefined') return;

    var swiper = null;
    var carouselLightbox = null;
    var autoplayWasRunning = false;

    function syncCarouselToImage(imageIndex) {
      if (!swiper || typeof imageIndex !== 'number') return;

      var slideIndex = Math.floor(imageIndex / 4);
      if (swiper.params && swiper.params.loop && typeof swiper.slideToLoop === 'function') {
        swiper.slideToLoop(slideIndex);
      } else if (typeof swiper.slideTo === 'function') {
        swiper.slideTo(slideIndex);
      }
    }

    function getLightboxIndex(eventData, lightbox) {
      if (eventData && eventData.current && typeof eventData.current.index === 'number') {
        return eventData.current.index;
      }

      if (lightbox && typeof lightbox.index === 'number') {
        return lightbox.index;
      }

      return null;
    }

    function createImageCell(item, imageIndex) {
      var cell = createGalleryLink(item, {
        className: 'carousel-slide-cell carousel-lightbox',
        galleryName: 'homepage-carousel',
        imageIndex: imageIndex,
        loading: imageIndex === 0 ? 'eager' : 'lazy',
      });

      cell.addEventListener('click', function () {
        syncCarouselToImage(imageIndex);
      });

      return cell;
    }

    function initCarouselLightbox() {
      if (typeof GLightbox === 'undefined') return null;

      return GLightbox({
        elements: galleryImages.map(function (img) {
          return {
            href: img.src,
            type: 'image',
          };
        }),
        touchNavigation: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
        loop: true,
      });
    }

    wrapper.innerHTML = '';

    for (var start = 0; start < galleryImages.length; start += 4) {
      var group = galleryImages.slice(start, start + 4);
      var div = document.createElement('div');
      div.className = 'swiper-slide';

      var grid = document.createElement('div');
      grid.className = 'carousel-slide-grid';
      grid.dataset.count = String(group.length);

      group.forEach(function (item, index) {
        grid.appendChild(createImageCell(item, start + index));
      });

      div.appendChild(grid);
      wrapper.appendChild(div);
    }

    carouselLightbox = initCarouselLightbox();

    wrapper.addEventListener('click', function (event) {
      var trigger = event.target.closest('.carousel-lightbox');
      if (!trigger || !carouselLightbox) return;

      event.preventDefault();
      var imageIndex = Number(trigger.dataset.imageIndex);
      if (!Number.isNaN(imageIndex)) {
        syncCarouselToImage(imageIndex);
        carouselLightbox.openAt(imageIndex);
      }
    });

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof Swiper !== 'undefined') {
      swiper = new Swiper('.swiper', {
        loop: true,
        grabCursor: true,
        keyboard: { enabled: true },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: reducedMotion ? false : {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        a11y: {
          prevSlideMessage: 'Previous tattoo image',
          nextSlideMessage: 'Next tattoo image',
        },
      });
    }

    if (carouselLightbox) {
      carouselLightbox.on('open', function () {
        autoplayWasRunning = Boolean(swiper && swiper.autoplay && swiper.autoplay.running);
        if (swiper && swiper.autoplay) swiper.autoplay.stop();
      });

      carouselLightbox.on('slide_changed', function (eventData) {
        var imageIndex = getLightboxIndex(eventData, carouselLightbox);
        if (imageIndex !== null) syncCarouselToImage(imageIndex);
      });

      carouselLightbox.on('close', function () {
        if (autoplayWasRunning && swiper && swiper.autoplay && !reducedMotion) {
          swiper.autoplay.start();
        }
      });
    }
  });
})();
