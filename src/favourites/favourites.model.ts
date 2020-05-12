import * as mongoose from 'mongoose';
import {IsEmpty, IsMongoId, IsNotEmpty} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const FavouritesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {timestamps: true});

export class FavouritesDTO {
    @IsNotEmpty()
    @IsMongoId({message: 'Enter a valid product ID'})
    @ApiModelProperty()
    product: string;

    @IsEmpty()
    user: string;
}
