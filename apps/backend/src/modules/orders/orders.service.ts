import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from '@prisma/client';

interface PlaceOrderDto {
  subTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'COD';
  trxId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingDetail: {
    recipientName: string;
    phone: string;
    division: string;
    district: string;
    upazila: string;
    streetAddress: string;
    note?: string;
  };
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async placeOrder(dto: PlaceOrderDto) {
    // Validate stock for all items
    for (const item of dto.items) {
      const product = await this.productsService.findById(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.titleEn}". Available: ${product.stock}`
        );
      }
    }

    // Generate order number
    const orderNumber = 'AHF-' + Math.floor(100000 + Math.random() * 900000);

    // Create order + items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          subTotal: dto.subTotal,
          deliveryFee: dto.deliveryFee,
          discount: dto.discount,
          totalAmount: dto.totalAmount,
          paymentMethod: dto.paymentMethod,
          paymentStatus: dto.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          trxId: dto.trxId,
          recipientName: dto.shippingDetail.recipientName,
          phone: dto.shippingDetail.phone,
          division: dto.shippingDetail.division,
          district: dto.shippingDetail.district,
          upazila: dto.shippingDetail.upazila,
          streetAddress: dto.shippingDetail.streetAddress,
          note: dto.shippingDetail.note,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Deduct stock within same transaction
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { orderStatus: status },
    });
  }
}
