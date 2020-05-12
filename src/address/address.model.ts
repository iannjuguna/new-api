import * as mongoose from 'mongoose';
import {
    Equals,
    IsArray,
    IsEmpty, IsEnum,
    IsNotEmpty,
    IsNumber,
    Length,
    IsOptional,
    IsString,
    Matches,
    ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const AddressSchema = new mongoose.Schema({
    address: {
        type: String
    },
    flatNo: {
        type: String
    },
    apartmentName: {
        type: String
    },
    landmark: {
        type: String
    },
    postalCode: {
        type: String
    },
    contactNumber: {
        type: String
    },
    addressType: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    location: {
        lat: {
            type: Number,
        },
        long: {
            type: Number,
        },
    },
}, { timestamps: true });

export class COOrdinatesDTO {
    @IsNotEmpty()
    @Equals('Point')
    type: String;

    @IsNotEmpty()
    @IsArray()
    coordinates: Array<number>;
}

export enum AddressType {
    Home = 'Home',
    Work = 'Work',
    Others = 'Others'
}

export class AddressDTO {
    @IsEmpty()
    _id: string;

    @IsNotEmpty()
    @ApiModelProperty()
    address: string;

    @IsNotEmpty()
    @ApiModelProperty()
    flatNo: string;

    @IsNotEmpty()
    @ApiModelProperty()
    apartmentName: string;

    @IsNotEmpty()
    @ApiModelProperty()
    landmark: string;

    @IsNotEmpty()
    // @Matches(new RegExp('^[0-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$'), { message: 'Invalid postal code. Postal code should start from 560' })
    @ApiModelProperty()
    postalCode: string;

    @IsNotEmpty()
    location: {
        lat: number;
        long: number;
    };

    @IsNotEmpty()
    @Length(9, 9)
    @ApiModelProperty()
    contactNumber: string;

    @IsNotEmpty()
    @IsEnum(AddressType, { message: 'Enter a valid address type' })
    @ApiModelProperty()
    addressType: string;

    @IsOptional()
    user: string;

    @IsOptional()
    createdAt: string;

    @IsOptional()
    updatedAt: string;
}

export class LocationDTO {
    @IsNotEmpty()
    @IsArray()
    @ApiModelProperty()
    shopCoOrdinates: Array<number>;

    @IsNotEmpty()
    @IsArray()
    @ApiModelProperty()
    userCoOrdinates: Array<number>;

    @IsNotEmpty()
    @ApiModelProperty()
    unit: string;
}
