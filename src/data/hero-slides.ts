/**
 * Your custom hero photography (/public/images/hero).
 * Left→right in your set: generator · triptych · grinder.
 * Slider order: 3rd first, then 1st, then 2nd → grinder → generator → triptych.
 */
export const heroSlides = [
  {
    id: "ingco-grinder-sparks",
    src: "/images/hero/slide-1-grinder.png",
    alt: "Professional worker using an INGCO angle grinder with sparks in a workshop",
    caption: "Professional power tools & metalwork",
  },
  {
    id: "portable-generator",
    src: "/images/hero/slide-2-generator.png",
    alt: "Cinematic portable generator in an industrial warehouse",
    caption: "Generators & backup power solutions",
  },
  {
    id: "industrial-triptych",
    src: "/images/hero/slide-3-triptych.png",
    alt: "Industrial cutting, floor equipment, and water pump in action",
    caption: "Equipment supply for every project phase",
  },
] as const;
