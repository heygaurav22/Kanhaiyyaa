import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('   Cleaned existing data');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Priya Sharma',
    },
  });
  console.log(`   Created test user: ${user.email}`);

  // ═══════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════

  // Top-level categories
  const kanha = await prisma.category.create({
    data: { name: 'Kanha', slug: 'kanha', description: 'Clothes for Kanha / Krishna idols and devotional dressing', sortOrder: 1 },
  });
  const radha = await prisma.category.create({
    data: { name: 'Radha', slug: 'radha', description: 'Clothes and traditional dress collections for Radha', sortOrder: 2 },
  });
  const ladduGopal = await prisma.category.create({
    data: { name: 'Laddu Gopal', slug: 'laddu-gopal', description: 'Dedicated Laddu Gopal dress/poshak collections', sortOrder: 3 },
  });
  const accessories = await prisma.category.create({
    data: { name: 'Accessories', slug: 'accessories', description: 'Mukut, mala, jewellery, shringar, dupatta, decorative accessories', sortOrder: 4 },
  });
  const collections = await prisma.category.create({
    data: { name: 'Collections', slug: 'collections', description: 'Festival, seasonal, and premium collections', sortOrder: 5 },
  });

  // Kanha subcategories
  const kanhaDaily = await prisma.category.create({ data: { name: 'Daily Wear Poshak', slug: 'kanha-daily', parentId: kanha.id, sortOrder: 1 } });
  const kanhaFestive = await prisma.category.create({ data: { name: 'Festive Poshak', slug: 'kanha-festive', parentId: kanha.id, sortOrder: 2 } });
  const kanhaSilk = await prisma.category.create({ data: { name: 'Silk Poshak', slug: 'kanha-silk', parentId: kanha.id, sortOrder: 3 } });
  const kanhaCotton = await prisma.category.create({ data: { name: 'Cotton Poshak', slug: 'kanha-cotton', parentId: kanha.id, sortOrder: 4 } });
  const kanhaDesigner = await prisma.category.create({ data: { name: 'Designer Poshak', slug: 'kanha-designer', parentId: kanha.id, sortOrder: 5 } });
  const kanhaDhoti = await prisma.category.create({ data: { name: 'Dhoti Sets', slug: 'kanha-dhoti', parentId: kanha.id, sortOrder: 6 } });
  const kanhaWinter = await prisma.category.create({ data: { name: 'Winter Collection', slug: 'kanha-winter', parentId: kanha.id, sortOrder: 7 } });
  const kanhaJanmashtami = await prisma.category.create({ data: { name: 'Janmashtami', slug: 'kanha-janmashtami', parentId: kanha.id, sortOrder: 8 } });

  // Radha subcategories
  const radhaFestive = await prisma.category.create({ data: { name: 'Festive Dress', slug: 'radha-festive', parentId: radha.id, sortOrder: 1 } });
  const radhaLehenga = await prisma.category.create({ data: { name: 'Lehenga', slug: 'radha-lehenga', parentId: radha.id, sortOrder: 2 } });
  const radhaGhagra = await prisma.category.create({ data: { name: 'Ghagra', slug: 'radha-ghagra', parentId: radha.id, sortOrder: 3 } });
  const radhaSilk = await prisma.category.create({ data: { name: 'Silk Collection', slug: 'radha-silk', parentId: radha.id, sortOrder: 4 } });
  const radhaFloral = await prisma.category.create({ data: { name: 'Floral Collection', slug: 'radha-floral', parentId: radha.id, sortOrder: 5 } });
  const radhaWedding = await prisma.category.create({ data: { name: 'Wedding Collection', slug: 'radha-wedding', parentId: radha.id, sortOrder: 6 } });
  const radhaJanmashtami = await prisma.category.create({ data: { name: 'Janmashtami', slug: 'radha-janmashtami', parentId: radha.id, sortOrder: 7 } });

  // Laddu Gopal subcategories
  const lgDaily = await prisma.category.create({ data: { name: 'Daily Poshak', slug: 'lg-daily', parentId: ladduGopal.id, sortOrder: 1 } });
  const lgDesigner = await prisma.category.create({ data: { name: 'Designer Poshak', slug: 'lg-designer', parentId: ladduGopal.id, sortOrder: 2 } });
  const lgSilk = await prisma.category.create({ data: { name: 'Silk Poshak', slug: 'lg-silk', parentId: ladduGopal.id, sortOrder: 3 } });
  const lgCotton = await prisma.category.create({ data: { name: 'Cotton Poshak', slug: 'lg-cotton', parentId: ladduGopal.id, sortOrder: 4 } });
  const lgWinter = await prisma.category.create({ data: { name: 'Winter Poshak', slug: 'lg-winter', parentId: ladduGopal.id, sortOrder: 5 } });
  const lgFestival = await prisma.category.create({ data: { name: 'Festival Collection', slug: 'lg-festival', parentId: ladduGopal.id, sortOrder: 6 } });
  const lgBirthday = await prisma.category.create({ data: { name: 'Birthday Collection', slug: 'lg-birthday', parentId: ladduGopal.id, sortOrder: 7 } });

  // Accessories subcategories
  const accMukut = await prisma.category.create({ data: { name: 'Mukut', slug: 'acc-mukut', parentId: accessories.id, sortOrder: 1 } });
  const accMala = await prisma.category.create({ data: { name: 'Mala', slug: 'acc-mala', parentId: accessories.id, sortOrder: 2 } });
  const accShringar = await prisma.category.create({ data: { name: 'Shringar', slug: 'acc-shringar', parentId: accessories.id, sortOrder: 3 } });
  const accJewellery = await prisma.category.create({ data: { name: 'Jewellery', slug: 'acc-jewellery', parentId: accessories.id, sortOrder: 4 } });
  const accDupatta = await prisma.category.create({ data: { name: 'Dupatta', slug: 'acc-dupatta', parentId: accessories.id, sortOrder: 5 } });
  const accFloral = await prisma.category.create({ data: { name: 'Floral Accessories', slug: 'acc-floral', parentId: accessories.id, sortOrder: 6 } });
  const accGift = await prisma.category.create({ data: { name: 'Gift Sets', slug: 'acc-gift', parentId: accessories.id, sortOrder: 7 } });

  // Collections subcategories
  const colJanmashtami = await prisma.category.create({ data: { name: 'Janmashtami', slug: 'col-janmashtami', parentId: collections.id, sortOrder: 1 } });
  const colRadhaAshtami = await prisma.category.create({ data: { name: 'Radha Ashtami', slug: 'col-radha-ashtami', parentId: collections.id, sortOrder: 2 } });
  const colDiwali = await prisma.category.create({ data: { name: 'Diwali', slug: 'col-diwali', parentId: collections.id, sortOrder: 3 } });
  const colHoli = await prisma.category.create({ data: { name: 'Holi', slug: 'col-holi', parentId: collections.id, sortOrder: 4 } });
  const colWedding = await prisma.category.create({ data: { name: 'Wedding', slug: 'col-wedding', parentId: collections.id, sortOrder: 5 } });
  const colPremium = await prisma.category.create({ data: { name: 'Premium Collection', slug: 'col-premium', parentId: collections.id, sortOrder: 6 } });

  console.log('   Created categories');

  // ═══════════════════════════════════════════
  // PRODUCTS
  // ═══════════════════════════════════════════

  const colors = [
    { color: 'Ivory', hex: '#FFFFF0' },
    { color: 'Royal Blue', hex: '#1a237e' },
    { color: 'Pink', hex: '#e91e63' },
    { color: 'Yellow', hex: '#f9a825' },
    { color: 'Red', hex: '#c62828' },
    { color: 'Green', hex: '#2e7d32' },
    { color: 'Gold', hex: '#c8a951' },
    { color: 'Purple', hex: '#6a1b9a' },
    { color: 'Orange', hex: '#e65100' },
    { color: 'White', hex: '#ffffff' },
  ];

  const sizes = ['1', '2', '3', '4', '5'];

  function createVariants(colorSubset: typeof colors) {
    const variants: Array<{ size: string; color: string; colorHex: string; stock: number }> = [];
    for (const size of sizes) {
      for (const c of colorSubset) {
        variants.push({ size, color: c.color, colorHex: c.hex, stock: Math.floor(Math.random() * 15) + 5 });
      }
    }
    return variants;
  }

  // Real product images (downloaded from Google Drive) + picsum fallback for remaining
  const realImages: Record<number, string> = {
    1: '/products/poshak_01.jpg',   // Kanha daily wear kurta (cream embroidered)
    2: '/products/poshak_02.jpg',   // Kanha silk ghagra/skirt piece
    3: '/products/poshak_03.jpg',   // Kanha festive jacket (embroidered)
    4: '/products/poshak_05.jpg',   // Kanha embroidered open vest
    5: '/products/poshak_07.jpg',   // Similar embroidered vest
    6: '/products/poshak_08.jpg',   // Kanha embroidered kurta with sleeves
    7: '/products/poshak_06.jpg',   // Kanha full poshak spread
    8: '/products/poshak_03.jpg',   // Festive jacket angle
    9: '/products/poshak_10.jpg',   // Laddu Gopal poshak + dhoti set
    10: '/products/poshak_04.jpg',  // Laddu Gopal dhoti/lower piece
    11: '/products/poshak_01.jpg',  // Re-use daily wear
    12: '/products/poshak_02.jpg',  // Re-use ghagra
    13: '/products/poshak_05.jpg',  // Designer vest
    14: '/products/poshak_07.jpg',  // Designer vest alt angle
    15: '/products/poshak_06.jpg',  // Full poshak
    16: '/products/poshak_04.jpg',  // Dhoti piece
    17: '/products/poshak_10.jpg',  // Dhoti set
    18: '/products/poshak_08.jpg',  // Winter kurta
    19: '/products/poshak_01.jpg',  // Winter outfit
    20: '/products/poshak_03.jpg',  // Janmashtami
    21: '/products/poshak_05.jpg',  // Janmashtami alt
    22: '/products/poshak_02.jpg',  // Janmashtami detail
    23: '/products/poshak_01.jpg',  // Simple poshak
    24: '/products/poshak_08.jpg',  // Simple poshak alt
    25: '/products/poshak_06.jpg',  // Brocade
    26: '/products/poshak_03.jpg',  // Brocade detail
    // Radha images
    47: '/products/poshak_13.jpg',  // Radha green dress/lehenga
    48: '/products/poshak_15.jpg',  // Radha pink floral dress
    49: '/products/poshak_16.jpg',  // Radha pink dress alt
    50: '/products/poshak_15.jpg',  // Kishori floral
    51: '/products/poshak_16.jpg',  // Kishori floral alt
    52: '/products/poshak_13.jpg',  // Radha silk saree
    53: '/products/poshak_15.jpg',  // Radha silk alt
    54: '/products/poshak_16.jpg',  // Radha silk detail
    55: '/products/poshak_14.jpg',  // Gopi ghagra
    56: '/products/poshak_13.jpg',  // Gopi ghagra alt
    // Laddu Gopal
    88: '/products/poshak_10.jpg',  // LG daily poshak
    89: '/products/poshak_04.jpg',  // LG daily alt
    90: '/products/poshak_09.jpg',  // LG designer with accessories
    91: '/products/poshak_11.jpg',  // LG designer mukut/decorations
    92: '/products/poshak_12.jpg',  // LG designer pagdi
    93: '/products/poshak_10.jpg',  // LG silk
    94: '/products/poshak_04.jpg',  // LG silk alt
    // Accessories
    135: '/products/poshak_12.jpg', // Mukut/pagdi
    136: '/products/poshak_11.jpg', // Mukut details
    137: '/products/poshak_09.jpg', // Mala / accessory items
    138: '/products/poshak_11.jpg', // Mala alt
    139: '/products/poshak_09.jpg', // Shringar
    140: '/products/poshak_11.jpg', // Shringar alt
    141: '/products/poshak_12.jpg', // Jewellery
    142: '/products/poshak_09.jpg', // Jewellery alt
  };
  const img = (id: number) => realImages[id] || `/products/poshak_${String((id % 16) + 1).padStart(2, '0')}.jpg`;


  // ── KANHA PRODUCTS (25) ──

  const kanhaProducts = [
    { name: 'Vrindavan Royal Poshak', slug: 'vrindavan-royal-poshak', description: 'A regal poshak befitting the Lord of Vrindavan. Crafted with pure silk and adorned with gold zari work, this masterpiece captures the divine essence of Shri Krishna.', details: 'Handcrafted by artisans in Vrindavan with intricate gold zari embroidery. Each piece takes over 40 hours to complete.', fabric: 'Pure Banarasi silk with gold zari threadwork and sequin detailing', careInfo: 'Dry clean only. Store in a cool, dry place. Avoid direct sunlight.', included: 'Poshak, matching pagdi, waist belt', price: 249900, comparePrice: 299900, categoryId: kanhaFestive.id, featured: true, isNew: true, rating: 4.9, reviewCount: 127, tags: ['bestseller', 'festive', 'silk', 'premium'], images: [img(1), img(2), img(3)] },
    { name: 'Shyam Floral Poshak', slug: 'shyam-floral-poshak', description: 'Delicate floral embroidery on premium cotton, perfect for daily seva. The soft fabric ensures comfort while maintaining an elegant appearance.', details: 'Machine-washable cotton with hand-embroidered floral motifs inspired by Vrindavan gardens.', fabric: 'Premium cotton with thread embroidery', careInfo: 'Gentle machine wash. Iron on low heat.', included: 'Poshak, belt', price: 189900, categoryId: kanhaDaily.id, featured: true, isNew: false, rating: 4.7, reviewCount: 89, tags: ['daily', 'cotton', 'floral'], images: [img(4), img(5)] },
    { name: 'Madhav Silk Poshak', slug: 'madhav-silk-poshak', description: 'Luxurious pure silk poshak with traditional temple border motifs. A timeless piece for special occasions and festive celebrations.', details: 'Woven on traditional handlooms in Varanasi. Features classic temple border with peacock motifs.', fabric: 'Pure Kanchipuram silk with temple border', careInfo: 'Dry clean only. Handle with care.', included: 'Poshak, angvastra, belt', price: 349900, comparePrice: 399900, categoryId: kanhaSilk.id, featured: true, isNew: true, rating: 4.8, reviewCount: 64, tags: ['silk', 'premium', 'handloom', 'festive'], images: [img(6), img(7), img(8)] },
    { name: 'Braj Festive Poshak', slug: 'braj-festive-poshak', description: 'Celebrate every festival with this vibrant poshak featuring mirror work and thread embroidery from the Braj region.', details: 'Traditional Rajasthani mirror work combined with Braj-style embroidery.', fabric: 'Art silk with mirror work and thread embroidery', careInfo: 'Dry clean recommended. Avoid folding on mirror areas.', included: 'Poshak, mukut cap, belt', price: 279900, categoryId: kanhaFestive.id, featured: false, isNew: true, rating: 4.6, reviewCount: 45, tags: ['festive', 'mirror-work', 'braj'], images: [img(9), img(10)] },
    { name: 'Govind Cotton Poshak', slug: 'govind-cotton-poshak', description: 'Everyday comfort meets divine elegance. This pure cotton poshak is perfect for daily dressing with beautiful block print patterns.', details: 'Hand block printed using natural dyes. Soft and breathable for daily use.', fabric: 'Pure cotton with hand block print', careInfo: 'Machine washable. Tumble dry low.', included: 'Poshak, belt', price: 89900, categoryId: kanhaCotton.id, featured: false, isNew: false, rating: 4.5, reviewCount: 156, tags: ['daily', 'cotton', 'block-print'], images: [img(11), img(12)] },
    { name: 'Mohan Designer Poshak', slug: 'mohan-designer-poshak', description: 'A contemporary designer poshak that blends modern aesthetics with traditional craftsmanship. Featuring geometric patterns in rich jewel tones.', details: 'Designed by master craftsmen with a modern sensibility. Features unique geometric patterns.', fabric: 'Brocade silk with geometric weave', careInfo: 'Dry clean only.', included: 'Poshak, designer belt, angvastra', price: 449900, comparePrice: 549900, categoryId: kanhaDesigner.id, featured: true, isNew: true, rating: 4.9, reviewCount: 32, tags: ['designer', 'premium', 'brocade'], images: [img(13), img(14), img(15)] },
    { name: 'Krishna Dhoti Set', slug: 'krishna-dhoti-set', description: 'Classic dhoti and angvastra set in pristine white with gold border. Perfect for Janmashtami celebrations and special puja occasions.', details: 'Traditional dhoti set with matching angvastra. Gold border woven on handloom.', fabric: 'Mul cotton with gold border', careInfo: 'Gentle wash. Starch lightly for best drape.', included: 'Dhoti, angvastra, waist cord', price: 149900, categoryId: kanhaDhoti.id, featured: false, isNew: false, rating: 4.7, reviewCount: 98, tags: ['dhoti', 'traditional', 'cotton'], images: [img(16), img(17)] },
    { name: 'Nandlal Winter Poshak', slug: 'nandlal-winter-poshak', description: 'Keep the Lord warm with this velvet winter poshak featuring rich embroidery and soft quilted lining.', details: 'Quilted velvet with thermal lining. Embroidered with gold and silver threads.', fabric: 'Velvet with quilted cotton lining', careInfo: 'Dry clean only. Do not iron directly on velvet.', included: 'Poshak, winter cap, belt', price: 199900, categoryId: kanhaWinter.id, featured: false, isNew: true, rating: 4.6, reviewCount: 23, tags: ['winter', 'velvet', 'warm'], images: [img(18), img(19)] },
    { name: 'Janmashtami Special Poshak', slug: 'janmashtami-special-poshak', description: 'The ultimate Janmashtami ensemble — peacock blue silk with real kundan work and matching accessories. A collector\'s edition piece.', details: 'Limited edition Janmashtami poshak. Real kundan stones set by hand. Collector\'s piece.', fabric: 'Pure silk with kundan stone work', careInfo: 'Dry clean only. Store flat. Handle stones gently.', included: 'Poshak, mukut, mala, bansuri (decorative), belt', price: 599900, comparePrice: 749900, categoryId: kanhaJanmashtami.id, featured: true, isNew: true, rating: 5.0, reviewCount: 18, tags: ['janmashtami', 'premium', 'limited-edition', 'kundan'], images: [img(20), img(21), img(22)] },
    { name: 'Gopala Simple Poshak', slug: 'gopala-simple-poshak', description: 'Elegant simplicity for everyday seva. A lightweight poshak in soothing pastel shades with minimal yet refined detailing.', details: 'Simple, elegant design for everyday worship. Easy to dress and maintain.', fabric: 'Cotton blend with satin trim', careInfo: 'Machine washable.', included: 'Poshak, belt', price: 69900, categoryId: kanhaDaily.id, featured: false, isNew: false, rating: 4.4, reviewCount: 203, tags: ['daily', 'simple', 'affordable'], images: [img(23), img(24)] },
    { name: 'Murlidhar Brocade Poshak', slug: 'murlidhar-brocade-poshak', description: 'Rich brocade poshak with flute-player motifs woven directly into the fabric. A masterwork of Banarasi weaving tradition.', details: 'Banarasi brocade with traditional murlidhar (flute player) motifs. Zari weaving on both sides.', fabric: 'Banarasi brocade with zari', careInfo: 'Dry clean only.', included: 'Poshak, belt, angvastra', price: 389900, categoryId: kanhaSilk.id, featured: false, isNew: false, rating: 4.8, reviewCount: 56, tags: ['silk', 'brocade', 'banarasi', 'premium'], images: [img(25), img(26)] },
    { name: 'Keshav Embroidered Poshak', slug: 'keshav-embroidered-poshak', description: 'Intricate aari embroidery on rich silk fabric. Featuring peacock and lotus motifs symbolizing divine beauty.', details: 'Aari embroidery by skilled artisans from Lucknow. Each motif hand-stitched with precision.', fabric: 'Dupion silk with aari embroidery', careInfo: 'Dry clean only.', included: 'Poshak, belt', price: 319900, comparePrice: 379900, categoryId: kanhaDesigner.id, featured: false, isNew: true, rating: 4.7, reviewCount: 41, tags: ['designer', 'embroidered', 'silk'], images: [img(27), img(28)] },
    { name: 'Banke Bihari Poshak', slug: 'banke-bihari-poshak', description: 'Inspired by the iconic dress style of Banke Bihari temple. Heavy embroidered poshak with traditional Vrindavan aesthetics.', details: 'Inspired by authentic Banke Bihari temple dressing traditions. Museum-quality craftsmanship.', fabric: 'Heavy silk with stone and zardozi work', careInfo: 'Handle with extreme care. Professional clean only.', included: 'Poshak, pagdi, belt, angvastra', price: 499900, categoryId: kanhaFestive.id, featured: true, isNew: false, rating: 4.9, reviewCount: 87, tags: ['festive', 'premium', 'zardozi', 'temple-style'], images: [img(29), img(30), img(31)] },
    { name: 'Makhan Chor Cotton Set', slug: 'makhan-chor-cotton-set', description: 'Playful and charming cotton poshak set depicting the beloved Makhan Chor avatar. Perfect for everyday adorning.', details: 'Cheerful design inspired by baby Krishna\'s playful nature. Comfortable and easy to maintain.', fabric: 'Soft cotton with printed motifs', careInfo: 'Machine washable at 30°C.', included: 'Poshak, cap, belt', price: 99900, categoryId: kanhaCotton.id, featured: false, isNew: false, rating: 4.5, reviewCount: 134, tags: ['cotton', 'daily', 'playful'], images: [img(32), img(33)] },
    { name: 'Dwarkadheesh Royal Poshak', slug: 'dwarkadheesh-royal-poshak', description: 'The grandest poshak in our collection. Inspired by Lord Krishna as King of Dwarka — heavy gold work on midnight blue silk.', details: 'Our signature piece. Over 80 hours of handwork. Gold bullion embroidery on midnight blue silk.', fabric: 'Pure silk with gold bullion embroidery', careInfo: 'Professional preservation recommended. Store in provided muslin bag.', included: 'Poshak, royal mukut, necklace, belt, angvastra', price: 899900, comparePrice: 999900, categoryId: kanhaDesigner.id, featured: true, isNew: true, rating: 5.0, reviewCount: 11, tags: ['designer', 'royal', 'premium', 'signature'], images: [img(34), img(35), img(36)] },
    { name: 'Govardhana Printed Poshak', slug: 'govardhana-printed-poshak', description: 'Digital print poshak featuring the Govardhana Leela in vivid colours. A modern take on traditional storytelling through dress.', details: 'HD digital print on premium fabric. Vibrant colors that don\'t fade with washing.', fabric: 'Premium polyester with digital print', careInfo: 'Machine washable. No bleach.', included: 'Poshak, belt', price: 129900, categoryId: kanhaDaily.id, featured: false, isNew: true, rating: 4.3, reviewCount: 67, tags: ['printed', 'modern', 'daily'], images: [img(37), img(38)] },
    { name: 'Raas Leela Poshak', slug: 'raas-leela-poshak', description: 'Vibrant multi-colored poshak celebrating the divine Raas Leela. Features mirror work and colorful thread embroidery.', details: 'Inspired by the colors of Raas Leela. Handcrafted with love and devotion.', fabric: 'Georgette with mirror and thread work', careInfo: 'Dry clean only.', included: 'Poshak, matching pagdi, belt', price: 239900, categoryId: kanhaFestive.id, featured: false, isNew: false, rating: 4.6, reviewCount: 73, tags: ['festive', 'colorful', 'mirror-work'], images: [img(39), img(40)] },
    { name: 'Yamuna Ghat Cotton Poshak', slug: 'yamuna-ghat-cotton-poshak', description: 'Serene blue cotton poshak inspired by the banks of River Yamuna. Lightweight and perfect for summer seva.', details: 'Light and breathable for summer months. Inspired by the serene blue of Yamuna waters.', fabric: 'Light cotton with tie-dye border', careInfo: 'Machine washable. Air dry recommended.', included: 'Poshak, belt', price: 79900, categoryId: kanhaCotton.id, featured: false, isNew: false, rating: 4.4, reviewCount: 91, tags: ['cotton', 'summer', 'daily'], images: [img(41), img(42)] },
    { name: 'Natwar Velvet Poshak', slug: 'natwar-velvet-poshak', description: 'Luxurious deep purple velvet poshak with gold stone work. Perfect for winter festivals and special occasions.', details: 'Premium velvet with hand-set gold stones. Rich and warm for winter worship.', fabric: 'Italian velvet with stone work', careInfo: 'Dry clean only. Store flat.', included: 'Poshak, winter pagdi, belt', price: 329900, categoryId: kanhaWinter.id, featured: false, isNew: true, rating: 4.7, reviewCount: 28, tags: ['winter', 'velvet', 'premium'], images: [img(43), img(44)] },
    { name: 'Gokul Angvastra', slug: 'gokul-angvastra', description: 'Fine silk angvastra with delicate gold border. Can be paired with any poshak for an elevated look.', details: 'Standalone angvastra piece. Versatile — pairs with any poshak in our collection.', fabric: 'Pure silk with gold zari border', careInfo: 'Dry clean recommended.', included: 'Angvastra only', price: 59900, categoryId: kanhaDhoti.id, featured: false, isNew: false, rating: 4.5, reviewCount: 145, tags: ['angvastra', 'accessory', 'silk'], images: [img(45), img(46)] },
  ];

  // ── RADHA PRODUCTS (18) ──

  const radhaProducts = [
    { name: 'Vrindavan Bridal Lehenga', slug: 'vrindavan-bridal-lehenga', description: 'A breathtaking bridal lehenga for Radha Rani in rich red with heavy gold embroidery. Perfect for wedding celebrations and Vivah Utsav.', details: 'Bridal-quality lehenga set. Over 60 hours of hand embroidery. Designed for divine celebrations.', fabric: 'Pure silk lehenga with gold zardozi embroidery', careInfo: 'Professional clean only. Store in muslin.', included: 'Lehenga, choli, dupatta, belt', price: 699900, comparePrice: 849900, categoryId: radhaLehenga.id, featured: true, isNew: true, rating: 4.9, reviewCount: 34, tags: ['bridal', 'lehenga', 'premium', 'wedding'], images: [img(47), img(48), img(49)] },
    { name: 'Kishori Floral Dress', slug: 'kishori-floral-dress', description: 'Garden-inspired floral dress for Radha Ji with delicate flower embroidery and pearl detailing. A celebration of nature\'s beauty.', details: 'Each flower motif hand-embroidered with silk thread. Pearl beads add an ethereal touch.', fabric: 'Georgette with silk thread and pearl embroidery', careInfo: 'Dry clean only. Handle pearls gently.', included: 'Dress, dupatta, hair accessory', price: 289900, categoryId: radhaFloral.id, featured: true, isNew: true, rating: 4.8, reviewCount: 52, tags: ['floral', 'pearl', 'georgette'], images: [img(50), img(51)] },
    { name: 'Radha Rani Silk Saree Dress', slug: 'radha-rani-silk-saree-dress', description: 'Exquisite silk saree-style dress in Radha\'s iconic yellow with intricate golden border. Drapes beautifully on the idol.', details: 'Pre-stitched saree style for easy draping. Traditional Kanchipuram silk with temple motifs.', fabric: 'Kanchipuram silk with gold border', careInfo: 'Dry clean only.', included: 'Saree-style dress, blouse piece, belt', price: 379900, comparePrice: 449900, categoryId: radhaSilk.id, featured: true, isNew: false, rating: 4.9, reviewCount: 78, tags: ['silk', 'saree', 'traditional', 'premium'], images: [img(52), img(53), img(54)] },
    { name: 'Gopi Festive Ghagra', slug: 'gopi-festive-ghagra', description: 'Vibrant festive ghagra set with mirror work and colorful gota patti. Brings the spirit of Vrindavan festivals alive.', details: 'Traditional Rajasthani gota patti work with mirror embellishments. Festive and joyful design.', fabric: 'Cotton silk with gota patti and mirror work', careInfo: 'Dry clean recommended.', included: 'Ghagra, choli, odhni', price: 249900, categoryId: radhaGhagra.id, featured: false, isNew: true, rating: 4.7, reviewCount: 43, tags: ['ghagra', 'festive', 'gota-patti'], images: [img(55), img(56)] },
    { name: 'Radha Festive Ensemble', slug: 'radha-festive-ensemble', description: 'Complete festive dressing set for Radha Ji featuring rich maroon and gold combination with stone work detailing.', details: 'Complete ensemble for festival dressing. Rich colour palette inspired by traditional temple art.', fabric: 'Art silk with kundan stone work', careInfo: 'Dry clean only. Handle stones with care.', included: 'Dress, dupatta, hair ornament, belt', price: 329900, categoryId: radhaFestive.id, featured: true, isNew: false, rating: 4.8, reviewCount: 65, tags: ['festive', 'kundan', 'ensemble'], images: [img(57), img(58)] },
    { name: 'Priya Pastel Lehenga', slug: 'priya-pastel-lehenga', description: 'Soft pastel lehenga with delicate chikankari embroidery. Ethereal and graceful — perfect for gentle, loving adornment.', details: 'Lucknowi chikankari on pastel base. Subtle and refined craftsmanship.', fabric: 'Cotton with Lucknowi chikankari', careInfo: 'Gentle hand wash or dry clean.', included: 'Lehenga, choli, dupatta', price: 219900, categoryId: radhaLehenga.id, featured: false, isNew: true, rating: 4.6, reviewCount: 37, tags: ['lehenga', 'chikankari', 'pastel'], images: [img(59), img(60)] },
    { name: 'Janmashtami Radha Dress', slug: 'janmashtami-radha-dress', description: 'Special Janmashtami dress for Radha Rani in celestial blue and gold. Pairs beautifully with our Janmashtami Special Poshak for Kanha.', details: 'Designed as a matching pair with our Kanha Janmashtami Poshak. Celestial theme.', fabric: 'Pure silk with gold thread embroidery', careInfo: 'Dry clean only.', included: 'Dress, dupatta, shringar set, belt', price: 449900, comparePrice: 549900, categoryId: radhaJanmashtami.id, featured: true, isNew: true, rating: 4.9, reviewCount: 21, tags: ['janmashtami', 'premium', 'matching-set'], images: [img(61), img(62), img(63)] },
    { name: 'Barsana Garden Dress', slug: 'barsana-garden-dress', description: 'Inspired by the flower gardens of Barsana, Radha\'s birthplace. Multi-color floral dress with garden motifs and green accents.', details: 'Design inspired by the legendary gardens of Barsana. Celebrates Radha\'s connection to nature.', fabric: 'Silk blend with floral print and embroidery', careInfo: 'Dry clean recommended.', included: 'Dress, matching hair flower, belt', price: 199900, categoryId: radhaFloral.id, featured: false, isNew: false, rating: 4.5, reviewCount: 88, tags: ['floral', 'garden', 'barsana'], images: [img(64), img(65)] },
    { name: 'Wedding Special Dress', slug: 'radha-wedding-special', description: 'Grand wedding-themed dress for Radha Ji in bridal red with heavy embellishment. For Vivah celebrations and wedding-themed festivals.', details: 'Bridal red with full coverage embellishment. Statement piece for wedding celebrations.', fabric: 'Heavy silk with zardozi and stone work', careInfo: 'Professional preservation recommended.', included: 'Dress, bridal dupatta, jewellery set, belt', price: 549900, comparePrice: 699900, categoryId: radhaWedding.id, featured: true, isNew: false, rating: 4.9, reviewCount: 29, tags: ['wedding', 'bridal', 'premium', 'zardozi'], images: [img(66), img(67), img(68)] },
    { name: 'Meera Silk Dress', slug: 'meera-silk-dress', description: 'A devotional silk dress in deep blue inspired by Meera Bai\'s unwavering love for Krishna. Elegant and deeply spiritual.', details: 'Deep blue silk inspired by Meera Bai. Understated elegance for devotional dressing.', fabric: 'Pure mulberry silk', careInfo: 'Dry clean only.', included: 'Dress, dupatta, belt', price: 259900, categoryId: radhaSilk.id, featured: false, isNew: false, rating: 4.7, reviewCount: 61, tags: ['silk', 'devotional', 'meera'], images: [img(69), img(70)] },
    { name: 'Holi Rangeen Ghagra', slug: 'holi-rangeen-ghagra', description: 'Explosion of colours! Multi-hued ghagra set celebrating the festival of colours. Tie-dye effect with mirror work accents.', details: 'Tie-dye (bandhani) technique from Rajasthan. Each piece is unique due to hand dyeing process.', fabric: 'Cotton with bandhani tie-dye and mirror work', careInfo: 'Hand wash separately. Colors may run initially.', included: 'Ghagra, choli, colourful odhni', price: 179900, categoryId: radhaGhagra.id, featured: false, isNew: true, rating: 4.6, reviewCount: 44, tags: ['holi', 'bandhani', 'colorful', 'ghagra'], images: [img(71), img(72)] },
    { name: 'Kumkum Daily Dress', slug: 'kumkum-daily-dress', description: 'Simple and graceful daily wear dress for Radha Ji. Comfortable cotton in warm kumkum tones with subtle embroidery.', details: 'Designed for daily worship. Easy to put on and maintain.', fabric: 'Soft cotton with light embroidery', careInfo: 'Machine washable at 30°C.', included: 'Dress, belt', price: 89900, categoryId: radhaFestive.id, featured: false, isNew: false, rating: 4.4, reviewCount: 167, tags: ['daily', 'cotton', 'simple'], images: [img(73), img(74)] },
    { name: 'Rani Pink Designer Dress', slug: 'rani-pink-designer-dress', description: 'Bold rani pink designer dress with contemporary embroidery patterns. A modern luxury piece for the divine feminine.', details: 'Contemporary design with traditional techniques. Bold and beautiful statement piece.', fabric: 'Georgette with sequin and thread work', careInfo: 'Dry clean only.', included: 'Dress, dupatta, hair accessory, belt', price: 369900, categoryId: radhaFestive.id, featured: false, isNew: true, rating: 4.7, reviewCount: 26, tags: ['designer', 'pink', 'modern'], images: [img(75), img(76)] },
    { name: 'Lotus White Dress', slug: 'lotus-white-dress', description: 'Pure white dress adorned with lotus embroidery in gold thread. Symbolizes purity and divine beauty.', details: 'White fabric with gold lotus motifs. Inspired by the purity of devotion.', fabric: 'Premium cotton with gold thread embroidery', careInfo: 'Hand wash in cold water. Do not bleach.', included: 'Dress, white dupatta, belt', price: 159900, categoryId: radhaFloral.id, featured: false, isNew: false, rating: 4.5, reviewCount: 82, tags: ['white', 'lotus', 'pure'], images: [img(77), img(78)] },
    { name: 'Diwali Sparkle Dress', slug: 'diwali-sparkle-dress', description: 'Shimmer and sparkle dress for Diwali celebrations. Rich gold and maroon with sequin and stone work that catches the lamplight.', details: 'Designed to sparkle in the warm glow of diyas. Festival of lights special edition.', fabric: 'Silk with sequin, stone, and cutdana work', careInfo: 'Dry clean only. Handle embellishments carefully.', included: 'Dress, glitter dupatta, jewellery set, belt', price: 419900, categoryId: radhaFestive.id, featured: false, isNew: true, rating: 4.8, reviewCount: 15, tags: ['diwali', 'sparkle', 'festive'], images: [img(79), img(80)] },
    { name: 'Sakhi Simple Lehenga', slug: 'sakhi-simple-lehenga', description: 'Sweet and simple lehenga for everyday adornment. Lightweight with pretty printed patterns and comfortable fabric.', details: 'Everyday lehenga that doesn\'t compromise on beauty. Printed floral patterns.', fabric: 'Cotton blend with digital print', careInfo: 'Machine washable.', included: 'Lehenga, choli, small dupatta', price: 119900, categoryId: radhaLehenga.id, featured: false, isNew: false, rating: 4.3, reviewCount: 114, tags: ['daily', 'lehenga', 'simple'], images: [img(81), img(82)] },
    { name: 'Vrindavan Garden Silk Dress', slug: 'vrindavan-garden-silk-dress', description: 'Premium silk dress with garden-inspired embroidery. Peacock and flower motifs in vibrant jewel tones on deep green base.', details: 'Inspired by the enchanted gardens of Vrindavan. Rich jewel tones on forest green.', fabric: 'Pure silk with multi-colour embroidery', careInfo: 'Dry clean only.', included: 'Dress, dupatta, belt', price: 349900, categoryId: radhaSilk.id, featured: false, isNew: false, rating: 4.8, reviewCount: 47, tags: ['silk', 'garden', 'peacock', 'premium'], images: [img(83), img(84)] },
    { name: 'Radha Ashtami Special', slug: 'radha-ashtami-special', description: 'Exclusive Radha Ashtami celebration dress in divine pink and gold. Limited edition piece for Radha\'s birthday celebrations.', details: 'Limited edition Radha Ashtami special. Divine pink with gold detailing.', fabric: 'Pure silk with gold zari and pearl work', careInfo: 'Dry clean only. Store in provided box.', included: 'Dress, dupatta, complete shringar set, belt', price: 549900, comparePrice: 649900, categoryId: radhaJanmashtami.id, featured: true, isNew: true, rating: 5.0, reviewCount: 12, tags: ['radha-ashtami', 'limited-edition', 'premium'], images: [img(85), img(86), img(87)] },
  ];

  // ── LADDU GOPAL PRODUCTS (22) ──

  const lgProducts = [
    { name: 'Bal Gopal Daily Poshak', slug: 'bal-gopal-daily-poshak', description: 'Sweet and simple daily wear poshak for Laddu Gopal. Soft cotton with cute prints, perfect for everyday dressing.', details: 'Designed for daily worship. Soft fabric gentle on delicate idols.', fabric: 'Premium soft cotton', careInfo: 'Machine washable at 30°C.', included: 'Poshak, cap', price: 49900, categoryId: lgDaily.id, featured: false, isNew: false, rating: 4.5, reviewCount: 234, tags: ['daily', 'cotton', 'affordable', 'bestseller'], images: [img(88), img(89)] },
    { name: 'Laddu Gopal Designer Poshak', slug: 'laddu-gopal-designer-poshak', description: 'Exquisite designer poshak with delicate hand embroidery and mirror work. Makes your Laddu Gopal look absolutely divine.', details: 'Handcrafted designer piece with attention to miniature detailing.', fabric: 'Silk with hand embroidery and mirror work', careInfo: 'Dry clean or gentle hand wash.', included: 'Poshak, mukut, mala, belt', price: 199900, comparePrice: 249900, categoryId: lgDesigner.id, featured: true, isNew: true, rating: 4.8, reviewCount: 67, tags: ['designer', 'mirror-work', 'premium'], images: [img(90), img(91), img(92)] },
    { name: 'Laddu Gopal Silk Poshak', slug: 'laddu-gopal-silk-poshak', description: 'Pure silk poshak in rich jewel tones with gold thread detailing. Luxurious feel perfect for special occasions.', details: 'Miniature silk poshak with proportional gold detailing. Premium quality.', fabric: 'Pure silk with gold thread', careInfo: 'Dry clean only.', included: 'Poshak, belt', price: 149900, categoryId: lgSilk.id, featured: true, isNew: false, rating: 4.7, reviewCount: 89, tags: ['silk', 'premium', 'jewel-tone'], images: [img(93), img(94)] },
    { name: 'Laddu Gopal Cotton Set', slug: 'laddu-gopal-cotton-set', description: 'Comfortable cotton poshak set in cheerful colors. Easy to wash and maintain, ideal for daily dressing routine.', details: 'Pack includes multiple color options for variety in daily dressing.', fabric: 'Pure cotton with printed borders', careInfo: 'Machine washable.', included: 'Poshak, matching cap', price: 39900, categoryId: lgCotton.id, featured: false, isNew: false, rating: 4.4, reviewCount: 312, tags: ['cotton', 'daily', 'value-pack', 'bestseller'], images: [img(95), img(96)] },
    { name: 'Winter Warm Poshak Set', slug: 'lg-winter-warm-poshak', description: 'Cozy winter poshak set with thermal lining and soft velvet exterior. Keep your Laddu Gopal warm during cold months.', details: 'Thermal lined velvet poshak designed for winter months.', fabric: 'Velvet with cotton thermal lining', careInfo: 'Dry clean recommended.', included: 'Poshak, winter cap, blanket', price: 129900, categoryId: lgWinter.id, featured: false, isNew: true, rating: 4.6, reviewCount: 45, tags: ['winter', 'velvet', 'warm'], images: [img(97), img(98)] },
    { name: 'Janmashtami Festival Poshak', slug: 'lg-janmashtami-poshak', description: 'Special Janmashtami poshak with peacock motif and traditional styling. Complete set with all accessories for the celebration.', details: 'Complete Janmashtami celebration set. Peacock blue with gold accents.', fabric: 'Silk with peacock embroidery', careInfo: 'Dry clean only.', included: 'Poshak, mukut, bansuri, mala, matki, belt', price: 299900, comparePrice: 379900, categoryId: lgFestival.id, featured: true, isNew: true, rating: 4.9, reviewCount: 56, tags: ['janmashtami', 'complete-set', 'premium'], images: [img(99), img(100), img(101)] },
    { name: 'Birthday Celebration Poshak', slug: 'lg-birthday-poshak', description: 'Adorable birthday-themed poshak set in festive colors. Perfect for celebrating Krishna Janmashtami and birthday festivities.', details: 'Birthday celebration themed poshak. Joyful and festive design.', fabric: 'Art silk with sequin work', careInfo: 'Gentle hand wash.', included: 'Poshak, party cap, mala, belt', price: 179900, categoryId: lgBirthday.id, featured: false, isNew: true, rating: 4.7, reviewCount: 38, tags: ['birthday', 'celebration', 'festive'], images: [img(102), img(103)] },
    { name: 'Bal Krishna Floral Poshak', slug: 'bal-krishna-floral', description: 'Delicate floral printed poshak in pastel shades. Gentle and charming look for your beloved Laddu Gopal.', details: 'Soft pastel floral design inspired by spring gardens.', fabric: 'Cotton with floral print', careInfo: 'Machine washable.', included: 'Poshak, flower garland', price: 59900, categoryId: lgDaily.id, featured: false, isNew: false, rating: 4.3, reviewCount: 178, tags: ['floral', 'daily', 'pastel'], images: [img(104), img(105)] },
    { name: 'Royal Rajasthani Poshak', slug: 'lg-royal-rajasthani', description: 'Royal Rajasthani-style poshak with traditional bandhani print and gota patti lace. A miniature masterpiece.', details: 'Traditional Rajasthani techniques adapted for Laddu Gopal dressing.', fabric: 'Cotton with bandhani and gota patti', careInfo: 'Hand wash only. Do not wring.', included: 'Poshak, pagdi, belt', price: 159900, categoryId: lgDesigner.id, featured: false, isNew: false, rating: 4.6, reviewCount: 72, tags: ['rajasthani', 'bandhani', 'traditional'], images: [img(106), img(107)] },
    { name: 'Diwali Special Poshak', slug: 'lg-diwali-special', description: 'Glittering Diwali poshak with gold sequins and stone work. Let your Laddu Gopal shine during the festival of lights.', details: 'Sparkle and shine design for Diwali. Rich gold and jewel tones.', fabric: 'Silk with sequin and stone embellishment', careInfo: 'Dry clean only. Handle embellishments gently.', included: 'Poshak, matching cap, decorative diya', price: 219900, categoryId: lgFestival.id, featured: false, isNew: true, rating: 4.8, reviewCount: 31, tags: ['diwali', 'sparkle', 'festive'], images: [img(108), img(109)] },
    { name: 'Holi Colors Poshak', slug: 'lg-holi-poshak', description: 'Multi-colored tie-dye poshak set for Holi celebrations. Vibrant and playful — just like the festival itself!', details: 'Tie-dye colours designed to represent Holi celebrations.', fabric: 'Cotton with tie-dye', careInfo: 'Hand wash separately. Colours may bleed slightly.', included: 'Poshak, colourful cap, pichkari (decorative)', price: 99900, categoryId: lgFestival.id, featured: false, isNew: true, rating: 4.5, reviewCount: 55, tags: ['holi', 'colorful', 'fun'], images: [img(110), img(111)] },
    { name: 'Miniature Dhoti Kurta', slug: 'lg-miniature-dhoti-kurta', description: 'Tiny dhoti-kurta set in white with gold border. Classic temple-style dressing for Laddu Gopal.', details: 'Classic dhoti-kurta set scaled down beautifully for Laddu Gopal.', fabric: 'Cotton with gold border', careInfo: 'Gentle wash. Starch for best results.', included: 'Dhoti, kurta, angvastra', price: 69900, categoryId: lgDaily.id, featured: false, isNew: false, rating: 4.4, reviewCount: 198, tags: ['dhoti', 'classic', 'temple-style'], images: [img(112), img(113)] },
    { name: 'Premium Brocade Poshak', slug: 'lg-premium-brocade', description: 'Rich brocade poshak with traditional weave patterns. The finest fabric crafted in miniature for premium worship.', details: 'Genuine Banarasi brocade adapted to miniature scale. Collector\'s quality.', fabric: 'Banarasi brocade with zari', careInfo: 'Dry clean only.', included: 'Poshak, mukut, belt', price: 249900, categoryId: lgSilk.id, featured: true, isNew: false, rating: 4.8, reviewCount: 43, tags: ['brocade', 'premium', 'banarasi'], images: [img(114), img(115)] },
    { name: 'Summer Breeze Poshak', slug: 'lg-summer-breeze', description: 'Ultra-light cotton poshak in cool mint and white. Perfect for summer months with breathable fabric.', details: 'Designed for hot Indian summers. Ultra-light and breathable.', fabric: 'Muslin cotton', careInfo: 'Machine washable. Quick dry.', included: 'Poshak, light cap', price: 44900, categoryId: lgCotton.id, featured: false, isNew: true, rating: 4.3, reviewCount: 89, tags: ['summer', 'cotton', 'light'], images: [img(116), img(117)] },
    { name: 'Govardhan Puja Poshak', slug: 'lg-govardhan-puja', description: 'Special poshak for Govardhan Puja with mountain motifs and pastoral scenes embroidered in vivid colors.', details: 'Celebrates Govardhan Puja with themed embroidery and colours.', fabric: 'Cotton silk with themed embroidery', careInfo: 'Hand wash recommended.', included: 'Poshak, pagdi, decorative govardhan set', price: 189900, categoryId: lgFestival.id, featured: false, isNew: false, rating: 4.6, reviewCount: 34, tags: ['govardhan', 'puja', 'embroidered'], images: [img(118), img(119)] },
    { name: 'Midnight Blue Velvet Poshak', slug: 'lg-midnight-velvet', description: 'Deep midnight blue velvet poshak with silver star embroidery. A magical winter piece for cozy worship.', details: 'Midnight theme with silver star motifs. Warm and enchanting.', fabric: 'Velvet with silver thread embroidery', careInfo: 'Dry clean only. Avoid moisture.', included: 'Poshak, night-sky cap, belt', price: 169900, categoryId: lgWinter.id, featured: false, isNew: true, rating: 4.7, reviewCount: 22, tags: ['winter', 'velvet', 'night-sky'], images: [img(120), img(121)] },
    { name: 'Annakut Festival Poshak', slug: 'lg-annakut-poshak', description: 'Celebratory poshak for Annakut festival with food motifs and vibrant orange-yellow color palette.', details: 'Annakut festival special. Vibrant and festive design.', fabric: 'Cotton silk with embroidery', careInfo: 'Hand wash or dry clean.', included: 'Poshak, cap, mini bhog thali (decorative)', price: 139900, categoryId: lgFestival.id, featured: false, isNew: false, rating: 4.5, reviewCount: 41, tags: ['annakut', 'festival', 'orange'], images: [img(122), img(123)] },
    { name: 'Kundan Designer Poshak', slug: 'lg-kundan-designer', description: 'Exquisite designer poshak with real kundan stones set on silk. Our most luxurious Laddu Gopal offering.', details: 'Real kundan stones set by hand on pure silk. Our signature Laddu Gopal piece.', fabric: 'Pure silk with kundan stone work', careInfo: 'Professional clean only. Handle with utmost care.', included: 'Poshak, kundan mukut, kundan mala, belt', price: 399900, comparePrice: 499900, categoryId: lgDesigner.id, featured: true, isNew: true, rating: 5.0, reviewCount: 8, tags: ['kundan', 'designer', 'premium', 'signature'], images: [img(124), img(125), img(126)] },
    { name: 'Rainbow Pastel Set', slug: 'lg-rainbow-pastel', description: 'Set of 7 pastel-colored daily poshaks — one for each day of the week. Gentle colors for a gentle soul.', details: 'Weekly set of 7 poshaks in different pastel shades. One for each day.', fabric: 'Soft cotton', careInfo: 'Machine washable.', included: '7 poshaks, 7 matching caps', price: 199900, comparePrice: 279900, categoryId: lgDaily.id, featured: true, isNew: true, rating: 4.7, reviewCount: 156, tags: ['set', 'weekly', 'pastel', 'value', 'bestseller'], images: [img(127), img(128)] },
    { name: 'Makhan Matki Poshak', slug: 'lg-makhan-matki', description: 'Adorable Makhan Chor themed poshak with tiny butter pot motifs. Captures baby Krishna\'s playful spirit.', details: 'Themed poshak celebrating Krishna\'s love for makhan. Playful and charming.', fabric: 'Cotton with printed and embroidered motifs', careInfo: 'Machine washable.', included: 'Poshak, cap, decorative matki', price: 79900, categoryId: lgDaily.id, featured: false, isNew: false, rating: 4.5, reviewCount: 167, tags: ['makhan', 'playful', 'cute', 'daily'], images: [img(129), img(130)] },
    { name: 'Silk Thread Embroidered Poshak', slug: 'lg-silk-thread-embroidered', description: 'Fine silk thread embroidery on premium cotton base. Peacock and flute motifs in traditional colour palette.', details: 'Intricate silk thread embroidery by skilled artisans.', fabric: 'Cotton base with silk thread embroidery', careInfo: 'Hand wash in cold water.', included: 'Poshak, belt', price: 109900, categoryId: lgSilk.id, featured: false, isNew: false, rating: 4.6, reviewCount: 93, tags: ['embroidered', 'silk-thread', 'peacock'], images: [img(131), img(132)] },
    { name: 'Wedding Theme Poshak', slug: 'lg-wedding-theme', description: 'Groom-style poshak for wedding celebrations and Vivah Utsav. Complete with sehra and accessories.', details: 'Wedding theme poshak for Vivah Utsav celebrations. Complete groom styling.', fabric: 'Rich silk with gold zari', careInfo: 'Dry clean only.', included: 'Poshak, sehra, necklace, belt', price: 279900, categoryId: lgBirthday.id, featured: false, isNew: true, rating: 4.8, reviewCount: 19, tags: ['wedding', 'groom', 'celebration'], images: [img(133), img(134)] },
  ];

  // ── ACCESSORIES (12) ──

  const accessoryProducts = [
    { name: 'Golden Mukut Crown', slug: 'golden-mukut-crown', description: 'Intricate golden mukut with stone settings. Fits sizes 1-5. The perfect crowning glory for Kanha and Laddu Gopal.', details: 'Hand-crafted metal mukut with stone settings.', fabric: 'Metal alloy with gold plating and stones', careInfo: 'Wipe with soft cloth. Avoid water contact.', included: 'Mukut, cushioned box', price: 149900, categoryId: accMukut.id, featured: true, isNew: true, rating: 4.8, reviewCount: 89, tags: ['mukut', 'gold', 'crown'], images: [img(135), img(136)] },
    { name: 'Tulsi Mala Set', slug: 'tulsi-mala-set', description: 'Genuine Tulsi bead mala set in multiple sizes. Sacred and beautiful — essential for divine adornment.', details: 'Genuine Tulsi wood beads. Set includes multiple sizes.', fabric: 'Natural Tulsi wood beads', careInfo: 'Apply light oil occasionally. Keep dry.', included: 'Set of 3 malas in different sizes', price: 49900, categoryId: accMala.id, featured: false, isNew: false, rating: 4.6, reviewCount: 234, tags: ['mala', 'tulsi', 'sacred', 'bestseller'], images: [img(137), img(138)] },
    { name: 'Premium Shringar Set', slug: 'premium-shringar-set', description: 'Complete shringar set with tilak, chandan, kumkum, and application accessories. Everything needed for daily worship.', details: 'Premium quality shringar materials. Sourced from traditional suppliers.', fabric: 'Natural ingredients with brass accessories', careInfo: 'Store in cool, dry place.', included: 'Tilak, chandan, kumkum, application tools, storage box', price: 89900, categoryId: accShringar.id, featured: false, isNew: true, rating: 4.7, reviewCount: 145, tags: ['shringar', 'tilak', 'daily', 'essential'], images: [img(139), img(140)] },
    { name: 'Kundan Jewellery Set', slug: 'kundan-jewellery-set', description: 'Exquisite kundan jewellery set with necklace, earrings, and bangles. Sized for deity adorning.', details: 'Real kundan stones in traditional settings. Miniature jewellery for deity adorning.', fabric: 'Metal with kundan stone setting', careInfo: 'Polish gently. Store in jewellery box.', included: 'Necklace, earring pair, bangle pair', price: 199900, comparePrice: 249900, categoryId: accJewellery.id, featured: true, isNew: true, rating: 4.9, reviewCount: 56, tags: ['jewellery', 'kundan', 'premium', 'set'], images: [img(141), img(142)] },
    { name: 'Silk Dupatta Collection', slug: 'silk-dupatta-collection', description: 'Set of 5 pure silk dupattas in different colors with gold borders. Versatile accessory for Radha dress styling.', details: 'Versatile silk dupattas that pair with any dress. Premium quality.', fabric: 'Pure silk with gold zari border', careInfo: 'Dry clean only.', included: 'Set of 5 dupattas', price: 129900, categoryId: accDupatta.id, featured: false, isNew: false, rating: 4.5, reviewCount: 98, tags: ['dupatta', 'silk', 'set', 'versatile'], images: [img(143), img(144)] },
    { name: 'Fresh Flower Garland Set', slug: 'flower-garland-set', description: 'Artificial flower garlands that look real. Rose, jasmine, and marigold varieties for beautiful deity decoration.', details: 'Premium artificial flowers that look and feel real. Reusable and long-lasting.', fabric: 'High-quality artificial flowers on wire', careInfo: 'Dust gently. Reshape petals as needed.', included: 'Rose garland, jasmine garland, marigold garland', price: 79900, categoryId: accFloral.id, featured: false, isNew: true, rating: 4.4, reviewCount: 167, tags: ['flowers', 'garland', 'decoration'], images: [img(145), img(146)] },
    { name: 'Peacock Mukut Special', slug: 'peacock-mukut-special', description: 'Stunning peacock-feather-inspired mukut with real peacock feather accent. The signature crown for Murlidhar.', details: 'Peacock theme mukut with genuine peacock feather. Iconic Krishna styling.', fabric: 'Metal with peacock feather and stone work', careInfo: 'Handle feather gently. Store in provided case.', included: 'Mukut with feather, protective case', price: 199900, categoryId: accMukut.id, featured: true, isNew: false, rating: 4.9, reviewCount: 112, tags: ['mukut', 'peacock', 'signature'], images: [img(147), img(148)] },
    { name: 'Pearl Mala Premium', slug: 'pearl-mala-premium', description: 'Genuine freshwater pearl mala in multiple lengths. Adds an unmistakable touch of elegance to any poshak.', details: 'Genuine freshwater pearls. Multiple lengths for different idol sizes.', fabric: 'Freshwater pearls on silk thread', careInfo: 'Avoid perfumes and chemicals. Wipe after use.', included: 'Set of 2 malas (long and short)', price: 179900, categoryId: accMala.id, featured: false, isNew: true, rating: 4.8, reviewCount: 45, tags: ['pearl', 'mala', 'premium'], images: [img(149), img(150)] },
    { name: 'Festival Gift Set - Kanha', slug: 'gift-set-kanha', description: 'Complete gift set for Kanha lovers. Includes poshak, mukut, mala, and accessories in a premium gift box.', details: 'Curated gift set. Perfect for gifting on Janmashtami or any occasion.', fabric: 'Mixed — silk poshak, metal accessories', careInfo: 'Refer to individual item care instructions.', included: 'Silk poshak, mukut, tulsi mala, bansuri, shringar set, gift box', price: 399900, comparePrice: 499900, categoryId: accGift.id, featured: true, isNew: true, rating: 4.9, reviewCount: 28, tags: ['gift', 'set', 'premium', 'kanha'], images: [img(151), img(152), img(153)] },
    { name: 'Festival Gift Set - Laddu Gopal', slug: 'gift-set-laddu-gopal', description: 'Complete gift set for Laddu Gopal. Curated collection of poshak, accessories, and decoration items in a beautiful box.', details: 'All-in-one gift set for Laddu Gopal. Ready-to-gift packaging.', fabric: 'Mixed — cotton poshak, metal and fabric accessories', careInfo: 'Refer to individual item care instructions.', included: 'Cotton poshak set, mukut, mala, blanket, singhasan cover, gift box', price: 349900, comparePrice: 449900, categoryId: accGift.id, featured: true, isNew: false, rating: 4.8, reviewCount: 67, tags: ['gift', 'set', 'laddu-gopal'], images: [img(154), img(155)] },
    { name: 'Decorative Bansuri Set', slug: 'decorative-bansuri-set', description: 'Miniature decorative bansuri (flute) set in multiple metals — gold, silver, and copper. Essential Krishna accessory.', details: 'Miniature flutes crafted in multiple finishes. Decorative — not musical instruments.', fabric: 'Metal alloy with gold/silver/copper plating', careInfo: 'Polish with soft cloth. Avoid water.', included: 'Set of 3 bansuris (gold, silver, copper)', price: 69900, categoryId: accJewellery.id, featured: false, isNew: false, rating: 4.5, reviewCount: 189, tags: ['bansuri', 'flute', 'metal', 'essential'], images: [img(156), img(157)] },
    { name: 'Singhasan Cushion Set', slug: 'singhasan-cushion-set', description: 'Luxurious velvet cushion and mattress set for the deity\'s singhasan. Richly embroidered with gold thread.', details: 'Premium velvet singhasan set. Adds luxury to your deity\'s seating.', fabric: 'Velvet with gold embroidery and cotton filling', careInfo: 'Spot clean only. Fluff regularly.', included: 'Mattress, back cushion, side bolsters (pair)', price: 159900, categoryId: accShringar.id, featured: false, isNew: true, rating: 4.6, reviewCount: 76, tags: ['singhasan', 'cushion', 'velvet'], images: [img(158), img(159)] },
  ];

  // Helper to create product with variants
  async function createProductWithVariants(productData: typeof kanhaProducts[0], colorSubset: typeof colors) {
    const { images, tags, ...rest } = productData;
    const product = await prisma.product.create({
      data: {
        ...rest,
        images: JSON.stringify(images),
        tags: JSON.stringify(tags),
        variants: {
          create: createVariants(colorSubset),
        },
      },
    });
    return product;
  }

  // Create all products
  console.log('   Creating Kanha products...');
  for (const p of kanhaProducts) {
    await createProductWithVariants(p, colors.slice(0, 4)); // Ivory, Blue, Pink, Yellow
  }

  console.log('   Creating Radha products...');
  for (const p of radhaProducts) {
    await createProductWithVariants(p, [colors[0], colors[2], colors[3], colors[4], colors[7]]); // Ivory, Pink, Yellow, Red, Purple
  }

  console.log('   Creating Laddu Gopal products...');
  for (const p of lgProducts) {
    await createProductWithVariants(p, colors.slice(0, 5)); // Ivory, Blue, Pink, Yellow, Red
  }

  console.log('   Creating Accessories...');
  for (const p of accessoryProducts) {
    await createProductWithVariants(p, [colors[0], colors[6], colors[5]]); // Ivory, Gold, Green
  }

  const totalProducts = kanhaProducts.length + radhaProducts.length + lgProducts.length + accessoryProducts.length;
  console.log(`\n✅ Seeding complete!`);
  console.log(`   Total products: ${totalProducts}`);
  console.log(`   Test user: test@example.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
