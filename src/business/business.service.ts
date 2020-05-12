import {Injectable, HttpStatus} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UsersDTO} from '../users/users.model';
import {BusinessDTO} from './business.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Injectable()
export class BusinessService {
    constructor(@InjectModel('Business') private readonly businessModel: Model<any>) {
    }

    // save business data
    public async saveBusinessdata(user: UsersDTO, businesData: BusinessDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
        }

        const res = await this.businessModel.create(businesData);
        return {response_code: HttpStatus.CREATED, response_data: 'sucessfully create'};
    }

    // get bussiness data
    public async getBusinessinfomation(user: UsersDTO,): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
        }
        const resData = await this.businessModel.findOne({});
        return {response_code: HttpStatus.OK, response_data: resData};
    }

    //update business model data
//   public async updateBusinessData(user: UsersDTO, imageId, businesData: BusinessDTO): Promise<CommonResponseModel> {
//     if (user.role !== 'Admin') {
//         return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
//     }
//         const resData = await this.businessModel.findByIdAndUpdate(imageId, businesData);
//         return {response_code: HttpStatus.OK, response_data: 'Updated successfully'};
    //}
//    //detele Business
//    public async deletebusinessData(user: UsersDTO, imageId: string): Promise<CommonResponseModel> {
//     if (user.role !== 'Admin') {
//         return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
//     }
//     try {
//         const bannerSaveRes = await this.businessModel.findByIdAndDelete(imageId);
//         return {response_code: HttpStatus.OK, response_data: 'deleted successfully'};
//     } catch (e) {
//         return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Something went wrong, Please try again'};
//     }
// }
    //get by id
    public async getByidBusiness(businessId: string): Promise<CommonResponseModel> {
        const res = await this.businessModel.findById(businessId);
        return {
            response_code: HttpStatus.OK,
            response_data: res
        };
    }

    //edit businessInfo
    public async editBusinessInfo(businessId: string, businesData: BusinessDTO): Promise<CommonResponseModel> {
        const res = await this.businessModel.findByIdAndUpdate(businessId, businesData);
        return {
            response_code: HttpStatus.OK,
            response_data: 'updated successfully'
        };
    }

    // detele by business Id
    public async deleteBusinessAccount(businessId: string): Promise<CommonResponseModel> {
        const res = await this.businessModel.findByIdAndDelete(businessId);
        return {
            response_code: HttpStatus.OK,
            response_data: 'deleted successfully'
        };
    }
    //this for user
    
    // get bussiness data for user
    public async getBussinessInfomation():Promise<CommonResponseModel>{
        const res=await this.businessModel.find({});{
            return{
                response_code:HttpStatus.OK,
                response_data:res
            }
        }
    }
        
}
