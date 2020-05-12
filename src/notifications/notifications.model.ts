import * as mongoose from 'mongoose';
import {ApiModelProperty} from '@nestjs/swagger';
import {IsArray, IsEmpty, IsNotEmpty, IsNumber, IsOptional, Max, Min, IsUrl} from 'class-validator';
export const NotificationsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  // true =not read,false=read
  status: {
    type: Boolean,
    default:true
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  ORDERID: {
    type: Number,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',
  },
}, { timestamps: true });

// this one when user ordered
export interface NotificationsModel {
  title: string;
  description: string;
  user: string;
  order: string;
  ORDERID:number
}

export class NotificationsDTO{
  @IsOptional()
  _id:string
  
   @IsOptional()
  @ApiModelProperty()
  title: string;
  
  @IsOptional()
  @ApiModelProperty()
  description: string;

  @IsOptional()
  @ApiModelProperty()
  user: string;

  @IsOptional()
  @ApiModelProperty()
  order: string;

  @IsOptional()
  @ApiModelProperty()
  ORDERID: number;


}