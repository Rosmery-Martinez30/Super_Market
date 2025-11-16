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

  /**
   * Crea un producto. createProductDto puede incluir imageUrl opcional.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, supplierId, ...rest } = createProductDto;

    // create acepta Partial<Product>, casteamos por seguridad de tipos
    const product = this.productRepository.create(rest as Partial<Product>);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (category) product.category = category;
    }

    if (supplierId) {
      const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
      if (supplier) product.supplier = supplier;
    }

    return this.productRepository.save(product);
  }

  /**
   * Obtiene todos los productos (con category y supplier).
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'supplier'],
      order: { id: 'ASC' },
    });
  }

  /**
   * Obtiene un producto por id.
   * Lanza NotFoundException si no existe.
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'supplier', 'details', 'cartItems'],
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  /**
   * Actualiza un producto parcialmente.
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, supplierId, ...rest } = updateProductDto;

    // aplica cambios
    Object.assign(product, rest as Partial<Product>);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      product.category = category ?? null;
    }

    if (supplierId) {
      const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
      product.supplier = supplier ?? null;
    }

    return this.productRepository.save(product);
  }

  /**
   * Actualiza solo el campo imageUrl (útil tras subir archivo).
   */
  async updateImageUrl(id: number, imageUrl: string): Promise<Product> {
    const product = await this.findOne(id);
    product.imageUrl = imageUrl;
    return this.productRepository.save(product);
  }

  /**
   * Elimina producto.
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
