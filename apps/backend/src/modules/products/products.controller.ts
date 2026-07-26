import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('api/v1/products')
export class ProductsController {
  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1
  ) {
    return {
      success: true,
      data: [
        {
          id: 'p1',
          titleBn: 'পদ্মার তাজা প্রিমিয়াম রূপালী ইলিশ মাছ',
          titleEn: 'Padma River Fresh Silver Hilsa Fish',
          slug: 'padma-river-hilsa-ilish',
          basePrice: 1850,
          discountPrice: 1690,
          unit: 'kg',
          category: 'fresh-fish',
          stock: 45,
          ratingAvg: 4.9,
        },
      ],
      pagination: {
        page,
        limit: 10,
        total: 1,
      },
    };
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return {
      success: true,
      data: {
        id: 'p1',
        titleBn: 'পদ্মার তাজা প্রিমিয়াম রূপালী ইলিশ মাছ',
        titleEn: 'Padma River Fresh Silver Hilsa Fish',
        slug,
        basePrice: 1850,
        discountPrice: 1690,
        unit: 'kg',
        category: 'fresh-fish',
        stock: 45,
        ratingAvg: 4.9,
      },
    };
  }
}
