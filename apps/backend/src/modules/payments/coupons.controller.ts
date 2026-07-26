import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('api/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  // POST /api/coupons/validate — validate a coupon code
  @Post('validate')
  validate(@Body('code') code: string, @Body('subtotal') subtotal: number) {
    return this.couponsService.validate(code, subtotal);
  }

  @Post()
  create(@Body() body: { code: string; discountPct: number; minOrder: number }) {
    return this.couponsService.create(body);
  }

  @Put(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.couponsService.toggle(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
