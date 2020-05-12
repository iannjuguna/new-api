import {Injectable, HttpStatus} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UsersDTO} from '../users/users.model';
import {SettingDTO, SettingPinCodeDTO, SettingWorkingHoursDTO, SettingCurrencyDTO,SettingCurrencyAndLanguageDTO, loyaltySettingDTO} from './setting.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {json} from 'express';

const GeneralService = require('../utils/general-service');

//import {General} from '../utils/general-service'

@Injectable()
export class SettingService {
    constructor(@InjectModel('Setting') private readonly settingModel: Model<any>) {
    }

    // **************PINCODE*************
    //add pin code
    public async savePinCode(user: UsersDTO, settingPinCodeDTO: SettingPinCodeDTO): Promise<CommonResponseModel> {
        let pincode = settingPinCodeDTO.pincode;
        if (user && user.role == 'Admin') {
            let setting = await this.settingModel.findOne({});
            if (setting) {
                if (setting.pincode && setting.pincode.length) {
                    if (setting.pincode.indexOf(pincode) == -1) {
                        setting.pincode.push(pincode);
                        await setting.save();
                        return {response_code: HttpStatus.CREATED, response_data: 'PinCode saved successfully'};
                    } else {
                        return {response_code: 400, response_data: 'PinCode already exist.'};
                    }
                } else {
                    setting.pincode = [pincode];
                    await setting.save();
                    return {response_code: HttpStatus.CREATED, response_data: 'PinCode saved successfully'};
                }
            } else {
                const setting = await this.settingModel.create({pincode: [pincode]});
                return {response_code: HttpStatus.CREATED, response_data: 'PinCode saved successfully'};
            }
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create PinCode'};
        }
    }

    //get all the PinCode
    public async getPincode(): Promise<CommonResponseModel> {
        const res = await this.settingModel.findOne({}, 'pincode');

        if (res && res.pincode && res.pincode.length) {
            let obj = res.toJSON();
            return {response_code: HttpStatus.OK, response_data: obj};
        } else {
            return {response_code: 400, response_data: {pincode: []}};
        }
    }

    //delete pin code
    public async deletePinCode(pincode: string): Promise<CommonResponseModel> {
        const setting = await this.settingModel.findOne({}, 'pincode');
        if (setting && setting.pincode.length) {
            let index = setting.pincode.indexOf(pincode);
            if (index > -1) {
                setting.pincode.splice(index, 1);
                await setting.save();
            }
            return {response_code: 200, response_data: 'PinCode deleted successfully'};
        } else {
            return {response_code: 400, response_data: 'No pincode exist'};
        }
    }

    //*******WORKING HRS*********** */

    //save working hours
    public async saveWorkingHrs(user: UsersDTO, settingWorkingHoursDTO: SettingWorkingHoursDTO): Promise<CommonResponseModel> {
        // console.log("settingWorkingHoursDTO",JSON.stringify(settingWorkingHoursDTO))
        if (user && user.role == 'Admin') {
            let setting = await this.settingModel.findOne({}, 'workingHours');
            if (setting) {
                setting.workingHours = settingWorkingHoursDTO.workingHours;
                await setting.save();
                return {response_code: HttpStatus.CREATED, response_data: 'WorkingHours saved successfully'};
            } else {
                const setting = await this.settingModel.create({workingHours: settingWorkingHoursDTO.workingHours});
                return {response_code: HttpStatus.CREATED, response_data: setting, extra: 'WorkingHours saved successfully'};
            }
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create PinCode'};
        }
    }

    //get working Hrs for admin
    public async getWorkingTime(): Promise<CommonResponseModel> {
        const res = await this.settingModel.findOne({}, 'workingHours');
        if (res && res.workingHours && res.workingHours.length) {
            return {response_code: HttpStatus.OK, response_data: res};
        } else {
            return {response_code: 400, response_data: {workingHours: []}};
        }
    }

    //get working Hrs for user
    public async getDeliveryTimeUser(time:string,timestamp:number): Promise<CommonResponseModel> {
        const res = await this.settingModel.findOne({}, 'workingHours');
        if (res && res.workingHours && res.workingHours.length) {
            let newRes = await GeneralService.workingTimeCalculation(res.workingHours,time,timestamp);
            return {response_code: HttpStatus.OK, response_data: newRes};
        } else {
            return {response_code: 400, response_data: {workingHours: []}};
        }
    }

    // **************CURRENCY*************
    
    //add CURRENCY Admin
    public async saveCurrency(user: UsersDTO,id:String, settingCurrencyAndLanguageDTO: SettingCurrencyAndLanguageDTO): Promise<CommonResponseModel> {
        if (user && user.role == 'Admin') {
            await this.settingModel.findByIdAndUpdate(id, settingCurrencyAndLanguageDTO, {new: true});
            return {response_code: HttpStatus.CREATED, response_data: 'Currency And language updated successfully'};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create Currency'};
        }
    }
    //get CURRENCY Admin
    public async getCurrencyAndLanguage(user: UsersDTO): Promise<CommonResponseModel> {
        if (user && user.role == 'Admin') {
            const res = await this.settingModel.findOne({}, 'languageCode currencyCode currencyName');
            return {response_code: HttpStatus.OK, response_data: res};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create Currency'};
        }
    }
    //get CURRENCY List  Admin
    public async getCurrencyAndLanguageList(user: UsersDTO): Promise<CommonResponseModel> {
        if (user && user.role == 'Admin') {
            const res = await this.settingModel.findOne({}, 'currencyList languageList');
            return {response_code: HttpStatus.OK, response_data: res};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create Currency'};
        }
    }
    //get all the currency user
    public async getCurrency(user: UsersDTO): Promise<CommonResponseModel> {
        if(user.role==='Admin'){
        const res = await this.settingModel.findOne({}, 'languageCode currencyCode');
        if (res) {
            return {response_code: HttpStatus.OK, response_data: res};
        } else {
            return {response_code: 400, response_data: {pincode: []}};
        }
        } 
       else{
        return{
            response_code:HttpStatus.BAD_REQUEST,
            response_data:"sorry you are not allowed for this API."
        }
       }
     }
     // loyaltyPoint API
     public async getLoyaltyPoint():Promise<CommonResponseModel>{
         const resData=await this.settingModel.findOne({},'loyaltySetting');
         return{
             response_code:HttpStatus.OK,
             response_data:resData
         }
     }
     //update loyalityPoint and update
    public async updateLoyaltyPointByAdmin(id:string,user:UsersDTO,loyaltyData:loyaltySettingDTO):Promise<CommonResponseModel>{
        if(user.role == 'Admin'){
          await this.settingModel.findByIdAndUpdate(id,loyaltyData,{new: true});
         return{response_code:HttpStatus.OK,
         response_data:"Loyalty Point update successFully"
          }
       }
       else{
      return{
      response_code:HttpStatus.UNAUTHORIZED,
      response_data:"You are not allowed  for this API"
     }
     }   
    }
    //this for user app
    public async getCurrencyforUserApp(): Promise<CommonResponseModel> {
        const res = await this.settingModel.findOne({}, 'languageCode currencyCode currencyName');
        if (res) {
            return {response_code: HttpStatus.OK, response_data: res};
        } else {
            return {response_code: 400, response_data: {pincode: []}};
        }
        } 
      
}
//add CURRENCY
    // public async saveCurrency(user: UsersDTO, settingCurrencyDTO: SettingCurrencyDTO): Promise<CommonResponseModel> {
    //     let currencyName = settingCurrencyDTO.currencyName;
    //     if (user && user.role == 'Admin') {
    //         let setting = await this.settingModel.findOne({});
    //         if (setting) {
    //             if (setting.currency && setting.currency.length) {
    //                 let index = setting.currency.findIndex(x => x.currencyName === currencyName);
    //                 console.log(index);
    //                 if (index == -1) {
    //                     setting.currency.push(settingCurrencyDTO);
    //                     await setting.save();
    //                     return {response_code: HttpStatus.CREATED, response_data: 'Currency saved successfully'};
    //                 } else {
    //                     return {response_code: 400, response_data: 'Currency already exist.'};
    //                 }
    //             } else {
    //                 setting.currency = [settingCurrencyDTO];
    //                 await setting.save();
    //                 return {response_code: HttpStatus.CREATED, response_data: 'Currency saved successfully'};
    //             }
    //         } else {
    //             const setting = await this.settingModel.create({Currency: [settingCurrencyDTO]});
    //             return {response_code: HttpStatus.CREATED, response_data: 'Currency saved successfully'};
    //         }
    //     } else {
    //         return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create Currency'};
    //     }
    // }
