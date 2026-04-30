import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class ProductsService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findAll(): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id`,
    );
    return result.rows;
  }

  async findOne(id: number): Promise<Product | null> {
    const result = await this.pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async create(
    product: Omit<Product, 'id'> & { category_id?: number },
  ): Promise<Product> {
    const result = await this.pool.query(
      'INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [product.name, product.price, product.stock, product.category_id],
    );
    return result.rows[0];
  }

  async update(
    id: number,
    product: Partial<Omit<Product, 'id'>> & { category_id?: number },
  ): Promise<Product | null> {
    const result = await this.pool.query(
      `UPDATE products 
     SET name = COALESCE($1, name), 
         price = COALESCE($2, price), 
         stock = COALESCE($3, stock), 
         category_id = COALESCE($4, category_id) 
     WHERE id = $5 RETURNING *`,
      [product.name, product.price, product.stock, product.category_id, id],
    );
    return result.rows[0] || null;
  }

  async remove(id: number): Promise<Product | null> {
    const result = await this.pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByCategory(categoryId: number): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = $1`,
      [categoryId],
    );
    return result.rows;
  }
}
