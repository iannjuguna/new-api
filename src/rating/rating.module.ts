import {Module} from '@nestjs/common';
import {RatingController} from './rating.controller';
import {RatingService} from './rating.service';
import {MongooseModule} from '@nestjs/mongoose';
import {RatingSchema} from './rating.model';
import {PassportModule} from '@nestjs/passport';
import {ProductsSchema} from '../products/products.model';
import {OrderSchema} from '../order/order.model';
import {CartSchema} from '../cart/cart.model';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Rating', schema: RatingSchema}, {
            name: 'Products',
            schema: ProductsSchema,
        }, {name: 'Orders', schema: OrderSchema},
          {name: 'Cart',schema: CartSchema}
        ]),
        PassportModule.register({defaultStrategy: 'jwt'}),
    ],
    controllers: [RatingController],
    providers: [RatingService],
})
export class RatingModule {
}
