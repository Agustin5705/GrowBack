import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService, JwtStrategy],
})
export class AppModule {}
