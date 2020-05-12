import { Module } from '@nestjs/common';
import { ProductstockService } from './productstock.service';
import { ProductstockController } from './productstock.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {ProductStockSchema} from './productstock.model';
import { ProductsSchema } from '../products/products.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Productstock', schema: ProductStockSchema},
  { name: 'Products', schema: ProductsSchema },
])],
  providers: [ProductstockService],
  controllers: [ProductstockController]
})
export class ProductstockModule {}
