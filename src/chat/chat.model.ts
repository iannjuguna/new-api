import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    status: {
        type: String
    },
    messages: {
        type: Array
    },
    lastMessage: {
        type: String
    },
    lastMessageTime: {
        type: Number
    }
}, {timestamps: true});

export interface ChatDataModel {
    user: string;
    store: string;
    status: string;
    messages: Array<MessageModel>;
    createdAt?: number;
    lastMessage: string;
    lastMessageTime: number;
}

export interface MessageModel {
    message: string;
    createdAt: number;
    user: string;
    store: string;
    sentBy: string;
    chatId?: string;
}
