import {Global, HttpModule, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from './users/users.module';
import {CategoriesModule} from './categories/categories.module';
import {UploadModule} from './upload/upload.module';
import {DealsModule} from './deals/deals.module';
import {ProductsModule} from './products/products.module';
import {AddressModule} from './address/address.module';
import {FavouritesModule} from './favourites/favourites.module';
import {OrderModule} from './order/order.module';
import {CouponsModule} from './coupons/coupons.module';
import {CartModule} from './cart/cart.module';
import {CardInformationModule} from './card-information/card-information.module';
import {LocationsModule} from './locations/locations.module';
import {RatingModule} from './rating/rating.module';
import {NotificationsModule} from './notifications/notifications.module';
import {AppController} from './app.controller';
import {ScheduleModule} from 'nest-schedule';
import {ProductstockModule} from './productstock/productstock.module';
import {SettingModule} from './setting/setting.module';
import {BannerModule} from './Banner/banner.module';
import {AppGateway} from './app.gateway';
import {DeliveryTaxModule} from './delivery-tax-info/delivery-tax.module';
import {OrderSchema} from './order/order.model';
import {ChatSchema} from './chat/chat.model';
import {NotificationsSchema} from './notifications/notifications.model';

import {ChatModule} from './chat/chat.module';
import {ChatService} from './chat/chat.service';
import { BusinessModule } from './business/business.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { SeedModule } from './seed/seed.module';


@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: (process.env.NODE_ENV == 'production')?process.env.MONGO_DB_PRODUCTION_URL:process.env.MONGO_DB_TESTING_URL,
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }),
        }),
        UsersModule,
        CategoriesModule,
        UploadModule,
        DealsModule,
        ProductsModule,
        AddressModule,
        FavouritesModule,
        OrderModule,
        CouponsModule,
        CartModule,
        CardInformationModule,
        LocationsModule,
        RatingModule,
        NotificationsModule,
        ScheduleModule.register(),
        ProductstockModule,
        SettingModule,
        BannerModule,
        DeliveryTaxModule,
        BusinessModule,
        SubcategoryModule,
        ChatModule,
        MongooseModule.forFeature([{name: 'Orders', schema: OrderSchema},{name: 'Notifications', schema: NotificationsSchema}, {name: 'Chat', schema: ChatSchema}]),
        SeedModule,
        
    ],
    controllers: [AppController],
    providers: [AppGateway, ChatService],
    exports: [AppGateway]
})
export class AppModule {
}
