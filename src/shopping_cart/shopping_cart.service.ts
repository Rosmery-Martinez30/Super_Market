import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { CreateShoppingCartDto } from './dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { Product } from 'src/product/entities/product.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly cartRepository: Repository<ShoppingCart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateShoppingCartDto): Promise<ShoppingCart> {
    const { productId, customerId, quantity } = dto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    if (quantity > product.stock) {
      throw new BadRequestException('Insufficient product stock');
    }

    const item = this.cartRepository.create({
      product,
      customer,
      quantity,
    });

    return this.cartRepository.save(item);
  }

  async findAll(): Promise<ShoppingCart[]> {
    return this.cartRepository.find({
      relations: ['product', 'customer'],
    });
  }

  async findOne(id: number): Promise<ShoppingCart> {
    const cartItem = await this.cartRepository.findOne({
      where: { id },
      relations: ['product', 'customer'],
    });
    if (!cartItem) throw new NotFoundException(`Cart item #${id} not found`);
    return cartItem;
  }

  async update(id: number, dto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    const cartItem = await this.cartRepository.findOne({ where: { id } });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (dto.quantity !== undefined && dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    Object.assign(cartItem, dto);
    return this.cartRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item #${id} not found`);
    }
  }

  async clearCustomerCart(customerId: number): Promise<void> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    await this.cartRepository.delete({ customer });
  }
}
