/* gallery-data.js - shared tattoo gallery image source */

var artistDisplayOrder = ['tempt', 'brian', 'martin'];

var artistDisplayNames = {
  brian: 'Brian',
  martin: 'Martin',
  tempt: 'Tempt',
};

var galleryImages = [
  { src: 'assets/images/Artist-Tempt/Tempt_Hummingbird_before-and-after.jpg', alt: 'Hummingbird tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'realism' },
  { src: 'assets/images/Artist-Tempt/Tempt_Daisy_Anchor.jpg', alt: 'Daisy anchor tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'traditional', showcase: true },
  { src: 'assets/images/Artist-Tempt/Tempt_Aries.jpg', alt: 'Aries zodiac tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'geometric' },
  { src: 'assets/images/Artist-Tempt/Tempt_Skulls.jpg', alt: 'Skulls tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'black-grey' },
  { src: 'assets/images/Artist-Tempt/Tempt_Colored_Garden.jpg', alt: 'Colored garden tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'color' },
  { src: 'assets/images/Artist-Tempt/Tempt_Peonies.jpg', alt: 'Peonies tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'color', tags: ['show-homepage'] },
  { src: 'assets/images/Artist-Tempt/Tempt_Koi.jpg', alt: 'Koi fish tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'traditional', tags: ['show-homepage'] },
  { src: 'assets/images/Artist-Tempt/Tempt_Snake_Sleeve.jpg', alt: 'Snake sleeve tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'black-grey' },
  { src: 'assets/images/Artist-Tempt/Tempt+3_pic_sleeve.jpg', alt: 'Multi-image sleeve tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'geometric' },
  { src: 'assets/images/Artist-Martin/Martin_Skeleton.JPEG', alt: 'Skeleton tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey', showcase: true, tags: ['show-homepage'] },
  { src: 'assets/images/Artist-Martin/Martin_Mini_Skull_Lady.JPEG', alt: 'Mini skull lady tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey' },
  { src: 'assets/images/Artist-Martin/Martin_Eye.JPG', alt: 'Eye tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey' },
  { src: 'assets/images/Artist-Brian/Brian_Lion.jpg', alt: 'Lion color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color', tags: ['show-homepage'] },
  { src: 'assets/images/Artist-Brian/Brian_Dragon_Star.jpg', alt: 'Dragon and star color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color', showcase: true },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Rose.jpg', alt: 'Colored rose tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Dove.jpg', alt: 'Dove tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'black-grey', tags: ['show-homepage'] },
  { src: 'assets/images/Artist-Brian/Brian_Princess.jpg', alt: 'Princess tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Dia_de_los_Muertos.jpg', alt: 'Dia de los Muertos color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Hummingbird.jpg', alt: 'Colored hummingbird tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian+Colored+Spring.jpg', alt: 'Colored spring flower tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color', tags: ['show-homepage'] },
];

function hasGalleryTag(img, tag) {
  return Array.isArray(img.tags) && img.tags.indexOf(tag) !== -1;
}

function getGalleryThumbnailSrc(src) {
  return src.replace('assets/images/', 'assets/images/gallery-thumbs/');
}

function shuffleGalleryImages(images) {
  var shuffled = images.slice();

  for (var i = shuffled.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var current = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = current;
  }

  return shuffled;
}

function getGalleryImagesByArtist(artist) {
  if (artist === 'all') return galleryImages.slice();
  return galleryImages.filter(function (img) { return img.artist === artist; });
}

function getGalleryImagesByTag(tag) {
  return galleryImages.filter(function (img) { return hasGalleryTag(img, tag); });
}

function getHomepageGalleryImages() {
  return shuffleGalleryImages(getGalleryImagesByTag('show-homepage')).slice(0, 6);
}

function getShowcaseImages() {
  return artistDisplayOrder.map(function (artist) {
    return galleryImages.find(function (img) {
      return img.artist === artist && img.showcase;
    });
  }).filter(Boolean);
}

function createGalleryLink(img, options) {
  var settings = options || {};
  var a = document.createElement('a');
  a.href = img.src;
  a.className = settings.className || 'gallery-item glightbox';
  a.dataset.artist = img.artist;
  a.dataset.style = img.style;

  if (settings.galleryName) {
    a.dataset.gallery = settings.galleryName;
  }

  if (typeof settings.imageIndex === 'number') {
    a.dataset.imageIndex = String(settings.imageIndex);
  }

  if (settings.contextLabel) {
    a.dataset.lightboxContext = settings.contextLabel;
  }

  var image = document.createElement('img');
  image.src = settings.thumbnail || getGalleryThumbnailSrc(img.src);
  image.alt = img.alt;
  image.loading = settings.loading || 'lazy';
  image.decoding = 'async';

  a.appendChild(image);
  return a;
}

function getLightboxIndex(eventData, lightbox) {
  if (eventData && eventData.current && typeof eventData.current.index === 'number') {
    return eventData.current.index;
  }

  if (lightbox && typeof lightbox.index === 'number') {
    return lightbox.index;
  }

  return 0;
}

function setupLightboxContextBadge(lightbox, selector) {
  var triggers = [];
  var badgeObserver = null;

  function refreshTriggers() {
    triggers = Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function getBadge() {
    var container = document.querySelector('.glightbox-container');
    if (!container) return null;

    var badge = container.querySelector('.glightbox-context-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'glightbox-context-badge';
      badge.setAttribute('aria-hidden', 'true');
      container.appendChild(badge);
    }

    return badge;
  }

  function getCurrentSlideIndex() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.glightbox-container .gslide'));
    var current = document.querySelector('.glightbox-container .gslide.current');
    var index = slides.indexOf(current);

    return index >= 0 ? index : null;
  }

  function updateBadge(eventData) {
    var badge = getBadge();
    if (!badge) return;

    var index = getCurrentSlideIndex();
    if (index === null) {
      index = getLightboxIndex(eventData, lightbox);
    }

    var trigger = triggers[index];
    var label = trigger ? trigger.dataset.lightboxContext : '';

    badge.textContent = label || '';
    badge.hidden = !label;
  }

  function queueBadgeUpdate(eventData) {
    window.requestAnimationFrame(function () {
      updateBadge(eventData);
      window.setTimeout(function () {
        updateBadge(eventData);
      }, 80);
      window.setTimeout(function () {
        updateBadge(eventData);
      }, 300);
    });
  }

  function observeBadgeContext() {
    var container = document.querySelector('.glightbox-container');
    if (!container || typeof MutationObserver === 'undefined') return;

    if (badgeObserver) badgeObserver.disconnect();

    badgeObserver = new MutationObserver(function () {
      queueBadgeUpdate();
    });

    badgeObserver.observe(container, {
      attributes: true,
      attributeFilter: ['class', 'src'],
      subtree: true,
    });
  }

  refreshTriggers();

  lightbox.on('open', function (eventData) {
    refreshTriggers();
    queueBadgeUpdate(eventData);
    window.setTimeout(observeBadgeContext, 0);
  });

  lightbox.on('slide_changed', queueBadgeUpdate);

  lightbox.on('close', function () {
    if (badgeObserver) {
      badgeObserver.disconnect();
      badgeObserver = null;
    }

    var badge = document.querySelector('.glightbox-context-badge');
    if (badge) badge.remove();
  });
}

function initImageLightbox(selector, options) {
  var settings = options || {};
  if (typeof GLightbox === 'undefined') return null;

  var lightbox = GLightbox({
    selector: selector,
    touchNavigation: true,
    closeOnOutsideClick: true,
    keyboardNavigation: true,
    loop: true,
  });

  if (settings.contextBadge) {
    setupLightboxContextBadge(lightbox, selector);
  }

  return lightbox;
}

function setupArtistStickyControls(artist, grid) {
  var page = document.querySelector('.artist-detail-page');
  var controls = document.querySelector('[data-artist-sticky-controls]');
  var shell = document.querySelector('[data-artist-sticky-shell]');
  var profile = document.querySelector('.artist-profile');
  if (!page || !controls || !shell || !grid || !profile) return;

  var artistName = page.dataset.artistName || artistDisplayNames[artist] || '';
  var nameLabel = controls.querySelector('[data-artist-sticky-name]');
  if (nameLabel && artistName) nameLabel.textContent = artistName;

  var frameRequested = false;

  function getStickyTop() {
    var header = document.querySelector('.site-header');
    if (!header) return 0;

    return Math.max(0, Math.round(header.getBoundingClientRect().bottom));
  }

  function setStickyPosition(stickyTop) {
    controls.style.setProperty('--artist-sticky-top', stickyTop + 'px');
    controls.style.setProperty('--artist-sticky-left', Math.max(0, Math.round(shell.getBoundingClientRect().left)) + 'px');
  }

  function updateLabelFit() {
    controls.classList.remove('is-compact-label', 'is-tight-label');

    if (!controls.classList.contains('is-portfolio-sticky-context')) return;

    if (controls.scrollWidth > controls.clientWidth + 1) {
      controls.classList.add('is-compact-label');
    }

    if (controls.scrollWidth > controls.clientWidth + 1) {
      controls.classList.add('is-tight-label');
    }
  }

  function updateControls() {
    var stickyTop = getStickyTop();
    var shouldStick = shell.getBoundingClientRect().top <= stickyTop;
    var hasPortfolioContext = profile.getBoundingClientRect().bottom <= stickyTop;

    setStickyPosition(stickyTop);
    controls.classList.toggle('is-stuck', shouldStick);
    controls.classList.toggle('is-portfolio-sticky-context', hasPortfolioContext);
    updateLabelFit();
  }

  function requestUpdate() {
    if (frameRequested) return;

    frameRequested = true;
    window.requestAnimationFrame(function () {
      frameRequested = false;
      updateControls();
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateControls();
}

function renderArtistGallery(artist, galleryName) {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    var lightboxClass = galleryName + '-lightbox';

    getGalleryImagesByArtist(artist).forEach(function (img) {
      grid.appendChild(createGalleryLink(img, {
        className: 'gallery-item glightbox ' + lightboxClass,
        galleryName: galleryName,
      }));
    });

    initImageLightbox('.' + lightboxClass);
    setupArtistStickyControls(artist, grid);
  });
}
