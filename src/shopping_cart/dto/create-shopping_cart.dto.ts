import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateShoppingCartDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
