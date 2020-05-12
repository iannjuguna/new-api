import {Module} from '@nestjs/common';
import {DealsController} from './deals.controller';
import {DealsService} from './deals.service';
import {MongooseModule} from '@nestjs/mongoose';
import {DealsSchema} from './deals.model';
import {ProductsSchema} from '../products/products.model';
import {CategoriesSchema} from '../categories/categories.model';

import {PassportModule} from '@nestjs/passport'; 

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'deals', schema: DealsSchema},
            {name: 'Products', schema: ProductsSchema},
            {name: 'Categories', schema: CategoriesSchema},


        ]),
        PassportModule.register({defaultStrategy: 'jwt'}),
    ],
    controllers: [DealsController],
    providers: [DealsService],
})
export class DealsModule {

}
