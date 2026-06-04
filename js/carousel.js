/* carousel.js — Swiper.js initialization for homepage image carousel */

var carouselSlides = [
  {
    src: 'https://placehold.co/1200x700/1a1a1a/666666?text=Tattoo+Artwork+1',
    alt: 'Tattoo artwork showcase 1 of 4',
  },
  {
    src: 'https://placehold.co/1200x700/1a1a1a/666666?text=Tattoo+Artwork+2',
    alt: 'Tattoo artwork showcase 2 of 4',
  },
  {
    src: 'https://placehold.co/1200x700/1a1a1a/666666?text=Tattoo+Artwork+3',
    alt: 'Tattoo artwork showcase 3 of 4',
  },
  {
    src: 'https://placehold.co/1200x700/1a1a1a/666666?text=Tattoo+Artwork+4',
    alt: 'Tattoo artwork showcase 4 of 4',
  },
];

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    /* Build slides */
    carouselSlides.forEach(function (slide, i) {
      var div = document.createElement('div');
      div.className = 'swiper-slide';
      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.alt;
      img.loading = i === 0 ? 'eager' : 'lazy';
      div.appendChild(img);
      wrapper.appendChild(div);
    });

    /* Respect prefers-reduced-motion */
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Init Swiper */
    if (typeof Swiper !== 'undefined') {
      new Swiper('.swiper', {
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
  });
})();
