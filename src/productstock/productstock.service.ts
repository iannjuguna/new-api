import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonResponseModel } from '../utils/app-service-data';
import { ProdStockDTO } from './productstock.model';
import{ProductsDTO, VariantData} from '../products/products.model';
@Injectable()
export class ProductstockService {
    constructor(@InjectModel('Productstock') private readonly productStockModel:Model<any>,@InjectModel('Products')private readonly  productModel:Model<any> ){}

    //update API
    public async stockUpdate(id:string,prodstockData:ProdStockDTO,productData:ProductsDTO):Promise<CommonResponseModel>{
        // const reslt=await this.productModel.find({where:{variant:variant.p.}});
        // let a:any[];
        // for(let i=0;i<reslt.length;i++){
        //      var b=a.push();
        // }
        // console.log(b);
        const res=await this.productStockModel.findByIdAndUpdate(id,prodstockData,)  
        return {
         response_code:HttpStatus.OK,
         response_data:"Product Stock Updated Successfully"
        }
    }  
    //post API
    public async saveStaockProduct(prodstockData:ProdStockDTO):Promise<CommonResponseModel>{
        const res=await this.productStockModel.create(prodstockData);
        return{
        response_code:HttpStatus.OK,
        response_data:"Product stock successfully created"
        }
    }
}
