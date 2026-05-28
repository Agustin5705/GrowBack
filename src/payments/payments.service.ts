import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Payment } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private preferenceClient: Preference;

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    this.preferenceClient = new Preference(client);
  }

  async createPreference(items: any[]) {
    const preference = {
      items: items.map((item) => ({
        id: String(item.product_id),
        title: `Producto ${item.product_id}`,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      back_urls: {
        success: 'https://www.google.com',
        failure: 'https://www.yahoo.com',
        pending: 'https://www.bing.com',
      },
      auto_return: 'approved',
    };

    const response = await this.preferenceClient.create({ body: preference });
    return response;
  }

  async processWebhook(paymentData: any): Promise<void> {
    console.log('Webhook recibido:', paymentData);

    if (paymentData?.data?.id) {
      const paymentClient = new Payment(
        new MercadoPagoConfig({
          accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        }),
      );
      const payment = await paymentClient.get({ id: paymentData.data.id });
      console.log('Pago validado:', payment);
    }
  }
}
