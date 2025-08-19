import { Controller, Get, Param } from '@nestjs/common';

@Controller('verdicts')
export class VerdictsController {
  @Get(':id')
  getVerdict(@Param('id') id: string) {
    return { verdict_id: id, allow: true, reasons: [] };
  }
}
