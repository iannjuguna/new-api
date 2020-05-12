import * as mongoose from 'mongoose';
import {IsCreditCard, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const CardSchema = new mongoose.Schema({
    cardHolderName: {
        type: String
    },
    cardNumber: {
        type: String
    },
    expiryMonth: {
        type: Number
    },
    expiryYear: {
        type: Number
    },
    cvv: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    lastFourDigits: {
        type: String
    },
    bank: {
        type: String
    },
}, {timestamps: true});

export class CardInformationDTO {
    @IsNotEmpty()
    @ApiModelProperty()
    cardHolderName: string;

    @IsNotEmpty()
    @IsCreditCard()
    @ApiModelProperty()
    cardNumber: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(12)
    @ApiModelProperty()
    expiryMonth: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(new Date().getFullYear())
    @ApiModelProperty()
    expiryYear: number;

    @IsNotEmpty()
    @ApiModelProperty()
    cvv: string;

    @IsOptional()
    user: string;

    @IsEmpty()
    lastFourDigits: string;

    @IsNotEmpty()
    @ApiModelProperty()
    bank: string;
}
