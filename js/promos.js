/* promos.js — Single source of truth for all promotions.
   Edit this file only to update promo content site-wide. */

var promo = {
  isActive: false,
  title: "Summer Flash Sale",
  description: "Get 20% off any tattoo booking made in June!",
  ctaText: "Book Now",
  ctaLink: "book.html",
  endDate: "2026-06-30T23:59:59",
  startDate: null,
  image: null,
};

/* resolvePromoState — pure function for testability */
function resolvePromoState(promoObj) {
  if (promoObj.isActive) return 'active';
  if (!promoObj.endDate) return 'empty';
  var end = new Date(promoObj.endDate).getTime();
  if (isNaN(end)) return 'empty';
  return end > Date.now() ? 'countdown' : 'empty';
}
