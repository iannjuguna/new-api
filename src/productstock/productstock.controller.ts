import { Controller, Put,Post, Param, Body } from '@nestjs/common';
import { ProductstockService } from './productstock.service';
import { CommonResponseModel } from '../utils/app-service-data';
import { ProdStockDTO } from './productstock.model';
import { ProductsDTO } from '../products/products.model';
@Controller('productstock')
export class ProductstockController {
    constructor(private readonly productStockService:ProductstockService){}
     
    //update API for Product stock
    @Put('/:id')
    public productStockUpdate(@Param('id') id:string,@Body() prodstockData:ProdStockDTO,@Body() productData:ProductsDTO):Promise<CommonResponseModel>{    
        return this.productStockService.stockUpdate(id,prodstockData,productData);
    }
   // save product stock 
    @Post('/save/productstock')
    public async createProductStock(@Body() prodstockData:ProdStockDTO):Promise<CommonResponseModel>{
       return this.productStockService.saveStaockProduct(prodstockData);
   }
}
