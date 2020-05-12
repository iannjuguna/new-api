import * as mongoose from 'mongoose';
import {IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const DeliveryTaxSchema = new mongoose.Schema({
    deliveryType: {
        type: String
    },
    taxType: {
        type: String
    },
    fixedDeliveryCharges: {
        type: Number
    },
    deliveryChargePerKm: {
        type: Number
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    taxAmount: {
        type: Number
    }
});

export enum DeliveryTypeEnum {
    fixed = 'fixed',
    flexible = 'flexible'
}

export enum TaxTypeEnum {
    included = 'included',
    excluded = 'excluded'
}

export class LocationDTO {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}

export class UserLocationDTO {
    @IsNotEmpty()
    @IsNumber()
    @ApiModelProperty()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiModelProperty()
    longitude: number;

    @IsNotEmpty()
    @IsMongoId()
    cartId?: string;
    deliveryAddress?: string;
}

export class DeliveryTaxDTO {
    @IsOptional()
    @IsMongoId()
    _id?: string;

    @IsNotEmpty()
    @IsEnum(DeliveryTypeEnum, {message: 'Enter a valid delivery type'})
    deliveryType: string;

    @IsNotEmpty()
    @IsEnum(TaxTypeEnum, {message: 'Enter a valid tax type'})
    taxType: string;

    @IsOptional()
    @IsNumber()
    fixedDeliveryCharges: number;

    @IsOptional()
    @IsNumber()
    deliveryChargePerKm: number;

    @IsNotEmpty()
    @IsMongoId()
    store: string;

    @IsNotEmpty()
    location: LocationDTO;

    @IsNotEmpty()
    @IsNumber()
    taxAmount: number;
}
