import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { ProofsController } from './proofs.controller.js';
import { VerdictsController } from './verdicts.controller.js';
import { SnapTradeController } from './snaptrade.controller.js';

@Module({
  controllers: [OrdersController, ProofsController, VerdictsController, SnapTradeController],
})
export class AppModule {}
