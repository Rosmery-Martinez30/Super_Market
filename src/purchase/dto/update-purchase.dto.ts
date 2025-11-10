import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsOptional()
  @IsNumber()
  total?: number;
}
