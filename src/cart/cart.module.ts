import {Module} from '@nestjs/common';
import {CartService} from './cart.service';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {CartSchema} from './cart.model';
import {ProductsSchema} from '../products/products.model';
import {CartController} from './cart.controller';
import {CouponsSchema} from '../coupons/coupons.model';
import {UsersSchema} from '../users/users.model';
import {DeliveryTaxSchema} from '../delivery-tax-info/delivery-tax.model';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {name: 'Cart', schema: CartSchema},
                {name: 'Products', schema: ProductsSchema},
                {name: 'Coupons', schema: CouponsSchema},
                {name: 'Users', schema: UsersSchema},
                {name: 'DeliveryTaxSettings', schema: DeliveryTaxSchema}
            ],
        ),
        PassportModule.register({defaultStrategy: 'jwt'}),
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {
}
