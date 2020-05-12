import * as mongoose from 'mongoose';
import {IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsUrl} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const BannerSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    bannerType: {
        type: String
    },
    imageURL: {
        type: String
    },
    imageId: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    status: {
        type: Number,
        default: 1
    }
}, {timestamps: true});

export enum BannerType {
    Category = 'Category',
    Product = 'Product'
}

export class BannerDTO {
    @IsOptional()
    @IsMongoId()
    _id: string;

    @IsNotEmpty()
    @ApiModelProperty()
    title: string;

    @IsNotEmpty()
    @ApiModelProperty()
    description: string;

    @IsNotEmpty()
    @IsEnum(BannerType)
    @ApiModelProperty()
    bannerType: string;

    @IsNotEmpty()
    @IsUrl()
    @ApiModelProperty()
    imageURL: string;

    @IsNotEmpty()
    @ApiModelProperty()
    imageId: string;

    @IsOptional()
    @IsMongoId()
    @ApiModelProperty()
    category: string;

    @IsOptional()
    @IsMongoId()
    @ApiModelProperty()
    product:string;

    @IsOptional()
    @ApiModelProperty()
    status:number;
}
