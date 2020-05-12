import {Body, Controller, Post} from '@nestjs/common';
import {ChatService} from './chat.service';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {MessageModel} from './chat.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('chat')
export class ChatController {
    constructor(private chat: ChatService) {
    }

    // initializes
    @Post('initialize/chat')
    public initializeChat(@GetUser() user:UsersDTO,@Body() chatData:MessageModel):Promise<CommonResponseModel> {
        return this.chat.initializeTheChat(chatData);
    }
}
