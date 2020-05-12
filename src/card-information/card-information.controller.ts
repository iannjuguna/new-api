import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CardInformationService} from './card-information.service';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {GetUser} from '../utils/user.decorator';
import {CardInformationDTO} from './card-information.model';
import {UsersDTO} from '../users/users.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('payment-method')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CardInformationController {
    constructor(private cardService: CardInformationService) {

    }

    // sends request to get cards list
    @Get('/get/user/cards')
    public getCardsList(@GetUser() user: UsersDTO) {
        return this.cardService.getSavedCards(user._id);
    }

    // sends request to make payment
    @Post('/save/card')
    public makePayment(@GetUser() user: UsersDTO, @Body() cardInfo: CardInformationDTO) {
        return this.cardService.saveCardInformation(user, cardInfo);
    }

    // sends requets to delete card
    @Delete('/delete/card/:cardId')
    public deleteCard(@Param('cardId') cardId: string): Promise<CommonResponseModel> {
        return this.cardService.deleteCard(cardId);
    }
}
