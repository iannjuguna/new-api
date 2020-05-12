import {Module} from '@nestjs/common';
import {CategoriesController} from './categories.controller';
import {CategoryService} from './categories.service';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoriesSchema} from './categories.model';
import {ProductsSchema} from '../products/products.model';
import {DealsSchema} from '../deals/deals.model';
import { SubCategoryScema } from '../subcategory/subcategory.model';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        MongooseModule.forFeature([{name: 'Categories', schema: CategoriesSchema},{name: 'Subcategory', schema:SubCategoryScema }, {name: 'Products', schema: ProductsSchema}, {
            name: 'deals',
            schema: DealsSchema
        }])
    ],
    controllers: [CategoriesController],
    providers: [CategoryService],
})
export class CategoriesModule {

}
