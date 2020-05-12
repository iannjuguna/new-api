
import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { CommonResponseModel } from '../utils/app-service-data';
import { SubCategoryDTO, EnambleDisableStatusDTO } from './subcategory.model';
@Injectable()
export class SubcategoryService {
    constructor(@InjectModel('Subcategory') private readonly subcategoryModel: Model<any>,@InjectModel('Products') private readonly productModel: Model<any>,@InjectModel('Categories') private readonly categoryModel: Model<any>){}

  // create subcategoryModel
    public async addSubCategory(subcategoryData:SubCategoryDTO):Promise<CommonResponseModel>{
     const res=await this.subcategoryModel.create(subcategoryData);
     await this.categoryModel.findByIdAndUpdate(subcategoryData.category,{isSubCategoryAvailable:true},{new:true});
     return{
         response_code:HttpStatus.OK,
         response_data:"SubCategory Created successfully"
     }   
    }
    //get all subcategory id.
    public async getlistOfSubcategory():Promise<CommonResponseModel>{
        const res=await this.subcategoryModel.find({}).populate('category');
        return{
            response_code:HttpStatus.OK,
            response_data:res
        }
    }
    //edit by id 
    public async updateSubcategoryById(id:string,subcategoryData:SubCategoryDTO):Promise<CommonResponseModel>{
        console.log("data",subcategoryData)
        const res=await this.subcategoryModel.findByIdAndUpdate(id,subcategoryData);
        await this.categoryModel.findByIdAndUpdate(subcategoryData.category,{isSubCategoryAvailable:true},{new:true});
        return{
            response_code:HttpStatus.OK,
            response_data:"updated Successfully"
        }
    }
    //view by id 
    public async vewById(id:string):Promise<CommonResponseModel>{
        const res=await this.subcategoryModel.findById(id);
        return{
            response_code:HttpStatus.OK,
            response_data:res
        }
    }
  //delete  by id
  public async deletedById(id:string):Promise<CommonResponseModel>{
      const res=await this.subcategoryModel.findByIdAndDelete(id);
      return{
          response_code:HttpStatus.OK,
          response_data:"deleted successfully"
      }
  }
 // enalbele disable 
 public async subcategoryEnableDisable( id:string,enableDisabledata:EnambleDisableStatusDTO):Promise<CommonResponseModel>{
     await this.subcategoryModel.findByIdAndUpdate(id,enableDisabledata);
     await this.productModel.updateMany({category: id}, enableDisabledata);
     return{
        response_code:HttpStatus.OK,
        response_data:"updated Successfully"
     }
 }
 
}
