import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Payment } from 'mercadopago';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class PaymentsService {
  private preferenceClient: Preference;

  constructor(private readonly ordersService: OrdersService) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    this.preferenceClient = new Preference(client);
  }

  async createPreference(orderId: number, items: any[]) {
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
      external_reference: String(orderId),
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

      const orderId = Number(payment.external_reference); // 👈 viene de la preferencia
      const status = payment.status; // 'approved', 'rejected', 'pending'

      // Actualizar orden en DB
      if (orderId && status) {
        await this.ordersService.updateStatus(orderId, status);
        console.log(`Orden ${orderId} actualizada a estado ${status}`);
      }
    }
  }
}
