import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService, MfsPaymentPayload } from '../payments/payments.service';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createOrder(@Body() body: any) {
    const orderNumber = 'AHF-' + Math.floor(100000 + Math.random() * 900000);
    
    const paymentResult = await this.paymentsService.initiatePayment({
      orderId: orderNumber,
      amount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || 'COD',
      customerPhone: body.phone,
      trxId: body.trxId,
    });

    return {
      success: true,
      message: 'Order placed successfully',
      data: {
        orderNumber,
        status: 'PROCESSING',
        paymentStatus: paymentResult.paymentStatus,
        totalAmount: body.totalAmount,
      },
    };
  }

  @Get(':orderNumber')
  async getOrderDetails(@Param('orderNumber') orderNumber: string) {
    return {
      success: true,
      data: {
        orderNumber,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString(),
      },
    };
  }
}
