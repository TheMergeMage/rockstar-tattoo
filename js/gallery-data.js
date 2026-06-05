/* gallery-data.js - shared tattoo gallery image source */

var galleryImages = [
  { src: 'assets/images/Artist-Tempt/Tempt_Daisy_Anchor.jpg', alt: 'Daisy anchor tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'traditional' },
  { src: 'assets/images/Artist-Tempt/Tempt_Hummingbird_before-and-after.jpg', alt: 'Hummingbird tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'realism' },
  { src: 'assets/images/Artist-Tempt/Tempt_Aries.jpg', alt: 'Aries zodiac tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'geometric' },
  { src: 'assets/images/Artist-Tempt/Tempt_Skulls.jpg', alt: 'Skulls tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'black-grey' },
  { src: 'assets/images/Artist-Tempt/Tempt_Colored_Garden.jpg', alt: 'Colored garden tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'color' },
  { src: 'assets/images/Artist-Tempt/Tempt_Peonies.jpg', alt: 'Peonies tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'color' },
  { src: 'assets/images/Artist-Tempt/Tempt_Koi.jpg', alt: 'Koi fish tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'traditional' },
  { src: 'assets/images/Artist-Tempt/Tempt_Snake_Sleeve.jpg', alt: 'Snake sleeve tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'black-grey' },
  { src: 'assets/images/Artist-Tempt/Tempt+3_pic_sleeve.jpg', alt: 'Multi-image sleeve tattoo by Tempt', artist: 'tempt', artistName: 'Tempt', style: 'geometric' },
  { src: 'assets/images/Artist-Martin/Martin_Skeleton.JPEG', alt: 'Skeleton tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey' },
  { src: 'assets/images/Artist-Martin/Martin_Mini_Skull_Lady.JPEG', alt: 'Mini skull lady tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey' },
  { src: 'assets/images/Artist-Martin/Martin_Eye.JPG', alt: 'Eye tattoo by Martin', artist: 'martin', artistName: 'Martin', style: 'black-grey' },
  { src: 'assets/images/Artist-Brian/Brian_Lion.jpg', alt: 'Lion color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Dragon_Star.jpg', alt: 'Dragon and star color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Rose.jpg', alt: 'Colored rose tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Dove.jpg', alt: 'Dove tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'black-grey' },
  { src: 'assets/images/Artist-Brian/Brian_Princess.jpg', alt: 'Princess tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Dia_de_los_Muertos.jpg', alt: 'Dia de los Muertos color tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian_Colored_Hummingbird.jpg', alt: 'Colored hummingbird tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
  { src: 'assets/images/Artist-Brian/Brian+Colored+Spring.jpg', alt: 'Colored spring flower tattoo by Brian', artist: 'brian', artistName: 'Brian', style: 'color' },
];

function getGalleryImagesByArtist(artist) {
  if (artist === 'all') return galleryImages.slice();
  return galleryImages.filter(function (img) { return img.artist === artist; });
}

function renderArtistGallery(artist, galleryName) {
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    getGalleryImagesByArtist(artist).forEach(function (img) {
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'gallery-item glightbox';
      a.dataset.artist = img.artist;
      a.dataset.style = img.style;
      a.dataset.gallery = galleryName;
      a.setAttribute('data-glightbox', 'description: ' + img.alt);

      var image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.loading = 'lazy';

      a.appendChild(image);
      grid.appendChild(a);
    });

    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
      });
    }
  });
}
