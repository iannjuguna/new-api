import {Injectable, HttpStatus} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CategoryDTO, CategoryStatusDTO} from './categories.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';
import {ProductsDTO} from '../products/products.model';


@Injectable()
export class CategoryService {
    constructor(@InjectModel('Categories') private readonly categoryModel: Model<any>, @InjectModel('Subcategory') private readonly subcategoryModel: Model<any>,@InjectModel('Products') private readonly productModel: Model<any>, @InjectModel('deals') private readonly dealsModel: Model<any>) {
    }

    // get all categories by pagination
    public async getAllCategories(): Promise<CommonResponseModel> {
        const categories = await this.categoryModel.find({});
        return {response_code: HttpStatus.OK, response_data: categories};
    }

    // get'sonl category name and id
    public async getSpecificCategoryFields(user: UsersDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create category'};
        }
        const categories = await this.categoryModel.find({}, 'title');
        return {response_code: HttpStatus.OK, response_data: categories};
    }

    // returns all categories by pagination
    public async getAllCategoriesByPagination(page: number, limit: number): Promise<CommonResponseModel> {
        const categories = await this.categoryModel.find({}).sort('title').limit(limit).skip((page * limit) - limit);
        const totalRecords = await this.categoryModel.countDocuments({});
        const paginationCount = Math.round(totalRecords / limit);
        return {response_code: HttpStatus.OK, response_data: {categories, totalRecords, paginationCount}};
    }

    // returns a particular category information
    public async getCategoryInfo(categoryId: string): Promise<CommonResponseModel> {

        const categoryInfo = await this.categoryModel.findById(categoryId);
        if (categoryInfo) {
            return {response_code: HttpStatus.OK, response_data: categoryInfo};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Category does not exist'};
        }
    }

    // sends request to search algolia
    public async searchCategories(query: string): Promise<CommonResponseModel> {
        const list = await this.categoryModel.find({'$text': {'$search': query}});
        return {response_code: HttpStatus.OK, response_data: list};
    }

    // creates a new category
    public async saveCategory(user: UsersDTO, categoryData: CategoryDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create category'};
        }
        const categoryExist = await this.categoryModel.findOne({title: categoryData.title});
        if (categoryExist) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: `Category with name ${categoryData.title} exist`};
        }
        categoryData.user = user._id;
        categoryData['objectID'] = String(Date.now());
        const response = await this.categoryModel.create(categoryData) as CategoryDTO;
        if (response._id) {
            return {response_code: HttpStatus.CREATED, response_data: 'Category saved successfully'};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save category'};
        }
    }

    // updates the category
    public async updateCategory(user: UsersDTO, categoryId: string, categoryData: CategoryDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to update category'};
        }
        await this.categoryModel.findByIdAndUpdate(categoryId, categoryData);
        return {response_code: HttpStatus.OK, response_data: 'Category updated successfully'};
    }

    // checks whether the category is linked to a product or not
    public async checkCategoryLinkedToProduct(categoryId: string): Promise<CommonResponseModel> {
        const products = await this.productModel.find({category: categoryId}) as Array<ProductsDTO>;
        if (products.length > 0) {
            return {response_code: HttpStatus.FOUND, response_data: `Category is linked to a ${products.length} products.`};
        } else {
            return {response_code: HttpStatus.OK, response_data: 'No linking found. Safe to delete category'};
        }
    }

    // deletes the category
    public async deleteCategory(user: UsersDTO, categoryId: string): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'You are not authorized to delete this category.',
            };
        }
        // const categoryData = await this.categoryModel.findById(categoryId);
        // const response = await this.categoryModel.findByIdAndDelete(categoryId);
        // const products = await this.productModel.find({category: categoryId}, '-title -description -price -user -category -imageUrl -imageId -status -createdOn -updatedOn -__v');
        // let productIds = [];
        // products.forEach(list => {
        //     productIds.push(list._id);
        // });
        //const unlinkRes = await this.productModel.updateMany({category: categoryId}, {category: null});
        // const unlinkDeals = await this.dealsModel.updateMany({category: categoryId}, {
        //     $pullAll: {products: productIds},
        //     category: null,
        // });
        return {response_code: HttpStatus.OK, response_data: 'Category deleted successfully'};
    }

    //enable and disable API for Category
    public async eNableAndDisableCategory(id: string): Promise<CommonResponseModel> {
        const categoryInfo = await this.categoryModel.findById(id);
        console.log('categoryInfo', categoryInfo.status);
        if (categoryInfo.status == 1) {
            return {
                response_code: HttpStatus.OK,
                response_data: categoryInfo
            };
        } else {
            return {
                response_code: HttpStatus.OK,
                response_data: 'Sorry!!! This category Not Enable.'
            };
        }
    }

    //category status update
    public async categoryStausupdate(id: string, categorystatusData: CategoryStatusDTO): Promise<CommonResponseModel> {
        await this.categoryModel.findByIdAndUpdate(id, categorystatusData);
        await this.subcategoryModel.updateMany({category: id}, categorystatusData);
        await this.productModel.updateMany({category: id}, categorystatusData);
        return {
            response_code: HttpStatus.OK,
            response_data: 'category status update succesfully'
        };
    }
    //get only enable caterory List for mobile data
    public async getAllEnableCategoryList():Promise<CommonResponseModel>{
        const resData=await this.categoryModel.find({status:1});
            return{
            response_code:HttpStatus.OK,
            response_data:resData
            }
    }
    
}
