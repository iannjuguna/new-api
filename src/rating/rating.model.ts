import * as mongoose from 'mongoose';
import {IsMongoId, IsNotEmpty, IsNumber, IsOptional, Max, Min} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export const RatingSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  rate: {
    type: Number,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',
  },
}, { timestamps: true });

export interface RatingModel {
  description: string;
  rate: number;
  product: string;
  user: string;
  order: string;
}

export class RatingDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  @ApiModelProperty()
  rate: number;

  @IsOptional()
  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiModelProperty()
  productId: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiModelProperty()
  order: string;

}
