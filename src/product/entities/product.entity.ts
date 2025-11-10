import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { PurchaseDetail } from 'src/purchase_details/entities/purchase_detail.entity';
import { ShoppingCart } from 'src/shopping_cart/entities/shopping_cart.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  // Relaciones
@ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL', nullable: true })
category: Category | null;


@ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'SET NULL', nullable: true })
supplier: Supplier | null;

  @OneToMany(() => PurchaseDetail, (detail) => detail.product, { cascade: true })
  details: PurchaseDetail[];

  @OneToMany(() => ShoppingCart, (cart) => cart.product, { cascade: true })
  cartItems: ShoppingCart[];
}
