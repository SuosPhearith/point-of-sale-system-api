// create-product.dto.ts
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  IsNumber,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  alert?: number;
}
