import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  category_id?: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
