import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

interface OrderItemWithPrice {
  product_id: number;
  quantity: number;
  price: number;
}

@Injectable()
export class OrdersService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });
  }

  async createOrder(items: any[]) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      let total = 0;
      const itemsWithPrice: OrderItemWithPrice[] = []; // 👈 ahora tipado

      for (const item of items) {
        const productResult = await client.query(
          'SELECT * FROM products WHERE id = $1',
          [item.product_id],
        );
        const product = productResult.rows[0];

        if (!product) {
          throw new Error(`Producto con id ${item.product_id} no existe`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Producto ${product.name} no tiene stock suficiente`);
        }

        const price = product.price;
        total += price * item.quantity;

        itemsWithPrice.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price,
        });

        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id],
        );
      }

      const orderResult = await client.query(
        'INSERT INTO orders (total_price, status) VALUES ($1, $2) RETURNING *',
        [total, 'paid'],
      );
      const order = orderResult.rows[0];

      for (const item of itemsWithPrice) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [order.id, item.product_id, item.quantity, item.price],
        );
      }

      await client.query('COMMIT');
      return { ...order, items: itemsWithPrice };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM orders');
    return result.rows;
  }

  async findOne(id: number) {
    const order = await this.pool.query('SELECT * FROM orders WHERE id = $1', [
      id,
    ]);
    const items = await this.pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id],
    );
    return { ...order.rows[0], items: items.rows };
  }

  async updateStatus(id: number, status: string) {
    const result = await this.pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );
    return result.rows[0];
  }

  async validateCart(items: any[]) {
    const errors: string[] = [];
    let total = 0;

    for (const item of items) {
      const productResult = await this.pool.query(
        'SELECT * FROM products WHERE id = $1',
        [item.product_id],
      );
      const product = productResult.rows[0];

      if (!product) {
        errors.push(`Producto con id ${item.product_id} no existe`);
        continue;
      }
      if (product.stock < item.quantity) {
        errors.push(`Producto ${product.name} no tiene stock suficiente`);
        continue;
      }

      total += product.price * item.quantity;
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, total };
  }
}
