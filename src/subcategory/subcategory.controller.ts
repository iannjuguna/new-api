import { Controller, Body, Post, Get, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubCategoryDTO, EnambleDisableStatusDTO } from './subcategory.model';
import { CommonResponseModel } from 'src/utils/app-service-data';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { identity } from 'rxjs';

@Controller('subcategory')
export class SubcategoryController {
    constructor(private subcategoryService: SubcategoryService) {


    }
    //create sub cateory data
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/add/subcategory')
    public saveSubcategory(@Body() subcategoryData:SubCategoryDTO):Promise<CommonResponseModel>{
        return this.subcategoryService.addSubCategory(subcategoryData)
    }
   //get all list of subcategory
   @Get('/all/list')
   public getAllListOfsubcategory():Promise<CommonResponseModel>{
       return this.subcategoryService.getlistOfSubcategory();
   }
   //update by id
   @Put('update/:id')
   public updateById(@Param('id')id:string,@Body() subcategoryData:SubCategoryDTO):Promise<CommonResponseModel>{
       return this.subcategoryService.updateSubcategoryById(id,subcategoryData)
   }
   //view by id
   @Get('view/:id')
   public viewById(@Param('id')id:string):Promise<CommonResponseModel>{
       return this.subcategoryService.vewById(id);
   }
   //delete by id
   @Delete('/:id')
   public deletedById(@Param('id')id:string):Promise<CommonResponseModel>{
       return this.subcategoryService.deletedById(id)
   }
   //enable 
   @Put('/enble/disable/:id')
   public enableDisable(@Param('id')id:string,@Body() enableDisabledata:EnambleDisableStatusDTO):Promise<CommonResponseModel>{
       return this.subcategoryService.subcategoryEnableDisable(id,enableDisabledata)
   }
}
