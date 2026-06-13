/* promos.js - Single source of truth for all promotions.
   Edit this file only to update promo content site-wide. */

var promoIndex = {
  current: {
    isActive: true,
    title: "Free Piercing with Jewelry Purchase",
    badge: "Current Shop Special",
    description: "Purchase jewelry and ask the team about qualifying free piercing offers while the promotion is active.",
    terms: "",
    ctaText: "Call About This Promo",
    ctaLink: "tel:7027499914",
    endDate: null,
    startDate: null,
    image: "assets/images/Artist-Brian/Brian_Colored_Hummingbird.jpg",
  },
  messages: {
    short: "Free piercing with jewelry purchase",
    tile: "Purchase jewelry and ask about qualifying free piercing offers.",
  },
};

var promo = promoIndex.current;

/* resolvePromoState - pure function for testability */
function resolvePromoState(promoObj) {
  if (promoObj.isActive) return 'active';
  if (!promoObj.endDate) return 'empty';
  var end = new Date(promoObj.endDate).getTime();
  if (isNaN(end)) return 'empty';
  return end > Date.now() ? 'countdown' : 'empty';
}
