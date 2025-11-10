import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string; // "cash", "card", "transfer"

  @IsNumber()
  @IsNotEmpty()
  purchaseId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
