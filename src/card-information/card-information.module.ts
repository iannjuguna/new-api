import {Module} from '@nestjs/common';
import {CardInformationService} from './card-information.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {CardInformationController} from './card-information.controller';
import {CardSchema} from './card-information.model';
import {UploadService} from '../upload/upload.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Cards', schema: CardSchema}]),
        PassportModule.register({defaultStrategy: 'jwt'})
    ],
    providers: [CardInformationService, UploadService],
    controllers: [CardInformationController]
})
export class CardInformationModule {
}
