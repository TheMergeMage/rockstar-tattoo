/* promos.js — Single source of truth for all promotions.
   Edit this file only to update promo content site-wide. */

var promo = {
  isActive: true,
  title: "Free Piercings with $50 Jewelry Purchase",
  badge: "Current Shop Special",
  description: "Purchase $50 or more in jewelry and ask the team about qualifying piercing offers while the promotion is active.",
  terms: "Offer details may vary by jewelry, piercing type, availability, and artist or piercer guidance. Call the shop for current terms before visiting.",
  ctaText: "Call About This Promo",
  ctaLink: "tel:7027499914",
  endDate: null,
  startDate: null,
  image: "assets/images/Artist-Brian/Brian_Colored_Hummingbird.jpg",
};

/* resolvePromoState — pure function for testability */
function resolvePromoState(promoObj) {
  if (promoObj.isActive) return 'active';
  if (!promoObj.endDate) return 'empty';
  var end = new Date(promoObj.endDate).getTime();
  if (isNaN(end)) return 'empty';
  return end > Date.now() ? 'countdown' : 'empty';
}
