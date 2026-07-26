import { PrismaClient, Role, PaymentMethod, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Al Hera Fresh Database Seeding...');

  // Create Categories
  const freshFishCat = await prisma.category.upsert({
    where: { slug: 'fresh-fish' },
    update: {},
    create: {
      nameBn: 'মিঠা পানির মাছ',
      nameEn: 'Fresh Water Fish',
      slug: 'fresh-fish',
      image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop',
      description: 'পদ্মা, মেঘনা ও যমুনার তাজা ও সুস্বাদু মিঠা পানির মাছ',
    },
  });

  const seaFishCat = await prisma.category.upsert({
    where: { slug: 'sea-fish' },
    update: {},
    create: {
      nameBn: 'সামুদ্রিক মাছ',
      nameEn: 'Sea Fish',
      slug: 'sea-fish',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
      description: 'বঙ্গোপসাগরের তাজা প্রিমিয়াম সামুদ্রিক মাছ',
    },
  });

  const dryFishCat = await prisma.category.upsert({
    where: { slug: 'dry-fish' },
    update: {},
    create: {
      nameBn: 'শুঁটকি মাছ',
      nameEn: 'Dry Fish',
      slug: 'dry-fish',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      description: 'কক্সবাজারের বিষমুক্ত ঐতিহ্যবাহী শুঁটকি',
    },
  });

  const mangoCat = await prisma.category.upsert({
    where: { slug: 'mango' },
    update: {},
    create: {
      nameBn: 'রাজশাহীর আম',
      nameEn: 'Rajshahi Mango',
      slug: 'mango',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
      description: 'রাজশাহী ও চাঁপাইনবাবগঞ্জের কেমিক্যাল মুক্ত তাজা আম',
    },
  });

  const honeyCat = await prisma.category.upsert({
    where: { slug: 'honey' },
    update: {},
    create: {
      nameBn: 'খাঁটি মধু',
      nameEn: 'Pure Honey',
      slug: 'honey',
      image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop',
      description: 'সুন্দরবনের প্রাকৃতিক চাক ভাঙা খাঁটি মধু',
    },
  });

  const vegCat = await prisma.category.upsert({
    where: { slug: 'vegetables' },
    update: {},
    create: {
      nameBn: 'তাজা শাকসবজি',
      nameEn: 'Fresh Vegetables',
      slug: 'vegetables',
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=800&auto=format&fit=crop',
      description: 'ফার্মের অর্গানিক তাজা শাকসবজি',
    },
  });

  // Create Brand
  const alHeraBrand = await prisma.brand.upsert({
    where: { slug: 'al-hera-organic' },
    update: {},
    create: {
      name: 'Al Hera Organic',
      slug: 'al-hera-organic',
      logo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=200&auto=format&fit=crop',
    },
  });

  // Products
  await prisma.product.upsert({
    where: { slug: 'padma-river-hilsa-ilish' },
    update: {},
    create: {
      titleBn: 'পদ্মার তাজা ইলিশ (১.২ - ১.৫ কেজি)',
      titleEn: 'Padma River Fresh Hilsa Fish (1.2kg - 1.5kg)',
      slug: 'padma-river-hilsa-ilish',
      descriptionBn: 'সরাসরি পদ্মার ডিম ছাড়ার আগের তাজা সুস্বাদু রূপালী ইলিশ। কেমিক্যাল ও ফরমালিন মুক্ত guaranteed।',
      descriptionEn: 'Authentic Padma River silver Hilsa fish. 100% chemical and formalin-free guaranteed.',
      categoryId: freshFishCat.id,
      brandId: alHeraBrand.id,
      basePrice: 1850,
      discountPrice: 1690,
      sku: 'FISH-PADMA-ILISH-01',
      stock: 45,
      unit: 'kg',
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 3 * 86400 * 1000),
      images: [
        'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ratingAvg: 4.9,
      ratingCount: 128,
      tags: ['hilsa', 'padma', 'fish', 'ilish', 'fresh'],
      variants: {
        create: [
          { nameBn: '১.২ কেজি সাইজ', nameEn: '1.2 kg size', sku: 'ILISH-1.2KG', price: 1690, stock: 20 },
          { nameBn: '১.৫ কেজি সাইজ', nameEn: '1.5 kg size', sku: 'ILISH-1.5KG', price: 2150, stock: 25 },
        ]
      }
    },
  });

  await prisma.product.upsert({
    where: { slug: 'chittagong-sea-rupchanda' },
    update: {},
    create: {
      titleBn: 'চট্টগ্রামের সুস্বাদু সাদা রূপচাঁদা',
      titleEn: 'Chittagong Deep Sea White Pomfret (Rupchanda)',
      slug: 'chittagong-sea-rupchanda',
      descriptionBn: 'বঙ্গোপসাগরের গভীর জলের ফ্রেশ হোয়াইট রূপচাঁদা মাছ। অত্যন্ত সুস্বাদু ও পুষ্টিকর।',
      descriptionEn: 'Deep-sea freshly caught white pomfret (Rupchanda) from Chittagong Coast.',
      categoryId: seaFishCat.id,
      brandId: alHeraBrand.id,
      basePrice: 1400,
      discountPrice: 1250,
      sku: 'FISH-SEA-RUPCHANDA-02',
      stock: 30,
      unit: 'kg',
      isFeatured: true,
      isFlashSale: false,
      images: [
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
      ],
      ratingAvg: 4.8,
      ratingCount: 64,
      tags: ['sea fish', 'rupchanda', 'pomfret', 'fresh'],
    },
  });

  await prisma.product.upsert({
    where: { slug: 'sundarban-natural-raw-honey' },
    update: {},
    create: {
      titleBn: 'সুন্দরবনের প্রাকৃতিক চাক ভাঙা কাঁচা মধু',
      titleEn: 'Sundarbans Natural Raw Organic Honey (500g)',
      slug: 'sundarban-natural-raw-honey',
      descriptionBn: 'সুন্দরবনের খলিসা ও বাইন ফুলের প্রাকৃতিক চাকে সংগৃহীত ১০০% প্রিমিয়াম খাঁটি মধু।',
      descriptionEn: '100% Raw unprocessed organic wild honey collected directly from Sundarbans mangrove forest.',
      categoryId: honeyCat.id,
      brandId: alHeraBrand.id,
      basePrice: 950,
      discountPrice: 850,
      sku: 'HONEY-SUNDARBAN-500G',
      stock: 100,
      unit: 'jar',
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 5 * 86400 * 1000),
      images: [
        'https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop',
      ],
      ratingAvg: 5.0,
      ratingCount: 210,
      tags: ['honey', 'sundarbans', 'organic', 'pure'],
    },
  });

  await prisma.product.upsert({
    where: { slug: 'rajshahi-katimon-mango' },
    update: {},
    create: {
      titleBn: 'রাজশাহীর কেমিক্যালমুক্ত মিষ্টি কাটিমন আম',
      titleEn: 'Rajshahi Premium Organic Katimon Mango (5kg Box)',
      slug: 'rajshahi-katimon-mango',
      descriptionBn: 'গাছ পাকা সুমিষ্ট কাটিমন আম। বাগান থেকে সরাসরি সংগৃহীত এবং ফরমালিন ও ক্যালসিয়াম কার্বাইড মুক্ত।',
      descriptionEn: 'Tree-ripened super sweet Katimon Mangoes directly harvested from Rajshahi orchards.',
      categoryId: mangoCat.id,
      brandId: alHeraBrand.id,
      basePrice: 1200,
      discountPrice: 990,
      sku: 'MANGO-KATIMON-5KG',
      stock: 60,
      unit: 'box',
      isFeatured: true,
      isFlashSale: true,
      flashSaleEnd: new Date(Date.now() + 2 * 86400 * 1000),
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
      ],
      ratingAvg: 4.9,
      ratingCount: 95,
      tags: ['mango', 'rajshahi', 'katimon', 'fruit'],
    },
  });

  console.log('✅ Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
