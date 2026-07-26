import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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

  async create(data: Parameters<PrismaService['product']['create']>[0]['data']) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: Parameters<PrismaService['product']['update']>[0]['data']) {
    return this.prisma.product.update({ where: { id }, data });
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
