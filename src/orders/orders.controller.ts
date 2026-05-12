import { Controller, Post, Put, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('validate')
  validateCart(@Body() items: any[]) {
    return this.ordersService.validateCart(items);
  }

  @Post()
  create(@Body() items: any[]) {
    return this.ordersService.createOrder(items);
  }

  @Put(':id')
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }
}
