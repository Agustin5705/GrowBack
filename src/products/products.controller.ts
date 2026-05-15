import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService, Product } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.findOne(Number(id));
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsService.update(
      Number(id),
      updateProductDto,
    );
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.remove(Number(id));
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(Number(categoryId));
  }
}
