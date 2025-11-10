import { IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseDetailDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  subtotal: number;
}

export class CreatePurchaseDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseDetailDto)
  details: PurchaseDetailDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  paymentIds?: number[];
}
