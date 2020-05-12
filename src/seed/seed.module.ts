import {MongooseModule} from '@nestjs/mongoose';
import { SeedService } from './seed.service'; 
import {Module, HttpService, HttpModule} from '@nestjs/common';
import {NotificationsSchema} from '../notifications/notifications.model';
import {UsersSchema} from '../users/users.model';
import {CategoriesSchema} from '../categories/categories.model';
import {DealsSchema} from '../deals/deals.model';
import {ProductsSchema} from '../products/products.model';
import {AddressSchema} from '../address/address.model';
import {FavouritesSchema} from '../favourites/favourites.model';
import {OrderSchema} from '../order/order.model';
import {CouponsSchema} from '../coupons/coupons.model';
import {CartSchema} from '../cart/cart.model';
import {RatingSchema} from '../rating/rating.model';
import {SettingSchema} from '../setting/setting.model';
import {BannerSchema} from '../Banner/banner.model';
import {DeliveryTaxSchema} from '../delivery-tax-info/delivery-tax.model';
import {ChatSchema} from '../chat/chat.model';
import { SubCategoryScema } from '../subcategory/subcategory.model';
import { BusinessSchema } from '../business/business.model';

       
@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Notifications', schema: NotificationsSchema},
      {name: 'Categories', schema: CategoriesSchema},
      {name: 'Users', schema: UsersSchema},
      {name: 'Deals', schema: DealsSchema},
      {name: 'Products', schema: ProductsSchema},
      {name: 'Address', schema: AddressSchema},
      {name: 'Favourites', schema: FavouritesSchema},
      {name: 'Order', schema: OrderSchema},
      {name: 'Coupons', schema: CouponsSchema},
      {name: 'Cart', schema: CartSchema},
      {name: 'Rating', schema: RatingSchema},
      {name: 'Setting', schema: SettingSchema},
      {name: 'Banner', schema: BannerSchema},
      {name: 'Chat', schema: ChatSchema},
      {name: 'DeliveryTaxSettings', schema: DeliveryTaxSchema},
      {name: 'Subcategory', schema:SubCategoryScema },
      {name: 'Business', schema: BusinessSchema}
    ]),
    HttpModule,
],
  controllers: [],
  providers: [SeedService]
})
export class SeedModule {}
