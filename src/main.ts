import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { DealsModule } from './deals/deals.module';
import { ProductsModule } from './products/products.module';
import * as dotenv from 'dotenv';
import { AddressModule } from './address/address.module';
import { FavouritesModule } from './favourites/favourites.module';
import { globalConfig } from './utils/app-service-data';
import { OrderModule } from './order/order.module';
import { CouponsModule } from './coupons/coupons.module';
import { CardInformationModule } from './card-information/card-information.module';
import { LocationsModule } from './locations/locations.module';
import { CartModule } from './cart/cart.module';
import { RatingModule } from './rating/rating.module';
import { NotificationsModule } from './notifications/notifications.module';
import * as sentry from '@sentry/node';
import { ProductstockModule } from './productstock/productstock.module';
import { SettingModule } from './setting/setting.module';
import { from } from 'rxjs';
import { BannerModule } from './Banner/banner.module';
import { DeliveryTaxModule } from './delivery-tax-info/delivery-tax.module';
import { BusinessModule } from './business/business.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { SeedService } from './seed/seed.service';
const Cron = require('cron').CronJob;


const os = require('os');

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    if (process.env.NODE_ENV === 'production') {
        sentry.init({
            dsn: 'https://ca602143bd1c4e1584d5b9cd5781e06b@sentry.io/1783844',
        });
    }

    //
    let options;
    if (process.env.NODE_ENV === 'production') {
        options = new DocumentBuilder().setTitle('Groceries App').setBasePath('/').setVersion('v1').addBearerAuth().setSchemes('https').build();
    } else {
        options = new DocumentBuilder().setTitle('Groceries App').setBasePath('/').setVersion('v1').addBearerAuth().build();
        const networkData = os.networkInterfaces();
        if (process.platform.toString() == 'darwin') {
            globalConfig.localIp = networkData.en0.find(data => data.family === 'IPv4').address;
            console.log('IP', globalConfig.localIp);
        } else if (process.platform.toString() == 'win32-x64') {
            globalConfig.localIp = networkData['Wireless Network Connection 16'].find(data => data.family === 'IPv4').address;
            console.log(globalConfig.localIp);
        }
    }
    const document = SwaggerModule.createDocument(app, options, {
        include: [UsersModule, CategoriesModule, UploadModule, DealsModule, ProductsModule, AddressModule, FavouritesModule, OrderModule, CouponsModule, CardInformationModule, LocationsModule, CartModule, RatingModule, SettingModule, NotificationsModule, ProductstockModule, BannerModule, DeliveryTaxModule, BusinessModule,
            SubcategoryModule]
    });
    SwaggerModule.setup('/explorer', app, document);
    const configService = app.get(SeedService);

    //on server run seed set if SEED in .env file true
    await configService.seed((process.env.SEED=="true")?true:false)
    // // on every 59 mins seed db set
    new Cron('0 */59 * * * *', async function () {
        console.log("crone job to set seed db...Inside seed")
        await configService.seed((process.env.SEED=="true")?true:false)
    }, null, true)


    await app.listen(process.env.PORT || 4000);
}

bootstrap();





// //on server run seed set if SEED in .env file true
    // require('../mongo-seeding').seed((process.env.SEED=="true")?true:false);
    //  // on every 20 mins seed db set
    // new Cron('0 */59 * * * *', function () {
    //     console.log("crone job to set seed db...")
    //     require('../mongo-seeding').seed((process.env.SEED=="true")?true:false);
    // }, null, true)
