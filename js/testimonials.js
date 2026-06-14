/* testimonials.js - continuous homepage testimonial ribbon */

(function () {
  var DESKTOP_MATCH_SPEED = 51; // px/sec, matching the previous full-size desktop pace.

  document.addEventListener('DOMContentLoaded', function () {
    var viewport = document.querySelector('.testimonials-viewport');
    if (!viewport) return;

    var track = viewport.querySelector('.testimonials-grid');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.testimonial-card'));
    if (cards.length < 2) return;

    var controls = document.querySelector('.testimonials-controls');
    var prevButton = controls ? controls.querySelector('[data-testimonial-control="prev"]') : null;
    var nextButton = controls ? controls.querySelector('[data-testimonial-control="next"]') : null;
    var toggleButton = controls ? controls.querySelector('[data-testimonial-control="toggle"]') : null;
    var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var loopWidth = 0;
    var cardStep = 0;
    var offset = 0;
    var lastFrameTime = null;
    var isPointerPaused = false;
    var isUserPaused = reduceMotionQuery.matches;

    function getGapSize() {
      var styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap || '0') || 0;
    }

    function calculateMeasurements() {
      var gap = getGapSize();
      loopWidth = cards.reduce(function (total, card) {
        return total + card.getBoundingClientRect().width + gap;
      }, 0);

      cardStep = (cards[0] ? cards[0].getBoundingClientRect().width : 0) + gap;
      offset = normalizeOffset(offset || -loopWidth);
      applyOffset();
    }

    function normalizeOffset(value) {
      if (!loopWidth) return value;

      while (value >= 0) {
        value -= loopWidth;
      }

      while (value < -loopWidth) {
        value += loopWidth;
      }

      return value;
    }

    function applyOffset() {
      track.style.setProperty('--testimonial-offset', offset + 'px');
    }

    function isAutoPaused() {
      return isUserPaused || isPointerPaused || reduceMotionQuery.matches;
    }

    function updateToggleButton() {
      if (!toggleButton) return;

      var paused = isUserPaused || reduceMotionQuery.matches;
      toggleButton.textContent = paused ? 'Resume' : 'Pause';
      toggleButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }

    function moveBy(step) {
      isUserPaused = true;
      offset = normalizeOffset(offset + step);
      applyOffset();
      updateToggleButton();
    }

    function animate(frameTime) {
      if (lastFrameTime === null) {
        lastFrameTime = frameTime;
      }

      var elapsed = (frameTime - lastFrameTime) / 1000;
      lastFrameTime = frameTime;

      if (!isAutoPaused()) {
        offset = normalizeOffset(offset + DESKTOP_MATCH_SPEED * elapsed);
        applyOffset();
      }

      window.requestAnimationFrame(animate);
    }

    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    viewport.classList.add('is-carousel-ready');
    calculateMeasurements();
    updateToggleButton();

    viewport.addEventListener('mouseenter', function () {
      isPointerPaused = true;
    });

    viewport.addEventListener('mouseleave', function () {
      isPointerPaused = false;
      lastFrameTime = null;
    });

    viewport.addEventListener('focusin', function () {
      isPointerPaused = true;
    });

    viewport.addEventListener('focusout', function () {
      isPointerPaused = false;
      lastFrameTime = null;
    });

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        moveBy(-cardStep);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        moveBy(cardStep);
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        isUserPaused = !isUserPaused;
        lastFrameTime = null;
        updateToggleButton();
      });
    }

    window.addEventListener('resize', calculateMeasurements);

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', updateToggleButton);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(updateToggleButton);
    }

    window.requestAnimationFrame(animate);
  });
})();
