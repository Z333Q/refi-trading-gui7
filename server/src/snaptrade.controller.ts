import { Controller, HttpCode, Post } from '@nestjs/common';

@Controller()
export class SnapTradeController {
  @Post('snaptrade/portal')
  createPortal() {
    return { url: 'https://example.com/portal' };
  }

  @Post('webhooks/snaptrade')
  @HttpCode(200)
  handleWebhook() {
    return { ok: true };
  }
}
