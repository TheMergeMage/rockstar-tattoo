/* carousel.js - Swiper.js initialization for homepage gallery carousel */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.querySelector('.swiper-wrapper');
    if (!wrapper || typeof galleryImages === 'undefined') return;

    function createImageCell(item, imageIndex) {
      var cell = document.createElement('div');
      cell.className = 'carousel-slide-cell';

      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = imageIndex === 0 ? 'eager' : 'lazy';

      cell.appendChild(img);
      return cell;
    }

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

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
