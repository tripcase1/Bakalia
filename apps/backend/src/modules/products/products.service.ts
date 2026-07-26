import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateProductDto {
  titleBn: string;
  titleEn: string;
  slug: string;
  descriptionBn?: string;
  descriptionEn?: string;
  categoryId: string;
  basePrice: number;
  discountPrice?: number;
  sku: string;
  stock?: number;
  unit?: string;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  images?: string[];
  tags?: string[];
  ratingAvg?: number;
  ratingCount?: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFlashSale() {
    return this.prisma.product.findMany({
      where: { isFlashSale: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException(`Product '${slug}' not found`);
    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product '${id}' not found`);
    return product;
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data: data as any });
  }

  async update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: data as any });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async deductStock(items: { productId: string; quantity: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
  }
}
