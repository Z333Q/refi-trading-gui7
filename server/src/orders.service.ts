import { Injectable, HttpException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { OrderPreviewAction, OrderPreviewResult } from '../../src/types/api';
import { AceClient } from '../../src/lib/ace.js';
import { VarProofClient } from '../../src/lib/var.js';
import { supervisorDecision } from '../../src/lib/supervisor.js';

interface ClientDeps {
  ace: AceClient;
  var: VarProofClient;
}

@Injectable()
export class OrdersService {
  private ace: AceClient;
  private var: VarProofClient;

  constructor(deps?: ClientDeps) {
    this.ace = deps?.ace ?? new AceClient({ baseUrl: process.env.ACE_URL ?? '' });
    this.var = deps?.var ?? new VarProofClient({ baseUrl: process.env.VAR_URL ?? '' });
  }

  async preview(action: OrderPreviewAction, currentQty: number): Promise<OrderPreviewResult> {
    const [aceRes, varRes] = await Promise.all([
      this.ace.evaluate(action),
      this.var.prove(action),
    ]);

    const checks = {
      aceOk: !!aceRes.policy?.allow,
      varOk: !!varRes.proof?.ok,
      degraded: aceRes.degraded || varRes.degraded,
    };

    const decision = supervisorDecision({ checks, order: action, currentQty });

    if (checks.degraded || decision === 'REJECT') {
      throw new HttpException('SAFE_MODE', 409);
    }

    return {
      order_preview_id: randomUUID(),
      action,
      proof: varRes.proof!,
      policy: aceRes.policy!,
      trace_id: randomUUID(),
    };
  }
}

