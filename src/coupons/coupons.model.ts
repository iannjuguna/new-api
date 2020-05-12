import * as mongoose from 'mongoose';
import {IsArray, IsDate, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUrl, Max, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const CouponsSchema = new mongoose.Schema({
    couponCode: {
        type: String,
    },
    description: {
        type: String,
    },
    offerValue: {
        type: Number,
    },
    startDate: {
        type: Number,
    },
    expiryDate: {
        type: Number,
    },
    couponType: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
}, {timestamps: true});

enum CouponType {
    Percentage = 'PERCENTAGE',
    Amount = 'FLAT'
}


export class CouponsDTO {
    @IsOptional()
    _id: string;

    @IsNotEmpty()
    @ApiModelProperty()
    description: string;

    @IsNotEmpty()
    @ApiModelProperty()
    couponCode: string;

    @IsNotEmpty()
    @ApiModelProperty()
    offerValue: number;

    @IsNumber()
    @ApiModelProperty()
    startDate: number;

    @IsNumber()
    @IsOptional()
    @ApiModelProperty()
    expiryDate: number;

    @IsNotEmpty()
    @IsEnum(CouponType, {message: 'Enter a valid coupon discount type'})
    @ApiModelProperty()
    couponType: string;



    @IsOptional()
    @ApiModelProperty()
    status: number;
}

export class CouponStatusDTO {
    @IsNotEmpty()
    @IsNumber()
   // @IsPositive()
    @Min(0)
    @Max(1)
    @ApiModelProperty()
    status: number;

}
export class CouponCodeDTO {
    @IsNotEmpty()
    @ApiModelProperty()
    couponCode: string;
}
