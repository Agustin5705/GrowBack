import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

@Injectable()
export class AdminService {
  constructor(private jwtService: JwtService) {}

  private pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  });

  async validateAdmin(username: string, password: string) {
    type AdminRow = {
      id: number;
      username: string;
      password: string;
    };

    const result = await this.pool.query<AdminRow>(
      'SELECT * FROM admins WHERE username = $1',
      [username],
    );

    const admin = result.rows[0] as AdminRow;
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: admin.id, username: admin.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
