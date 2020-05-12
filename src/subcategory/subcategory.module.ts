import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { SubCategoryScema } from './subcategory.model';
import {CategoriesSchema} from '../categories/categories.model';
import {ProductsSchema} from '../products/products.model';

import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Subcategory', schema:SubCategoryScema },
      {name: 'Categories', schema: CategoriesSchema},
      {name: 'Products', schema: ProductsSchema}
  ]),
  PassportModule.register({defaultStrategy: 'jwt'}),
],
  providers: [SubcategoryService],
  controllers: [SubcategoryController]
})
export class SubcategoryModule {}
