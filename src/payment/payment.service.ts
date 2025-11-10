import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { GeneralApplicationException } from 'src/common/exceptions/general-application.exception';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { purchaseId, userId, ...paymentData } = createPaymentDto;

      const purchase = await this.purchaseRepository.findOne({ where: { id: purchaseId } });
      if (!purchase) throw new EntityNotFoundException('Purchase', { id: purchaseId });

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new EntityNotFoundException('User', { id: userId });

      const payment = this.paymentRepository.create({
        ...paymentData,
        purchase,
        user,
      });

      await this.paymentRepository.save(payment);

      this.logger.log(`💰 Payment registered by user ${user.name} for purchase ${purchase.id}`);

      return {
        message: 'Payment created successfully',
        payment,
        status: HttpStatus.CREATED,
        ok: true,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;

      this.logger.error('Error creating payment', error);
      throw new GeneralApplicationException('DB failure', {
        error,
        context: { action: 'createPayment', retry: false },
      });
    }
  }

  async findAll() {
    try {
      const payments = await this.paymentRepository.find({
        relations: ['purchase', 'user'],
        order: { id: 'DESC' },
      });

      return {
        message: 'Payments retrieved successfully',
        payments,
        status: HttpStatus.OK,
        ok: true,
      };
    } catch (error) {
      throw new GeneralApplicationException('DB failure', {
        error,
        context: { action: 'findAllPayments', retry: false },
      });
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: ['purchase', 'user'],
      });

      if (!payment) throw new EntityNotFoundException('Payment', { id });

      return {
        message: 'Payment found successfully',
        payment,
        status: HttpStatus.OK,
        ok: true,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new GeneralApplicationException('DB failure', {
        error,
        context: { action: 'findPayment', retry: false },
      });
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) throw new EntityNotFoundException('Payment', { id });

      const updatedPayment = this.paymentRepository.merge(payment, updatePaymentDto);
      await this.paymentRepository.save(updatedPayment);

      this.logger.log(`🔄 Payment ${id} updated`);

      return {
        message: 'Payment updated successfully',
        payment: updatedPayment,
        status: HttpStatus.OK,
        ok: true,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new GeneralApplicationException('DB failure', {
        error,
        context: { action: 'updatePayment', retry: false },
      });
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) throw new EntityNotFoundException('Payment', { id });

      await this.paymentRepository.remove(payment);

      this.logger.log(`🗑️ Payment ${id} deleted`);

      return {
        message: 'Payment deleted successfully',
        status: HttpStatus.OK,
        ok: true,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) throw error;
      throw new GeneralApplicationException('DB failure', {
        error,
        context: { action: 'removePayment', retry: false },
      });
    }
  }
}
