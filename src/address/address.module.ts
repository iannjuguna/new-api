import {Module} from '@nestjs/common';
import {AddressController} from './address.controller';
import {AddressService} from './address.service';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {AddressSchema} from './address.model';
import {UploadService} from '../upload/upload.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Address', schema: AddressSchema}]),
        PassportModule.register({defaultStrategy: 'jwt'})
    ],
    controllers: [AddressController],
    providers: [AddressService, UploadService]
})
export class AddressModule {

}
