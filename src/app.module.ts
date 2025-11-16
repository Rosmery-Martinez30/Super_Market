// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { ShoppingCartModule } from './shopping_cart/shopping_cart.module';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { AddressModule } from './address/address.module';
import { PaymentModule } from './payment/payment.module';
import { PurchaseDetailsModule } from './purchase_details/purchase_details.module';
import { UserModule } from './user/user.module';
import { PurchaseModule } from './purchase/purchase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM config (ajusta env vars en .env)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: true,
      synchronize: true, // recomendable false en producción
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),

    // Servir archivos estáticos (uploads) en /uploads/<filename>
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Tus módulos
    ProductModule,
    PaymentModule,
    CustomerModule,
    ShoppingCartModule,
    CategoryModule,
    SupplierModule,
    AddressModule,
    PurchaseDetailsModule,
    UserModule,
    PurchaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
