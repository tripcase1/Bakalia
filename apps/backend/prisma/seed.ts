import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Al Hera Fresh Neon PostgreSQL Database...');

  // Seed Categories
  const categoriesData = [
    { nameBn: 'তাজা মাছ', nameEn: 'Fresh Fish', slug: 'fresh-fish' },
    { nameBn: 'হাঁসের ডিম', nameEn: 'Duck Eggs', slug: 'duck-eggs' },
    { nameBn: 'দেশি মুরগি', nameEn: 'Deshi Chicken', slug: 'deshi-chicken' },
    { nameBn: 'খাঁটি ঘি ও মধু', nameEn: 'Pure Ghee & Honey', slug: 'pure-ghee-honey' },
    { nameBn: 'জৈব শাকসবজি', nameEn: 'Organic Vegetables', slug: 'organic-vegetables font-sans' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // Seed Initial Products
  const productsData = [
    {
      titleBn: 'পদ্মার তাজা বড় ইলিশ মাছ (১.২ - ১.৫ কেজি/পিস)',
      titleEn: 'Fresh Padma Large River Hilsa (1.2-1.5 kg)',
      slug: 'padma-river-hilsa-ilish',
      descriptionBn: 'চাঁদপুর পদ্মার ১০০% কেমিক্যাল ও ফরমালিন মুক্ত তাজা ইলিশ মাছ। নদী থেকে সরাসরি সংগৃহীত।',
      descriptionEn: '100% formalin-free premium river Hilsa caught directly from the Padma river in Chandpur.',
      categoryId: 'fresh-fish',
      basePrice: 1850,
      discountPrice: 1650,
      sku: 'FISH-HILSA-001',
      stock: 45,
      unit: 'kg',
      isFeatured: true,
      isFlashSale: true,
      images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop'],
      tags: ['hilsa', 'fish', 'padma', 'fresh'],
    },
    {
      titleBn: 'প্রিমিয়াম অর্গানিক হাঁসের ডিম (১২ পিস প্যাক)',
      titleEn: 'Premium Organic Farm Duck Eggs (Pack of 12)',
      slug: 'organic-duck-eggs-pack-12',
      descriptionBn: 'গ্রামীণ প্রাকৃতিক পরিবেশে পালিত হাঁসের তাজা লাল কুসুমের ডিম।',
      descriptionEn: 'Fresh free-range duck eggs with rich golden yolks, direct from rural organic farms.',
      categoryId: 'duck-eggs',
      basePrice: 240,
      discountPrice: 220,
      sku: 'EGG-DUCK-012',
      stock: 120,
      unit: 'pack',
      isFeatured: true,
      isFlashSale: false,
      images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop'],
      tags: ['eggs', 'duck', 'organic'],
    },
    {
      titleBn: 'খাঁটি সুন্দবন প্রাকৃতিক মধু (৫০০ গ্রাম)',
      titleEn: 'Pure Sundarban Wild Flower Honey (500g)',
      slug: 'sundarban-wild-honey-500g',
      descriptionBn: 'সুন্দরবনের গভীর জঙ্গল থেকে সংগৃহীত ১০০% প্রাকৃতিক ও খাঁটি খলিশা ফুলের মধু।',
      descriptionEn: '100% raw unpasteurized wildflower honey extracted directly from Sundarbans beehives.',
      categoryId: 'pure-ghee-honey',
      basePrice: 950,
      discountPrice: 850,
      sku: 'HONEY-SUN-500',
      stock: 30,
      unit: 'jar',
      isFeatured: true,
      isFlashSale: true,
      images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=800&auto=format&fit=crop'],
      tags: ['honey', 'pure', 'sundarban'],
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }

  // Seed Coupon
  await prisma.coupon.upsert({
    where: { code: 'SAVE15' },
    update: {},
    create: {
      code: 'SAVE15',
      discountPct: 15,
      minOrder: 1000,
      isActive: true,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
