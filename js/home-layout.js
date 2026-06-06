/* home-layout.js - homepage hero sizing */

(function () {
  function resizeHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var content = hero.querySelector('.hero-content');
    if (!content) return;

    var contentHeight = content.getBoundingClientRect().height;
    var originalHeroHeight = window.innerHeight;
    var emptySpace = Math.max(originalHeroHeight - contentHeight, 0);
    var targetHeight = Math.ceil(contentHeight + emptySpace * 0.2);

    hero.style.minHeight = targetHeight + 'px';
  }

  document.addEventListener('DOMContentLoaded', resizeHero);
  window.addEventListener('load', resizeHero);
  window.addEventListener('resize', resizeHero);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(resizeHero);
  }
})();
