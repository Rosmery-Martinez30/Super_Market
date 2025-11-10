import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { User } from 'src/user/entities/user.entity';
import { PurchaseDetail } from 'src/purchase_details/entities/purchase_detail.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PurchaseDetail)
    private readonly detailRepository: Repository<PurchaseDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const { customerId, userId, total, details } = createPurchaseDto;

    // Buscar relaciones
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Crear entidad principal
    const purchase = this.purchaseRepository.create({
      customer,
      user,
      total,
    });

    // Crear detalles
    const detailEntities: PurchaseDetail[] = [];
    for (const d of details) {
      const product = await this.productRepository.findOne({ where: { id: d.productId } });
      if (!product) throw new NotFoundException(`Product #${d.productId} not found`);

      const detail = this.detailRepository.create({
        product,
        quantity: d.quantity,
        subtotal: d.subtotal, 
      });
      detailEntities.push(detail);
    }

    purchase.details = detailEntities;

    return await this.purchaseRepository.save(purchase);
  }

  async findAll(): Promise<Purchase[]> {
    return this.purchaseRepository.find({
      relations: ['customer', 'user', 'details', 'details.product', 'payments'],
    });
  }

  async findOne(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({
      where: { id },
      relations: ['customer', 'user', 'details', 'details.product', 'payments'],
    });

    if (!purchase) throw new NotFoundException(`Purchase #${id} not found`);
    return purchase;
  }

  async update(id: number, updateDto: UpdatePurchaseDto): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) throw new NotFoundException('Purchase not found');

    Object.assign(purchase, updateDto);
    return this.purchaseRepository.save(purchase);
  }

  async remove(id: number): Promise<void> {
    const result = await this.purchaseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Purchase #${id} not found`);
  }
}
