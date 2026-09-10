/**
 * Centralized Product Catalog for The Little Wardrobe
 * Follows PRD specifications (Sections 8, 17, 20, 26).
 */

export const categories = [
  { id: "all", label: "All" },
  { id: "co-ords", label: "Co-ords" },
  { id: "dresses", label: "Dresses" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
];

export const products = [
  {
    id: "tlw-001",
    slug: "floral-linen-co-ord-set",
    name: "Floral Linen Co-ord Set",
    price: 1499,
    category: "co-ords",
    availability: "Available",
    featured: true,
    badge: "Bestseller",
    description: "A breezy two-piece ensemble crafted from breathable pure organic linen. Features relaxed drop-shoulder sleeves with shell buttons paired with elasticated, high-waisted culottes for effortless daytime dressing.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Pure European Linen",
    color: "Soft Sage & Cream Floral",
    included: "Relaxed resort shirt & matching wide-leg culotte trousers",
    careInstructions: "Gentle cold hand wash or machine wash on delicate mode in cold water. Do not bleach. Air dry in shade.",
    shippingInformation: "Dispatched within 24-48 hours. Express delivery within 3-5 business days across India.",
    returnInformation: "Eligible for size exchange within 7 days of delivery. Free exchange pickups available.",
    relatedProducts: ["tlw-003", "tlw-005", "tlw-008"]
  },
  {
    id: "tlw-002",
    slug: "sage-midi-smock-dress",
    name: "Sage Midi Smock Dress",
    price: 1899,
    category: "dresses",
    availability: "Available",
    featured: true,
    badge: "Staff Pick",
    description: "An airy midi silhouette cut from textured slub cotton in a calming herb sage hue. Designed with gentle flutter tiers, deep side pockets, and delicate gathered neck detailing that breathes with you all day.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Textured Slub Cotton",
    color: "Muted Herb Sage",
    included: "Midi dress with discreet dual side pockets",
    careInstructions: "Hand wash cold with similar colors. Warm iron inside out while slightly damp.",
    shippingInformation: "Standard pan-India delivery in 4-6 business days.",
    returnInformation: "7-day exchange window for sizing convenience.",
    relatedProducts: ["tlw-001", "tlw-006", "tlw-010"]
  },
  {
    id: "tlw-003",
    slug: "terracotta-wrap-top-pant-set",
    name: "Terracotta Wrap Top & Pant Set",
    price: 2199,
    category: "co-ords",
    availability: "Available",
    featured: true,
    badge: "New Arrival",
    description: "Earthy elegance tailored in rich clay terracotta. The wrap blouse ties gracefully at the natural waist while matching straight-cut tapered trousers deliver structured ease from morning coffee to twilight dinners.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "Cotton-Linen Slub Blend",
    color: "Warm Terracotta Earth",
    included: "Tie-up wrap kimono blouse and matching ankle-length trousers",
    careInstructions: "Machine wash cold with mild liquid detergent. Line dry away from direct sunlight.",
    shippingInformation: "Dispatched within 2 business days. Express shipping across metro cities.",
    returnInformation: "Size exchange offered within 7 days from delivery date.",
    relatedProducts: ["tlw-001", "tlw-007", "tlw-011"]
  },
  {
    id: "tlw-004",
    slug: "blush-rose-slip-dress",
    name: "Blush Rose Tiered Slip Dress",
    price: 1650,
    category: "dresses",
    availability: "Available",
    featured: true,
    badge: "Trending",
    description: "Understated and romantic, this tiered silhouette in dusty blush rose drapes softly along your frame. Featuring adjustable spaghetti straps, French seams, and a fluid A-line drape that pairs effortlessly with flats or sandals.",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Rayon Silk-Touch Crepe",
    color: "Dusty Blush Rose",
    included: "Slip dress with adjustable straps and tonal cotton lining",
    careInstructions: "Dry clean recommended for first wash or cold gentle wash.",
    shippingInformation: "Ships pan-India within 3-5 business days.",
    returnInformation: "Size exchange accepted within 7 days.",
    relatedProducts: ["tlw-002", "tlw-006", "tlw-008"]
  },
  {
    id: "tlw-005",
    slug: "pistachio-cotton-lounge-set",
    name: "Pistachio Cotton Lounge Co-ord",
    price: 1599,
    category: "co-ords",
    availability: "Available",
    featured: false,
    badge: "",
    description: "Designed for effortless weekend lounging or quiet afternoons, this two-piece set features a lightweight boxy button-down over relaxed matching culottes in calming pistachio green.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Breathable Khadi Cotton",
    color: "Soft Pistachio Mist",
    included: "Boxy collar shirt & drawstring elasticated trousers",
    careInstructions: "Gentle machine wash cold. Do not tumble dry.",
    shippingInformation: "Ships in 24-48 hours. Free shipping on orders > ₹2,999.",
    returnInformation: "Exchange available within 7 days.",
    relatedProducts: ["tlw-001", "tlw-003", "tlw-007"]
  },
  {
    id: "tlw-006",
    slug: "tiered-cotton-sun-dress",
    name: "Oatmeal Tiered Sun Dress",
    price: 1799,
    category: "dresses",
    availability: "Available",
    featured: false,
    badge: "Eco-Friendly",
    description: "Undyed natural oatmeal cotton woven into a romantic tiered midi dress with smocked back paneling for a flexible, comfortable fit. Accented with mother-of-pearl buttons and deep pockets.",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "100% Unbleached Organic Cotton",
    color: "Natural Oatmeal",
    included: "Tiered sundress with side-seam pockets",
    careInstructions: "Machine wash cold with mild detergent. Hang to dry naturally.",
    shippingInformation: "Delivered within 4-6 business days pan-India.",
    returnInformation: "Size exchange supported within 7 days.",
    relatedProducts: ["tlw-002", "tlw-004", "tlw-012"]
  },
  {
    id: "tlw-007",
    slug: "embroidered-peasant-blouse",
    name: "Embroidered Cotton Peasant Blouse",
    price: 1199,
    category: "tops",
    availability: "Available",
    featured: false,
    badge: "Handcrafted",
    description: "Delicate tonal floral threadwork across the neckline and billowy raglan sleeves makes this airy cream blouse an instant wardrobe treasure. Finished with tassel cord ties.",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Mulmul Cotton",
    color: "Ivory White with Sage Threadwork",
    included: "Tasseled peasant blouse",
    careInstructions: "Hand wash cold only. Warm iron avoiding embroidery.",
    shippingInformation: "Ships in 2-3 business days.",
    returnInformation: "Size exchange within 7 days.",
    relatedProducts: ["tlw-008", "tlw-010", "tlw-011"]
  },
  {
    id: "tlw-008",
    slug: "cropped-linen-kimono-top",
    name: "Cropped Linen Kimono Top",
    price: 1050,
    category: "tops",
    availability: "Available",
    featured: false,
    badge: "",
    description: "A minimalist boxy crop crafted from washed French linen. Features wide 3/4 sleeves, clean neckline, and an airy relaxed silhouette that sits naturally at the waist.",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "Pure French Washed Linen",
    color: "Warm Sand Beige",
    included: "Boxy cropped linen top",
    careInstructions: "Hand wash cold. Linen naturally softens with every wash.",
    shippingInformation: "Ships pan-India within 3-5 days.",
    returnInformation: "7-day exchange policy.",
    relatedProducts: ["tlw-007", "tlw-009", "tlw-011"]
  },
  {
    id: "tlw-009",
    slug: "ribbed-boatneck-top",
    name: "Ribbed Knit Boatneck Top",
    price: 899,
    category: "tops",
    availability: "Sold Out",
    featured: false,
    badge: "Restocking Soon",
    description: "An understated boatneck silhouette knitted from ultra-soft fine rib cotton. Contours softly to the body while remaining cool and flexible for daily layering.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "95% Ribbed Organic Cotton, 5% Elastane",
    color: "Muted Olive",
    included: "Boatneck ribbed knit top",
    careInstructions: "Machine wash cold. Dry flat to preserve knit shape.",
    shippingInformation: "Currently sold out. You can enquire on WhatsApp for restock notifications.",
    returnInformation: "Standard exchange policy applies upon restock.",
    relatedProducts: ["tlw-007", "tlw-008", "tlw-010"]
  },
  {
    id: "tlw-010",
    slug: "wide-leg-linen-pants",
    name: "Wide-Leg Washed Linen Pants",
    price: 1399,
    category: "bottoms",
    availability: "Available",
    featured: false,
    badge: "Essential",
    description: "The quintessential warm-weather staple. Cut with generous wide legs, an elasticated paperbag waistband with drawstring ties, and tailored deep slant pockets for unmatched versatility.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% Enzyme-Washed Linen",
    color: "Natural Flax / Oatmeal",
    included: "Wide leg linen trousers with drawstring waist",
    careInstructions: "Gentle cold cycle wash. Iron damp on high heat.",
    shippingInformation: "Ships within 24-48 hours.",
    returnInformation: "7-day exchange window.",
    relatedProducts: ["tlw-007", "tlw-008", "tlw-011"]
  },
  {
    id: "tlw-011",
    slug: "high-waist-pleated-trousers",
    name: "High-Waist Pleated Trousers",
    price: 1699,
    category: "bottoms",
    availability: "Available",
    featured: false,
    badge: "",
    description: "Sharp front pleats combine with soft cotton-twill tailoring for an elegant drape. Features a flattering high rise, clean hook-and-bar closure, and slightly tapered hems.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "Cotton-Lyocell Fine Twill",
    color: "Warm Camel Khaki",
    included: "Pleated high-waist trousers with belt loops",
    careInstructions: "Machine wash cold delicate. Hang to dry.",
    shippingInformation: "Ships in 2-4 business days.",
    returnInformation: "Size exchange within 7 days.",
    relatedProducts: ["tlw-008", "tlw-010", "tlw-003"]
  },
  {
    id: "tlw-012",
    slug: "tiered-cotton-maxi-skirt",
    name: "Tiered Cotton Voile Maxi Skirt",
    price: 1299,
    category: "bottoms",
    availability: "Sold Out",
    featured: false,
    badge: "Sold Out",
    description: "Billowy tiers of lightweight cotton voile float gently with every step. Finished with an elasticated smocked waistband and tonal cotton lining for zero transparency.",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L"],
    fabric: "100% Cotton Voile",
    color: "Soft Ecru White",
    included: "Lined maxi skirt with smocked elastic waist",
    careInstructions: "Hand wash in cold water with mild detergent.",
    shippingInformation: "Sold out. Contact us on WhatsApp for pre-order requests.",
    returnInformation: "Standard exchange policy on restocking.",
    relatedProducts: ["tlw-007", "tlw-008", "tlw-010"]
  }
];

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug) || null;
}

export function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured).slice(0, 4);
}

export function getProductsByCategory(category) {
  if (!category || category === "all") return products;
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
