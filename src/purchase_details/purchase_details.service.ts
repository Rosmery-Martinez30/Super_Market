import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseDetail } from './entities/purchase_detail.entity';
import { CreatePurchaseDetailDto } from './dto/create-purchase_detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase_detail.dto';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class PurchaseDetailsService {
  constructor(
    @InjectRepository(PurchaseDetail)
    private readonly purchaseDetailRepository: Repository<PurchaseDetail>,

    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createPurchaseDetailDto: CreatePurchaseDetailDto) {
    const { purchaseId, productId, quantity, subtotal } = createPurchaseDetailDto;

    const purchase = await this.purchaseRepository.findOne({ where: { id: purchaseId } });
    if (!purchase) throw new NotFoundException(`Purchase ID ${purchaseId} not found`);

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ID ${productId} not found`);

    const detail = this.purchaseDetailRepository.create({
      quantity,
      subtotal,
      purchase,
      product,
    });

    await this.purchaseDetailRepository.save(detail);

    return {
      message: 'Purchase detail created successfully',
      status: HttpStatus.CREATED,
      ok: true,
      detail,
    };
  }

  async findAll() {
    const details = await this.purchaseDetailRepository.find({
      relations: ['purchase', 'product'],
    });

    return {
      message: 'Purchase details retrieved successfully',
      status: HttpStatus.OK,
      ok: true,
      details,
    };
  }

  async findOne(id: number) {
    const detail = await this.purchaseDetailRepository.findOne({
      where: { id },
      relations: ['purchase', 'product'],
    });

    if (!detail) throw new NotFoundException(`PurchaseDetail ID ${id} not found`);

    return {
      message: 'Purchase detail found',
      status: HttpStatus.OK,
      ok: true,
      detail,
    };
  }

  async update(id: number, updatePurchaseDetailDto: UpdatePurchaseDetailDto) {
    const detail = await this.purchaseDetailRepository.findOne({ where: { id } });
    if (!detail) throw new NotFoundException(`PurchaseDetail ID ${id} not found`);

    const { purchaseId, productId, ...rest } = updatePurchaseDetailDto;

    if (purchaseId) {
      const purchase = await this.purchaseRepository.findOne({ where: { id: purchaseId } });
      if (!purchase) throw new NotFoundException(`Purchase ID ${purchaseId} not found`);
      detail.purchase = purchase;
    }

    if (productId) {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException(`Product ID ${productId} not found`);
      detail.product = product;
    }

    Object.assign(detail, rest);
    await this.purchaseDetailRepository.save(detail);

    return {
      message: 'Purchase detail updated successfully',
      status: HttpStatus.OK,
      ok: true,
      detail,
    };
  }

  async remove(id: number) {
    const detail = await this.purchaseDetailRepository.findOne({ where: { id } });
    if (!detail) throw new NotFoundException(`PurchaseDetail ID ${id} not found`);

    await this.purchaseDetailRepository.remove(detail);

    return {
      message: 'Purchase detail deleted successfully',
      status: HttpStatus.OK,
      ok: true,
    };
  }
}
