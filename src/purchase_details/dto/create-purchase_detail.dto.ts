import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePurchaseDetailDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  purchaseId: number;

  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
