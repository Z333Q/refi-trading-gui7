import { Controller, Get, Param } from '@nestjs/common';

@Controller('proofs')
export class ProofsController {
  @Get(':id')
  getProof(@Param('id') id: string) {
    return { proof_id: id, hash: '0x0', ok: true, var_value: 0 };
  }
}
