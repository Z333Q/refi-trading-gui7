import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type { OrderPreviewAction, OrderPreviewResult } from '../../src/types/api';
import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('preview')
  @HttpCode(200)
  async preview(
    @Body()
    body: { action: OrderPreviewAction; currentQty: number },
  ): Promise<OrderPreviewResult> {
    return this.orders.preview(body.action, body.currentQty);
  }

  @Post()
  @HttpCode(202)
  place(@Body() body: unknown) {
    void body;
    return { status: 'ACCEPTED' };
  }
}
