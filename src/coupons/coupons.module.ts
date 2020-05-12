import {Module} from '@nestjs/common';
import {CouponsController} from './coupons.controller';
import {CouponsService} from './coupons.service';
import {MongooseModule} from '@nestjs/mongoose';
import {CouponsSchema} from './coupons.model';
import {ProductsSchema} from '../products/products.model';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Coupons', schema: CouponsSchema},{name: 'Products',schema: ProductsSchema}])],
    controllers: [CouponsController],
    providers: [CouponsService]
})
export class CouponsModule {
}
