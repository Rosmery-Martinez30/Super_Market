import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Crear un nuevo proveedor
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  // Obtener todos los proveedores con sus productos
  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find({
      relations: ['products'],
      order: { id: 'ASC' },
    });
  }

  // Obtener un proveedor por id
  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!supplier) throw new NotFoundException(`Supplier with ID ${id} not found`);
    return supplier;
  }

  // Actualizar proveedor
  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  // Eliminar proveedor
  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }
}
