import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, supplierId, ...rest } = createProductDto;
    const product = this.productRepository.create(rest);

    if (categoryId) {
      product.category = await this.categoryRepository.findOneBy({ id: categoryId });
    }

    if (supplierId) {
      product.supplier = await this.supplierRepository.findOneBy({ id: supplierId });
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category', 'supplier'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'supplier', 'details', 'cartItems'],
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, supplierId, ...rest } = updateProductDto;

    Object.assign(product, rest);

    if (categoryId) {
      product.category = await this.categoryRepository.findOneBy({ id: categoryId });
    }

    if (supplierId) {
      product.supplier = await this.supplierRepository.findOneBy({ id: supplierId });
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
