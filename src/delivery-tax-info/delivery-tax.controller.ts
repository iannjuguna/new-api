import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CommonResponseModel} from '../utils/app-service-data';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {DeliveryTaxService} from './delivery-tax.service';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {DeliveryTaxDTO, UserLocationDTO} from './delivery-tax.model';

@Controller('delivery/tax/settings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DeliveryTaxController {
    constructor(private deliveryService: DeliveryTaxService) {
    }

    @Get('')
    public getDeliverySettings(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.deliveryService.getStoreDeliverySettings(user);
    }

    @Post('/save')
    public saveSettings(@GetUser() user: UsersDTO, @Body() deliveryData: DeliveryTaxDTO): Promise<CommonResponseModel> {
        return this.deliveryService.saveDeliveryTaxSettings(user, deliveryData);
    }

    @Post('/get/charges')
    public calculateDistanceAndGetCharges(@GetUser() user: UsersDTO, @Body() userLocationDTO: UserLocationDTO): Promise<CommonResponseModel> {
        return this.deliveryService.calculateDistance(user, userLocationDTO);
    }

    @Get("/details")
    public getDeliverySettingsDetails(@GetUser() user:UsersDTO):Promise<CommonResponseModel>{
        return this.deliveryService.getAdminDeliverySettings();
    }
}
