/* promos.js — Single source of truth for all promotions.
   Edit this file only to update promo content site-wide. */

var promo = {
  isActive: true,
  title: "Free Piercings with $50 Jewelry Purchase",
  description: "",
  ctaText: "",
  ctaLink: "",
  endDate: null,
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
