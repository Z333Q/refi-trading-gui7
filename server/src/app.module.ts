import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { ProofsController } from './proofs.controller.js';
import { VerdictsController } from './verdicts.controller.js';
import { SnapTradeController } from './snaptrade.controller.js';
import { OrdersService } from './orders.service.js';
import { PrismaService } from './prisma.service.js';

@Module({
  controllers: [OrdersController, ProofsController, VerdictsController, SnapTradeController],
  providers: [OrdersService, PrismaService],
})
export class AppModule {}
