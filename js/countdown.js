/* countdown.js - promotion tile rendering */

function getTimeRemaining(endDate) {
  if (!endDate) return { noDate: true };
  var end = new Date(endDate).getTime();
  if (isNaN(end)) return { noDate: true };
  var now = Date.now();
  var diff = end - now;
  if (diff <= 0) return { expired: true };
  var seconds = Math.floor((diff / 1000) % 60);
  var minutes = Math.floor((diff / 1000 / 60) % 60);
  var hours = Math.floor((diff / 1000 / 60 / 60) % 24);
  var days = Math.floor(diff / 1000 / 60 / 60 / 24);
  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}

function resolvePromoState(promoObj) {
  if (promoObj.isActive) return 'active';
  if (!promoObj.endDate) return 'empty';
  var end = new Date(promoObj.endDate).getTime();
  if (isNaN(end)) return 'empty';
  return end > Date.now() ? 'countdown' : 'empty';
}

(function () {
  function pad(n) { return String(n).padStart(2, '0'); }

  function renderPromo(container, promoObj) {
    var state = resolvePromoState(promoObj);

    if (state === 'active') {
      var img = promoObj.image
        ? '<img src="' + promoObj.image + '" alt="' + promoObj.title + ' promo image" class="promo-image">'
        : '';
      var description = promoObj.description ? '<p>' + promoObj.description + '</p>' : '';
      var cta = promoObj.ctaLink
        ? '<a href="' + promoObj.ctaLink + '" class="btn-primary">' + promoObj.ctaText + '</a>'
        : '';

      container.innerHTML =
        '<div class="promo-tile">' +
        img +
        '<h3>' + promoObj.title + '</h3>' +
        description +
        cta +
        '</div>';
      return;
    }

    if (state === 'countdown') {
      container.innerHTML =
        '<div class="promo-tile">' +
        '<h3>' + (promoObj.title || 'Something Big Is Coming') + '</h3>' +
        '<p>' + (promoObj.description || 'Our next promotion drops soon. Stay tuned!') + '</p>' +
        '<div class="countdown-display" aria-live="polite" aria-atomic="true" id="countdown-timer">' +
        '<span class="countdown-unit"><span class="countdown-value" id="cd-days">--</span><span class="countdown-label">Days</span></span>' +
        '<span class="countdown-unit"><span class="countdown-value" id="cd-hours">--</span><span class="countdown-label">Hours</span></span>' +
        '<span class="countdown-unit"><span class="countdown-value" id="cd-mins">--</span><span class="countdown-label">Mins</span></span>' +
        '<span class="countdown-unit"><span class="countdown-value" id="cd-secs">--</span><span class="countdown-label">Secs</span></span>' +
        '</div>' +
        '</div>';

      var timer = setInterval(function () {
        var remaining = getTimeRemaining(promoObj.endDate);
        if (remaining.expired || remaining.noDate) {
          clearInterval(timer);
          container.innerHTML = '<p class="promo-empty-msg">Check back soon.</p>';
          return;
        }
        var d = document.getElementById('cd-days');
        var h = document.getElementById('cd-hours');
        var m = document.getElementById('cd-mins');
        var s = document.getElementById('cd-secs');
        if (d) d.textContent = pad(remaining.days);
        if (h) h.textContent = pad(remaining.hours);
        if (m) m.textContent = pad(remaining.minutes);
        if (s) s.textContent = pad(remaining.seconds);
      }, 1000);

      return;
    }

    container.innerHTML = '<p class="promo-empty-msg">Check back soon.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var tileContainer = document.getElementById('promo-tile-container');
    if (tileContainer && typeof promo !== 'undefined') {
      renderPromo(tileContainer, promo);
    }

    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
