/* testimonials.js - continuous homepage testimonial ribbon */

(function () {
  var DESKTOP_MATCH_SPEED = 51; // px/sec, matching the previous full-size desktop pace.
  var SNAP_PROFILE = 'magnetic';
  var CARD_DWELL_FLOOR = 75;
  var CARD_DWELL_BASE = 6000;
  var CARD_DWELL_PER_CHAR = 45;
  var CARD_DWELL_MAX = 20000;
  var DRAG_START_THRESHOLD = 8;
  var DRAG_TAP_SUPPRESSION_THRESHOLD = 10;
  var SWIPE_DISTANCE_THRESHOLD = 44;
  var SWIPE_VELOCITY_THRESHOLD = 420; // px/sec
  var CENTER_TOLERANCE = 6;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  var MOTION_PROFILES = {
    ease: {
      type: 'tween',
      minDuration: 500,
      baseDuration: 520,
      maxDuration: 650,
      distanceFactor: 0.18,
      easing: easeInOutCubic
    },
    magnetic: {
      type: 'tween',
      minDuration: 600,
      baseDuration: 620,
      maxDuration: 750,
      distanceFactor: 0.25,
      easing: easeInOutQuart
    },
    spring: {
      type: 'spring',
      stiffness: 96,
      damping: 19.6,
      settleDistance: 0.45,
      settleVelocity: 4.5
    }
  };

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
    var renderedCards = [];
    var loopWidth = 0;
    var offset = 0;
    var lastFrameTime = null;
    var activeMotion = null;
    var autoResumeTimer = null;
    var isPointerPaused = false;
    var isUserPaused = false;
    var pauseSource = null;
    var selectedReviewIndex = null;
    var suppressNextClick = false;
    var dragState = null;

    function getMotionProfile() {
      return MOTION_PROFILES[SNAP_PROFILE] || MOTION_PROFILES.magnetic;
    }

    function getGapSize() {
      var styles = window.getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap || '0') || 0;
    }

    function calculateMeasurements() {
      var gap = getGapSize();
      loopWidth = cards.reduce(function (total, card) {
        return total + card.getBoundingClientRect().width + gap;
      }, 0);

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

    function getViewportCenter() {
      var rect = viewport.getBoundingClientRect();
      return rect.left + rect.width / 2;
    }

    function getCardCenter(card) {
      var rect = card.getBoundingClientRect();
      return rect.left + rect.width / 2;
    }

    function getReviewIndex(card) {
      return parseInt(card.getAttribute('data-testimonial-index'), 10);
    }

    function getReviewLength(card) {
      var quote = card.querySelector('.testimonial-quote');
      return quote ? quote.textContent.trim().length : 0;
    }

    function getDwellDelay(card) {
      var charCount = getReviewLength(card);
      return clamp(
        CARD_DWELL_BASE + ((charCount - CARD_DWELL_FLOOR) * CARD_DWELL_PER_CHAR),
        CARD_DWELL_BASE,
        CARD_DWELL_MAX
      );
    }

    function clearAutoResumeTimer() {
      if (autoResumeTimer) {
        window.clearTimeout(autoResumeTimer);
        autoResumeTimer = null;
      }
    }

    function scheduleAutoResume(card) {
      clearAutoResumeTimer();

      if (pauseSource !== 'card' && pauseSource !== 'gesture') return;

      autoResumeTimer = window.setTimeout(function () {
        if (pauseSource === 'card' || pauseSource === 'gesture') {
          resumeAutoplay();
        }
      }, getDwellDelay(card));
    }

    function isAutoPaused() {
      return isUserPaused || isPointerPaused || !!activeMotion || !!dragState || reduceMotionQuery.matches;
    }

    function updateToggleButton() {
      if (!toggleButton) return;

      toggleButton.textContent = isUserPaused ? 'Resume' : 'Pause';
      toggleButton.setAttribute('aria-pressed', isUserPaused ? 'true' : 'false');
    }

    function setUserPause(source) {
      isUserPaused = true;
      pauseSource = source;

      if (source === 'card' || source === 'gesture') {
        isPointerPaused = false;
      }

      updateToggleButton();
    }

    function resumeAutoplay() {
      clearAutoResumeTimer();
      activeMotion = null;
      isUserPaused = false;
      pauseSource = null;
      selectedReviewIndex = null;
      lastFrameTime = null;
      updateToggleButton();
    }

    function findClosestCard() {
      var viewportCenter = getViewportCenter();
      var closest = null;
      var closestDistance = Infinity;

      renderedCards.forEach(function (card) {
        var distance = Math.abs(getCardCenter(card) - viewportCenter);
        if (distance < closestDistance) {
          closest = card;
          closestDistance = distance;
        }
      });

      return closest;
    }

    function isReviewCentered(reviewIndex) {
      var closest = findClosestCard();
      if (!closest || getReviewIndex(closest) !== reviewIndex) return false;

      return Math.abs(getCardCenter(closest) - getViewportCenter()) <= CENTER_TOLERANCE;
    }

    function getTargetOffsetForCenter(card, virtualCenter) {
      var center = typeof virtualCenter === 'number' ? virtualCenter : getCardCenter(card);
      return offset + (getViewportCenter() - center);
    }

    function getAdjacentTarget(direction) {
      var current = findClosestCard();
      if (!current) return null;

      var currentCenter = getCardCenter(current);
      var sorted = renderedCards.map(function (card) {
        return {
          card: card,
          center: getCardCenter(card)
        };
      }).sort(function (a, b) {
        return a.center - b.center;
      });

      var i;
      if (direction > 0) {
        for (i = 0; i < sorted.length; i += 1) {
          if (sorted[i].center > currentCenter + CENTER_TOLERANCE) {
            return sorted[i];
          }
        }

        return {
          card: sorted[0].card,
          center: sorted[0].center + loopWidth
        };
      }

      for (i = sorted.length - 1; i >= 0; i -= 1) {
        if (sorted[i].center < currentCenter - CENTER_TOLERANCE) {
          return sorted[i];
        }
      }

      return {
        card: sorted[sorted.length - 1].card,
        center: sorted[sorted.length - 1].center - loopWidth
      };
    }

    function finishMotion() {
      var motion = activeMotion;
      if (!motion) return;

      activeMotion = null;
      offset = normalizeOffset(motion.targetOffset);
      applyOffset();
      selectedReviewIndex = motion.reviewIndex;
      lastFrameTime = null;

      if (typeof motion.onComplete === 'function') {
        motion.onComplete(motion.card);
      }
    }

    function startSnap(card, source, options) {
      var motionOptions = options || {};
      var profile = getMotionProfile();
      var targetOffset = getTargetOffsetForCenter(card, motionOptions.virtualCenter);
      var distance = Math.abs(targetOffset - offset);

      clearAutoResumeTimer();

      if (reduceMotionQuery.matches || distance < 0.5) {
        activeMotion = {
          targetOffset: targetOffset,
          reviewIndex: getReviewIndex(card),
          card: card,
          onComplete: motionOptions.onComplete
        };
        finishMotion();
        return;
      }

      if (profile.type === 'spring') {
        activeMotion = {
          type: 'spring',
          targetOffset: targetOffset,
          reviewIndex: getReviewIndex(card),
          card: card,
          velocity: 0,
          stiffness: profile.stiffness,
          damping: profile.damping,
          settleDistance: profile.settleDistance,
          settleVelocity: profile.settleVelocity,
          onComplete: motionOptions.onComplete
        };
      } else {
        activeMotion = {
          type: 'tween',
          startOffset: offset,
          targetOffset: targetOffset,
          reviewIndex: getReviewIndex(card),
          card: card,
          startTime: null,
          duration: clamp(
            profile.baseDuration + distance * profile.distanceFactor,
            profile.minDuration,
            profile.maxDuration
          ),
          easing: profile.easing,
          onComplete: motionOptions.onComplete
        };
      }

      lastFrameTime = null;
    }

    function snapToClosest(source, options) {
      var closest = findClosestCard();
      if (!closest) return;

      startSnap(closest, source, options);
    }

    function snapToAdjacent(direction, source) {
      var target = getAdjacentTarget(direction);
      if (!target) return;

      startSnap(target.card, source, {
        virtualCenter: target.center,
        onComplete: function (card) {
          if (source === 'card' || source === 'gesture') {
            scheduleAutoResume(card);
          }
        }
      });
    }

    function updateSpringMotion(motion, elapsed) {
      var frameElapsed = Math.min(elapsed, 0.05);
      var displacement = motion.targetOffset - offset;
      var acceleration = motion.stiffness * displacement - motion.damping * motion.velocity;

      motion.velocity += acceleration * frameElapsed;
      offset += motion.velocity * frameElapsed;
      applyOffset();

      if (
        Math.abs(motion.targetOffset - offset) <= motion.settleDistance &&
        Math.abs(motion.velocity) <= motion.settleVelocity
      ) {
        finishMotion();
      }
    }

    function updateTweenMotion(motion, frameTime) {
      if (motion.startTime === null) {
        motion.startTime = frameTime;
      }

      var progress = clamp((frameTime - motion.startTime) / motion.duration, 0, 1);
      var eased = motion.easing(progress);

      offset = motion.startOffset + (motion.targetOffset - motion.startOffset) * eased;
      applyOffset();

      if (progress >= 1) {
        finishMotion();
      }
    }

    function animate(frameTime) {
      if (lastFrameTime === null) {
        lastFrameTime = frameTime;
      }

      var elapsed = (frameTime - lastFrameTime) / 1000;
      lastFrameTime = frameTime;

      if (activeMotion) {
        if (activeMotion.type === 'spring') {
          updateSpringMotion(activeMotion, elapsed);
        } else {
          updateTweenMotion(activeMotion, frameTime);
        }
      } else if (!isAutoPaused()) {
        offset = normalizeOffset(offset + DESKTOP_MATCH_SPEED * elapsed);
        applyOffset();
      }

      window.requestAnimationFrame(animate);
    }

    function pauseManually() {
      setUserPause('manual');
      clearAutoResumeTimer();
      snapToClosest('manual');
    }

    function handleCardClick(card) {
      var reviewIndex = getReviewIndex(card);

      if (
        isUserPaused &&
        (pauseSource === 'card' || pauseSource === 'gesture') &&
        selectedReviewIndex === reviewIndex &&
        isReviewCentered(reviewIndex)
      ) {
        resumeAutoplay();
        return;
      }

      setUserPause('card');
      startSnap(card, 'card', {
        onComplete: scheduleAutoResume
      });
    }

    function beginDrag(event) {
      if (event.button && event.button !== 0) return;

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastTime: window.performance.now(),
        startTime: window.performance.now(),
        startOffset: offset,
        isDragging: false
      };
    }

    function updateDrag(event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      var dx = event.clientX - dragState.startX;
      var dy = event.clientY - dragState.startY;
      var absDx = Math.abs(dx);
      var absDy = Math.abs(dy);

      if (!dragState.isDragging) {
        if (absDy > DRAG_START_THRESHOLD && absDy > absDx) {
          dragState = null;
          return;
        }

        if (absDx < DRAG_START_THRESHOLD || absDx < absDy * 1.15) {
          return;
        }

        dragState.isDragging = true;
        activeMotion = null;
        clearAutoResumeTimer();
        isPointerPaused = true;

        if (typeof viewport.setPointerCapture === 'function') {
          viewport.setPointerCapture(event.pointerId);
        }
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      dragState.lastX = event.clientX;
      dragState.lastTime = window.performance.now();
      offset = dragState.startOffset + dx;
      applyOffset();
    }

    function endDrag(event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      var state = dragState;
      var dx = event.clientX - state.startX;
      var elapsed = Math.max((window.performance.now() - state.startTime) / 1000, 0.016);
      var velocity = dx / elapsed;
      var direction = 0;

      dragState = null;
      isPointerPaused = false;

      if (typeof viewport.releasePointerCapture === 'function') {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch (error) {
          // Some browsers release capture automatically before pointerup.
        }
      }

      if (!state.isDragging) return;

      if (Math.abs(dx) > DRAG_TAP_SUPPRESSION_THRESHOLD) {
        suppressNextClick = true;
      }

      setUserPause('gesture');

      if (dx <= -SWIPE_DISTANCE_THRESHOLD || velocity <= -SWIPE_VELOCITY_THRESHOLD) {
        direction = 1;
      } else if (dx >= SWIPE_DISTANCE_THRESHOLD || velocity >= SWIPE_VELOCITY_THRESHOLD) {
        direction = -1;
      }

      if (direction) {
        snapToAdjacent(direction, 'gesture');
      } else {
        snapToClosest('gesture', {
          onComplete: scheduleAutoResume
        });
      }

      window.setTimeout(function () {
        suppressNextClick = false;
      }, 160);
    }

    cards.forEach(function (card, index) {
      card.setAttribute('data-testimonial-index', index);
    });

    cards.forEach(function (card, index) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-testimonial-index', index);
      track.appendChild(clone);
    });

    renderedCards = Array.prototype.slice.call(track.querySelectorAll('.testimonial-card'));
    viewport.classList.add('is-carousel-ready');
    calculateMeasurements();
    updateToggleButton();

    viewport.addEventListener('mouseenter', function () {
      isPointerPaused = true;
    });

    viewport.addEventListener('mouseleave', function () {
      if (!dragState) {
        isPointerPaused = false;
        lastFrameTime = null;
      }
    });

    viewport.addEventListener('focusin', function () {
      isPointerPaused = true;
    });

    viewport.addEventListener('focusout', function () {
      isPointerPaused = false;
      lastFrameTime = null;
    });

    viewport.addEventListener('click', function (event) {
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressNextClick = false;
        return;
      }

      var card = event.target.closest ? event.target.closest('.testimonial-card') : null;
      if (!card || !viewport.contains(card)) return;

      handleCardClick(card);
    });

    if (window.PointerEvent) {
      viewport.addEventListener('pointerdown', beginDrag);
      viewport.addEventListener('pointermove', updateDrag);
      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        setUserPause('manual');
        clearAutoResumeTimer();
        snapToAdjacent(-1, 'manual');
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        setUserPause('manual');
        clearAutoResumeTimer();
        snapToAdjacent(1, 'manual');
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        if (isUserPaused) {
          resumeAutoplay();
        } else {
          pauseManually();
        }
      });
    }

    window.addEventListener('resize', function () {
      calculateMeasurements();

      if (isUserPaused) {
        snapToClosest(pauseSource || 'manual', {
          onComplete: function (card) {
            if (pauseSource === 'card' || pauseSource === 'gesture') {
              scheduleAutoResume(card);
            }
          }
        });
      }
    });

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', function () {
        activeMotion = null;
        calculateMeasurements();
        updateToggleButton();
      });
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(function () {
        activeMotion = null;
        calculateMeasurements();
        updateToggleButton();
      });
    }

    window.requestAnimationFrame(animate);
  });
})();
