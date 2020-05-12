import * as mongoose from 'mongoose';
import {
    IsNotEmpty,
    IsEmail,
    IsEmpty,
    IsUrl,
    IsNumber,
    Length,
    IsOptional,
    IsPositive,
    Min,
    Equals,
    IsArray,
    ValidateNested,
    IsString, Max,
  } from 'class-validator';
  import { ApiModelProperty } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
import { isString } from 'util';

  export const SettingSchema = new mongoose.Schema({
    pincode: [
      {
        type: String
    }],
    workingHours:[{
      day: String,
	    dayCode: Number,
	    isClosed: Boolean,
	    timeSchedule:[
        {
          slot:String,
			    openTimeConverted:Number,
			    closeTimeConverted:Number,
		      deliveryCount:Number,
			    isClosed: Boolean
        }
      ]
    }],
    languageCode:{
      type:String,
      default:"en"
    },
    currencyCode:{
      type:String,
      default:"$"
    },
    currencyName:{
      type:String,
      default:"USD"
    },
    currency: [
      {
        type: Object
    }],
    currencyList: [
      {
        type: Object
    }],
    languageList: [
      {
        type: Object
    }],
    loyaltySetting:{
      minOrderAmountLoyaltyApplied:Number,
      loyaltyApplied: Boolean,
      loyaltyPercentOnOrder:Number,
      uptoLoyaltyPercentReedem:Number
    }
})

export class SettingDTO{
  @ApiModelProperty()
  pincode:[]
}
export class SettingPinCodeDTO{
  @ApiModelProperty()
  pincode:string
}
export class timeScheduleDTO {
  @IsOptional()
  _id:string;
  
  @IsNotEmpty()
  @ApiModelProperty()
  slot: string;

  @IsNotEmpty()
  @ApiModelProperty()
  openTimeConverted: number;

  @IsNotEmpty()
  @ApiModelProperty()
  closeTimeConverted: number;

  @IsNotEmpty()
  @ApiModelProperty()
  deliveryCount: number;

  @IsNotEmpty()
  @ApiModelProperty()
  isClosed: boolean;
}
export class workingHoursDTO {
  @IsOptional()
  _id:string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  day: string;

  @IsNotEmpty()
  @ApiModelProperty()
  dayCode: number;

  @IsNotEmpty()
  @ApiModelProperty()
  isClosed: boolean;

  @IsOptional()
  @IsArray()
  timeSchedule: timeScheduleDTO;
}
export class SettingWorkingHoursDTO{
  @IsOptional()
  _id:string;
  @ApiModelProperty()
  workingHours:workingHoursDTO
}

export class SettingCurrencyDTO{
  @ApiModelProperty()
  currencyName:string;
  @ApiModelProperty()
  currencySign:string
}
export class SettingCurrencyAndLanguageDTO{
  @ApiModelProperty()
  currencyName:string
  @ApiModelProperty()
  languageCode:string;
  @ApiModelProperty()
  currencyCode:string
}
export class loyaltySettingDTO{
     @ApiModelProperty()
      minOrderAmountLoyaltyApplied:number;
      @ApiModelProperty()
      loyaltyApplied: boolean;
      @ApiModelProperty()
      loyaltyPercentOnOrder:number;
      @ApiModelProperty()
      uptoLoyaltyPercentReedem:number

}