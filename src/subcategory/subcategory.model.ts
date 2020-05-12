import *as mongoose from 'mongoose';
import {IsMongoId, IsNotEmpty, IsNumber, IsOptional, Max, Min} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export const SubCategoryScema=new mongoose.Schema({
    title:{
        type:String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
    },
    discription:{
        type:String
    },
    status:{
        type:Number,
        default:1,
    }
},{ timestamps: true });


export class SubCategoryDTO{
    @IsOptional()
    _id:string
    @IsNotEmpty()
    @ApiModelProperty()
    title:string;

    @IsNotEmpty()
    @ApiModelProperty()
    category:string;

    @IsNotEmpty()
    @ApiModelProperty()
    discription:string
    @ApiModelProperty()
    status:number
}

export class EnambleDisableStatusDTO{
    @IsNotEmpty()
    @ApiModelProperty()
    status:number
}