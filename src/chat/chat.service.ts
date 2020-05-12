import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CommonResponseModel} from '../utils/app-service-data';
import {ChatDataModel, MessageModel} from './chat.model';
import {UsersDTO} from '../users/users.model';

@Injectable()
export class ChatService {
    constructor(@InjectModel('Chat') private readonly chatModel: Model<any>) {
    }

    // initializes the chat
    public async initializeTheChat(messageBody: MessageModel): Promise<CommonResponseModel> {
        messageBody.createdAt = Date.now();
        let chatData: ChatDataModel = <ChatDataModel> Object.assign({
            user: messageBody.user,
            store: messageBody.store,
            status: 'Opened',
            messages: []
        });
        chatData.messages.push(messageBody);
        chatData.lastMessage = messageBody.message;
        chatData.lastMessageTime = messageBody.createdAt;
        try {
            const checkIfAlreadyChatExist = await this.chatModel.find({$and: [{user: messageBody.user}, {status: 'Opened'}]});
            if (checkIfAlreadyChatExist.length > 0) {
                return {response_code: HttpStatus.CREATED, response_data: checkIfAlreadyChatExist[0], extra: 'Chat initialized successfully'};
            } else {
                const res = await this.chatModel.create(chatData);
                const chatInfo = await this.chatModel.findById(res._id).populate('user');
                return {response_code: HttpStatus.CREATED, response_data: chatInfo, extra: 'Chat initialized successfully'};
            }
        } catch (e) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not initialize'};
        }
    }

    // get's all chat
    public async getAllChat(): Promise<CommonResponseModel> {
        try {
            const list = await this.chatModel.find({status: 'Opened'}).populate('user');
            return {response_code: HttpStatus.OK, response_data: list};
        } catch (e) {
            return {response_code: HttpStatus.OK, response_data: []};
        }
    }

    // get's user chat list
    public async getUserChatList(userId: string): Promise<CommonResponseModel> {
        try {
            const list = await this.chatModel.findOne({$and: [{user: userId}, {status: 'Opened'}]});
            return {response_code: HttpStatus.OK, response_data: list};
        } catch (e) {
            return {response_code: HttpStatus.OK, response_data: []};
        }
    }

    // add messages
    public async saveMessage(message: MessageModel): Promise<CommonResponseModel> {
        try {
            const chat: ChatDataModel = await this.chatModel.findById(message.chatId);
            if (chat) {
                message.createdAt = Date.now();
                chat.messages.push(message);
                chat.lastMessage = message.message;
                chat.lastMessageTime = message.createdAt;
                await this.chatModel.findByIdAndUpdate(message.chatId, chat);
                return {response_code: HttpStatus.OK, response_data: 'Message saved successfully'};
            }
        } catch (e) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save messages'};
        }
    }

    // closes chat
    public async closeChat(chatId: string): Promise<CommonResponseModel> {
        try {
            const chatInfo: ChatDataModel = await this.chatModel.findById(chatId);
            if (chatInfo) {
                chatInfo.status = 'Closed';
                console.log(chatInfo);
                const res = await this.chatModel.findByIdAndUpdate(chatId, chatInfo);
                const list = await this.chatModel.find({status: 'Opened'}).populate('user');
                return {response_code: HttpStatus.OK, response_data: list, extra: 'Chat closed successfully'};
            }
        } catch (e) {
            console.log('COULD NOT CLOSE CHAT');
            console.log(e);
        }
    }
}
