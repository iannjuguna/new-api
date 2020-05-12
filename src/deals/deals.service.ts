import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {DealsDTO, DealsStatusDTO} from './deals.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';
import {DealProductDTO} from '../products/products.model';
//, @InjectModel('Products') private readonly productModel: Model<any>

@Injectable()
export class DealsService {
    constructor(@InjectModel('deals') private readonly dealsModel: Model<any>,@InjectModel('Products') private readonly productsModel: Model<any>,@InjectModel('Categories') private readonly categoryModel: Model<any>) {

    }
    // gets deals by pagination
    public async getDealsByPagination(pageNum: number, limit: number): Promise<CommonResponseModel> {
        const deals = await this.dealsModel.find({}).populate('category','title').populate('product','title').limit(limit).skip((pageNum * limit) - limit);
        const totalDeals = await this.dealsModel.countDocuments();
        return {response_code: HttpStatus.OK, response_data: {deals, totalDeals}};
    }

    // gets deal information
    public async getDealInformation(dealId: string): Promise<CommonResponseModel> {
        const dealData = await this.dealsModel.findById(dealId).populate('category','title').populate('product','title');
        return {response_code: HttpStatus.OK, response_data: dealData};
    }
    // creates a new deal
    public async createNewDeal(user: UsersDTO, dealData: DealsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create deal.'};
        }
        const dealExist = await this.dealsModel.findOne({name: dealData.name});
        if (dealExist) {
            return {
                response_code: HttpStatus.BAD_REQUEST,
                response_data: `Deal with name ${dealData.name} exist. Provide a different name.`,
            };
        } else {
            if(dealData.category==null ||  dealData.category==""){
                delete dealData.category;
            }
            if(dealData.product==null ||  dealData.product==""){
                delete dealData.product;
            }
            const response = await this.dealsModel.create(dealData) as DealsDTO;
            if (response._id) {
                let dealObj={isDealAvailable:true,delaPercent:response.delaPercent,dealId:response._id}
                let query={}
                if(response.delalType=="Category"){
                    query={category:response.category}
                    await this.categoryModel.updateMany({_id:response.category},{ $set: dealObj });
                }else{
                    query={_id:response.product}
                }
                const products=await this.productsModel.updateMany(query,{ $set: dealObj });
                console.log("products",products)
                return {response_code: HttpStatus.CREATED, response_data: 'Deal saved successfully.'};
            }
        }
    }

    // updates the deal
    public async updateDeal(user: UsersDTO, dealId: string, dealData: DealsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to update deal.'};
        }
        const response = await this.dealsModel.findByIdAndUpdate(dealId, dealData);
        let dealObj={isDealAvailable:true,delaPercent:response.delaPercent,dealId:response._id}
        let query={}
        if(response.delalType=="Category"){
            query={category:response.category}
            await this.categoryModel.updateMany({_id:response.category},{ $set: dealObj });
        }else{
            query={_id:response.product}
        }
        const products=await this.productsModel.updateMany(query,{ $set: dealObj });
        console.log("products",products)
        return {response_code: HttpStatus.OK, response_data: 'Deal updated successfully.'};
    }

    // deletes deal
    public async deletesDeal(user: UsersDTO, dealId: string): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to delete this deal.'};
        }
        const response = await this.dealsModel.findById(dealId);
        const deletedResponse = await this.dealsModel.findByIdAndDelete(dealId);
        let dealObj={isDealAvailable:false,delaPercent:response.delaPercent,dealId:response._id}
        let query={}
        if(response.delalType=="Category"){
            query={category:response.category}
            await this.categoryModel.updateMany({_id:response.category},{ $set: dealObj });
        }else{
            query={_id:response.product}
        }
        const products=await this.productsModel.updateMany(query,{ $set: dealObj });
        console.log("products",products)
        return {response_code: HttpStatus.OK, response_data: 'Deal deleted successfully'};
    }

    // update deals status
    public async dealsUpdateStatus(id: string, dealsStatusData: DealsStatusDTO): Promise<CommonResponseModel> {
        const response = await this.dealsModel.findByIdAndUpdate(id, dealsStatusData);
        let isDealAvailable=response.status==1?true:false;
        let dealObj={isDealAvailable:isDealAvailable,delaPercent:response.delaPercent,dealId:response._id}
        let query={}
        if(response.delalType=="Category"){
            query={category:response.category}
            await this.categoryModel.updateMany({_id:response.category},{ $set: dealObj });
        }else{
            query={_id:response.product}
        }
        await this.productsModel.updateMany(query,{ $set: dealObj });
        return {
            response_code: HttpStatus.OK,
            response_data: 'deals Stataus updated successfully'
        };
    }

}
