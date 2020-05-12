import {Controller, UseGuards, Post, Body, Delete, Param, Get, Put} from '@nestjs/common';
import {SettingService} from './setting.service';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {SettingDTO, SettingPinCodeDTO, SettingWorkingHoursDTO, SettingCurrencyAndLanguageDTO, SettingCurrencyDTO, loyaltySettingDTO} from './setting.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {identity} from 'rxjs';

@Controller('setting')
export class SettingController {
    constructor(private settingService: SettingService) {
    }

    //  ***  PINCODE API  *********
    // add pincode
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/pincode')
    public savePinCode(@GetUser() user: UsersDTO, @Body() settingPinCodeData: SettingPinCodeDTO): Promise<CommonResponseModel> {
        return this.settingService.savePinCode(user, settingPinCodeData);
    }

    //find all the data
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/pincode')
    public getPincode(): Promise<CommonResponseModel> {
        return this.settingService.getPincode();
    }

    //delete pin code
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('/:pincode')
    public deletePinCode(@Param('pincode') pincode: string): Promise<CommonResponseModel> {
        return this.settingService.deletePinCode(pincode);
    }

    //  ***  DELIVERY SETTING API *****

    // add delivery time setting
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/working/time')
    public saveWorkingHrs(@GetUser() user: UsersDTO, @Body() settingWorkingHoursDTO: SettingWorkingHoursDTO): Promise<CommonResponseModel> {
        return this.settingService.saveWorkingHrs(user, settingWorkingHoursDTO);
    }

    //get delivery time for admin
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/working/time')
    public getWorkingTime(): Promise<CommonResponseModel> {
        return this.settingService.getWorkingTime();
    } 

    //get delivery time for user
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/working/time/user/:time/:timestamp')
    public getDeliveryTimeUser(@Param('time') time: string,@Param('timestamp') timestamp: number): Promise<CommonResponseModel> {
        return this.settingService.getDeliveryTimeUser(time,timestamp);
    }

    // add currency and language admin 
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/currency/:id')
    public saveCurrency(@Param('id') id:String, @GetUser() user: UsersDTO, @Body() settingCurrencyAndLanguageDTO: SettingCurrencyAndLanguageDTO): Promise<CommonResponseModel> {
        return this.settingService.saveCurrency(user,id, settingCurrencyAndLanguageDTO);
    }
    //get currency and language list admin
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/currency/language/list')
    public getCurrencyAndLanguageList(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.settingService.getCurrencyAndLanguageList(user);
    }

    //get currency and language info admin
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/currency/language/info')
    public getCurrencyAndLanguage(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.settingService.getCurrencyAndLanguage(user);
    }
    

    //get currency
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    @Get('/currency')
    public getCurrency(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.settingService.getCurrency(user);
    }
    //get loyaltyPoint API
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/get/loyalty')
    public getLoyaltyPointFromSetting():Promise<CommonResponseModel>{
        return this.settingService.getLoyaltyPoint();
    }
  //update and add loyalty point
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/update/loyalty/:id')
    public updateLoyaltyPointByAdmin(@Param('id')id:string, @GetUser() user: UsersDTO, @Body() loyaltyData:loyaltySettingDTO):Promise<CommonResponseModel>{
      return this.settingService.updateLoyaltyPointByAdmin(id,user,loyaltyData)
    }
   //this Api for user App get currency and langauge code
   @Get('/user/App')
   public getListCurrecyandLangaugeCode():Promise<CommonResponseModel>{
       return this.settingService.getCurrencyforUserApp();
   }
}
