import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.details, { onDelete: 'CASCADE' })
  purchase: Purchase;

  @ManyToOne(() => Product, (product) => product.details)
  product: Product;
}