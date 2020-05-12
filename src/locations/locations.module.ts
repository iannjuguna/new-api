import {Module} from '@nestjs/common';
import {LocationsController} from './locations.controller';
import {LocationsService} from './locations.service';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {LocationsSchema} from './locations.model';
import {UploadService} from '../upload/upload.service';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        MongooseModule.forFeature([{name: 'Locations', schema: LocationsSchema}])
    ],
    controllers: [LocationsController],
    providers: [LocationsService, UploadService]
})
export class LocationsModule {
}
