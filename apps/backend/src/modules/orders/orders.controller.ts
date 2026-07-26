import {
  Controller, Get, Post, Put,
  Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /api/orders — Admin: list all orders
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /api/orders/:id — Admin: order detail
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  // POST /api/orders — Customer: place order
  @Post()
  @HttpCode(HttpStatus.CREATED)
  placeOrder(@Body() body: any) {
    return this.ordersService.placeOrder(body);
  }

  // PUT /api/orders/:id/status — Admin: update status
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
