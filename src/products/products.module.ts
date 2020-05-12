import {Module} from '@nestjs/common';
import {ProductsController} from './products.controller';
import {ProductsService} from './products.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ProductsSchema} from './products.model';
import {DealsSchema} from '../deals/deals.model';
import {FavouritesSchema} from '../favourites/favourites.model';
import {CartSchema} from '../cart/cart.model';
import {ProductStockSchema} from '../productstock/productstock.model';
import {CategoriesSchema} from '../categories/categories.model';
import {SubCategoryScema} from '../subcategory/subcategory.model';
import { SettingSchema } from '../setting/setting.model';

import {CouponsSchema} from '../coupons/coupons.model';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Products', schema: ProductsSchema}, {
        name: 'deals',
        schema: DealsSchema,
    }, {
        name: 'Favourites',
        schema: FavouritesSchema,
    },
        {
            name: 'Cart',
            schema: CartSchema,
        },
        {
            name: 'Productstock',
            schema: ProductStockSchema,
        },
        {name: 'Categories', schema: CategoriesSchema},
        {name: 'Subcategories', schema: SubCategoryScema},
        { name: 'Setting', schema: SettingSchema},
        
        {name: 'Coupons', schema: CouponsSchema}
    ]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService,],
})
export class ProductsModule {

}
