import * as mongoose from 'mongoose';
import {IsEmpty, IsNotEmpty, IsOptional, Matches, IsNumber, IsPositive, Max, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {COOrdinatesDTO} from '../address/address.model';

export const LocationsSchema = new mongoose.Schema({
    locationName: {
        type: String
    },
    buildingNo: {
        type: String
    },
    buildingName: {
        type: String
    },
    street: {
        type: String
    },
    locality: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    postalCode: {
        type: String
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {timestamps: true});

export class LocationsDTO {
    @IsNotEmpty()
    @ApiModelProperty()
    locationName: string;

    @IsNotEmpty()
    @ApiModelProperty()
    buildingNo: string;

    @IsNotEmpty()
    @ApiModelProperty()
    buildingName: string;

    @IsNotEmpty()
    @ApiModelProperty()
    street: string;

    @IsNotEmpty()
    @ApiModelProperty()
    locality: string;

    @IsNotEmpty()
    @ApiModelProperty()
    city: string;

    @IsNotEmpty()
    @ApiModelProperty()
    state: string;

    @IsOptional()
    location: COOrdinatesDTO;

    @IsNotEmpty()
    @ApiModelProperty()
    country: string;

    @IsNotEmpty()
    // @Matches(new RegExp('^[0-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$'), {message: 'Invalid postal code. Postal code should start from 560'})
    @ApiModelProperty()
    postalCode: string;

    @IsOptional()
    status: number;
}
export class LocationStausDTO{
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Max(1)
    @Min(0)
    @ApiModelProperty()
    status :number
}
export enum OnlyEbleToDeliverPinCode{
    postalCodeForDelivery= 560068 || 560029 || 560023,
    

}
var OnlyEnableAraPinCode=560068 || 560029 || 560023