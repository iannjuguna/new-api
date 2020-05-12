import {Module} from '@nestjs/common';
import {FavouritesController} from './favourites.controller';
import {CartSchema} from '../cart/cart.model';
import {FavouritesService} from './favourites.service';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {FavouritesSchema} from './favourites.model';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Favourites', schema: FavouritesSchema},{name: 'Cart',schema: CartSchema}]),
        PassportModule.register({defaultStrategy: 'jwt'})
    ],
    controllers: [FavouritesController],
    providers: [FavouritesService]
})
export class FavouritesModule {
}
