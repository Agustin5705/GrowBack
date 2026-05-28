import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(@Body() body: { items: any[] }) {
    return this.paymentsService.createPreference(body.items);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any) {
    const paymentData = req.body;
    await this.paymentsService.processWebhook(paymentData);
    return { status: 'received' };
  }
}
