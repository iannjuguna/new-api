import {Module, HttpService, HttpModule} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {MongooseModule} from '@nestjs/mongoose';
import {OrderSchema} from './order.model';
import {CartSchema} from '../cart/cart.model';
import {UploadService} from '../upload/upload.service';
import {CardSchema} from '../card-information/card-information.model';
import {NotificationsSchema} from '../notifications/notifications.model';
import { BusinessSchema } from '../business/business.model';
import {ProductsSchema} from '../products/products.model';
import {CartService} from '../cart/cart.service';
import {CouponsSchema} from '../coupons/coupons.model';
import {UsersSchema} from '../users/users.model';
import {RatingSchema} from '../rating/rating.model';
import {CategoriesSchema} from '../categories/categories.model';
import {AppGateway} from '../app.gateway';
import {ChatService} from '../chat/chat.service';
import {ChatSchema} from '../chat/chat.model';
import {DeliveryTaxSchema} from '../delivery-tax-info/delivery-tax.model';
import { SettingSchema } from '../setting/setting.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Orders', schema: OrderSchema},
            {name: 'Cart', schema: CartSchema},
            {name: 'Cards', schema: CardSchema},
            {name: 'Notifications', schema: NotificationsSchema},
            {name: 'Products', schema: ProductsSchema},
            {name: 'Coupons', schema: CouponsSchema},
            {name: 'Users', schema: UsersSchema},
            {name: 'Rating', schema: RatingSchema},
            {name: 'Categories', schema: CategoriesSchema},
            {name: 'Chat', schema: ChatSchema},
            {name: 'Business', schema: BusinessSchema},
            { name: 'Setting', schema: SettingSchema},

            {name: 'DeliveryTaxSettings', schema: DeliveryTaxSchema}
        ]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        HttpModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, UploadService, CartService, ChatService],
})
export class OrderModule {

}
