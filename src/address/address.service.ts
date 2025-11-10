import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Crear dirección
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const customer = await this.customerRepository.findOne({
      where: { id: createAddressDto.customerId },
    });

    if (!customer) throw new NotFoundException(`Customer with ID ${createAddressDto.customerId} not found`);

    const address = this.addressRepository.create({
      ...createAddressDto,
      customer,
    });

    return await this.addressRepository.save(address);
  }

  // Obtener todas las direcciones
  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({
      relations: ['customer'],
    });
  }

  // Obtener una dirección
  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!address) throw new NotFoundException(`Address with ID ${id} not found`);
    return address;
  }

  // Actualizar dirección
  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);

    if (updateAddressDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateAddressDto.customerId },
      });

      if (!customer) throw new NotFoundException(`Customer with ID ${updateAddressDto.customerId} not found`);
      address.customer = customer;
    }

    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  // Eliminar dirección
  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
