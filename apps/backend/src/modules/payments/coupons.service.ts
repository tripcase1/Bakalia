import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { code: 'asc' } });
  }

  async validate(code: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!coupon || !coupon.isActive) {
      return { valid: false, error: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minOrder) {
      return {
        valid: false,
        error: `Minimum order ৳${coupon.minOrder} required for this coupon.`,
      };
    }
    const discountAmount = Math.round(subtotal * (coupon.discountPct / 100));
    return { valid: true, coupon, discountAmount };
  }

  async create(data: { code: string; discountPct: number; minOrder: number }) {
    return this.prisma.coupon.create({
      data: { ...data, code: data.code.toUpperCase() },
    });
  }

  async toggle(id: string) {
    const c = await this.prisma.coupon.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: !c.isActive },
    });
  }

  async delete(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
