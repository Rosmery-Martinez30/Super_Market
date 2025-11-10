import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  create(@Body() dto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(dto);
  }

  @Get()
  findAll() {
    return this.shoppingCartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shoppingCartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shoppingCartService.remove(id);
  }

  @Delete('clear/:customerId')
  clearCart(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.shoppingCartService.clearCustomerCart(customerId);
  }
}
