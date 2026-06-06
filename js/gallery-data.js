/* gallery-data.js - shared tattoo gallery image source */

var artistDisplayOrder = ['tempt', 'brian', 'martin'];

var artistDisplayNames = {
  brian: 'Brian',
  martin: 'Martin',
  tempt: 'Tempt',
};

var galleryImages = [
  { src: 'assets/images/Artist-Tempt/Tempt_Daisy_Anchor.jpg', alt: 'Daisy anchor tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'traditional', showcase: true },
  { src: 'assets/images/Artist-Tempt/Tempt_Hummingbird_before-and-after.jpg', alt: 'Hummingbird tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'realism' },
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

  var image = document.createElement('img');
  image.src = img.src;
  image.alt = img.alt;
  image.loading = settings.loading || 'lazy';

  a.appendChild(image);
  return a;
}

function initImageLightbox(selector) {
  if (typeof GLightbox === 'undefined') return null;

  return GLightbox({
    selector: selector,
    touchNavigation: true,
    closeOnOutsideClick: true,
    keyboardNavigation: true,
    loop: true,
  });
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
  });
}
