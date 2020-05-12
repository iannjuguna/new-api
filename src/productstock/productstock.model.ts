import *as mongoose from 'mongoose';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer/decorators';

 export const ProductStockSchema=new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
    },
    title:{
     type:String
    }
})

export class ProdStockDTO{

    @ApiModelProperty()
    product:string;
    
    @ApiModelProperty()
    title:String;
}