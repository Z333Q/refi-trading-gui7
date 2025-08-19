import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type { OrderPreviewResult } from '../../src/types/api';

@Controller('orders')
export class OrdersController {
  @Post('preview')
  @HttpCode(200)
  preview(@Body() body: unknown): OrderPreviewResult {
    void body;
    return {
      order_preview_id: '00000000-0000-0000-0000-000000000000',
      action: { symbol: 'AAPL', side: 'buy', qty: 1 },
      proof: { proof_id: 'proof', hash: '0x0', ok: true, var_value: 0 },
      policy: { verdict_id: 'verdict', allow: true, reasons: [] },
      trace_id: 'trace',
    };
  }

  @Post()
  @HttpCode(202)
  place(@Body() body: unknown) {
    void body;
    return { status: 'ACCEPTED' };
  }
}
