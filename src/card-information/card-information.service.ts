import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';
import {CardInformationDTO} from './card-information.model';
import {UploadService} from '../upload/upload.service';

@Injectable()
export class CardInformationService {
    constructor(@InjectModel('Cards') private readonly cardModel: Model<any>, private utilService: UploadService) {

    }

    // get's saved cards of user
    public async getSavedCards(userId: string): Promise<CommonResponseModel> {
        const cards = await this.cardModel.find({user: userId});
        return {response_code: HttpStatus.OK, response_data: cards};
    }

    // saves card information
    public async saveCardInformation(user: UsersDTO, cardInformation: CardInformationDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Sorry !!, you are not allowed to access this api'};
        } else {
            cardInformation.user = user._id;
            cardInformation.lastFourDigits = cardInformation.cardNumber.slice(12);
            const check = await this.cardModel.findOne({cardNumber: cardInformation.cardNumber, user: cardInformation.user});
            if (check) {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'You have already saved this card'};
            } else {
                const response = await this.cardModel.create(cardInformation);
                if (response._id) {
                    return {response_code: HttpStatus.CREATED, response_data: 'Card saved successfully'};
                } else {
                    return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save card'};
                }
            }
        }
    }

    // deletes user's card
    public async deleteCard(cardId: string): Promise<CommonResponseModel> {
        const response = await this.cardModel.findByIdAndDelete(cardId);
        return {response_code: HttpStatus.OK, response_data: 'Card deleted successfully'};
    }
}
