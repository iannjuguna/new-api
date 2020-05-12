import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ChatSchema} from './chat.model';
import {ChatService} from './chat.service';
import {ChatController} from './chat.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Chat', schema: ChatSchema}])],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule {

}
