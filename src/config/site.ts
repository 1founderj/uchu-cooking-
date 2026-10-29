// Single source of truth for business data. Text lives in /src/locales.
export const SITE = {
  name: "Uchu Cooking",
  bookingUrl: "https://addagio.io/book/uchu-cooking-classes-arequipa-arequipa",
  getYourGuideUrl: "", // pendiente del cliente: enlace a la oferta/opiniones en GetYourGuide
  currency: "USD",
  price: 44,
  priceOld: 55,
  savingsPct: 20,
  rating: 5.0,
  reviewCount: 14,
  maxGuests: 6,
  durationHours: 3,
  instagram: "https://www.instagram.com/uchucookingaqp/",
  facebook: "https://www.facebook.com/p/Uchu-Cooking-Classes-Arequipa-100063531193840/",
  whatsapp: "", // pendiente del cliente (formato 51XXXXXXXXX). Vacío = botón oculto
  showTestimonials: false, // no mostrar reseñas hasta tener citas reales
  testimonials: [] as { quote: string; author: string }[],
} as const;

export function formatPrice(value: number, lang: string) {
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: SITE.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
