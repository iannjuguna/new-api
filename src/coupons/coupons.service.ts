import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';
import {CouponsDTO, CouponStatusDTO} from './coupons.model';
import {ProductsDTO, VariantDTO} from '../products/products.model';

@Injectable()
export class CouponsService {
    constructor(@InjectModel('Coupons') private readonly couponsModel: Model<any>, @InjectModel('Products') private readonly productModel: Model<any>) {

    }
    // gets coupons by pagination admin
    public async couponsListByPagination(page: number, limit: number): Promise<CommonResponseModel> {
        let l = Number(limit);
        let p = (Number(page) - 1) * l;
        console.log(l);
        console.log(p);
        //
        const coupons = await this.couponsModel.find({}).limit(l).skip(p);
        const totalCoupons = await this.couponsModel.count({});
        return {response_code: HttpStatus.OK, response_data: {coupons, totalCoupons}};
    }

    // get's coupon information admin
    public async couponInfo(couponId: string): Promise<CommonResponseModel> {
        const couponInfo = await this.couponsModel.findById(couponId);
        if (couponId) {
            return {response_code: HttpStatus.OK, response_data: couponInfo};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Invalid coupon'};
        }
    }

    // creates a new coupon admin
    public async saveCoupon(user: UsersDTO, coupon: CouponsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        } else {
            const checkIfExist = await this.couponsModel.findOne({ couponCode: coupon.couponCode });
            if (checkIfExist) {
              return { response_code: HttpStatus.BAD_REQUEST, response_data: `Coupon code ${coupon.couponCode} exist.` };
            } else {
              const response = await this.couponsModel.create(coupon);
              if (response._id) {
                return { response_code: HttpStatus.CREATED, response_data: 'Coupon saved successfully' };
              } else {
                return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save coupon' };
              }
            }
        }
    }
    // updates coupon admin
    public async updateCoupon(user: UsersDTO, couponId: string, coupon: CouponsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        } else {
            const response = await this.couponsModel.findByIdAndUpdate(couponId, coupon);
            return {
                response_code: HttpStatus.OK,
                response_data: 'Coupon updated successfully'
            };
        }
    }
    // deletes coupon admin
    public async deleteCoupon(user: UsersDTO, couponId: string): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        } else {
            const response = await this.couponsModel.findByIdAndDelete(couponId);
            return {response_code: HttpStatus.OK, response_data: 'Coupon deleted successfully'};
        }
    }

    //update  in coupon admin
    public async couponStatusUpdate(id: string, couponStatusData: CouponStatusDTO): Promise<CommonResponseModel> {
        const res = await this.couponsModel.findByIdAndUpdate(id, couponStatusData);
        return {
            response_code: HttpStatus.OK,
            response_data: 'Coupon status updated successfully'
        };
    }




    // search coupon
    // public async searchCoupon(query: string): Promise<CommonResponseModel> {
    //     const coupons = await this.couponsModel.find({'$text': {'$search': query}});
    //     return {response_code: HttpStatus.OK, response_data: coupons};
    // }
    // private async checkAndUpdateExistingOrNewProducts(coupon, remove: boolean): Promise<CommonResponseModel> {
    //     if (coupon.category) {
    //         try {
    //             let products = await this.productModel.find({category: coupon.category});
    //             if (products.length > 0) {
    //                 let ids = [];
    //                 products.forEach((product: ProductsDTO) => {
    //                     ids.push(product._id);
    //                 });
    //                 let obj = {
    //                     isCategoryBasedOffer: !remove ? true : undefined,
    //                     isProductBasedOffer: !remove ? false : undefined,
    //                     offerInfo: !remove ? coupon._id : undefined
    //                 };
    //                 const productUpdateRes = await this.productModel.update({_id: {$in: ids}}, {$set: obj}, {multi: true});
    //                 return {response_code: HttpStatus.OK, response_data: 'Offeer saved in products'};
    //                 // return {response_code: HttpStatus.CREATED, response_data: 'Coupon saved successfully'};
    //             } else {
    //                 const res = await this.couponsModel.findByIdAndDelete(coupon._id);
    //                 return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No products found for the selected category'};
    //             }
    //         } catch (e) {
    //             return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Something went wrong, Please try again'};
    //         }
    //     } else {
    //         let obj = {
    //             isCategoryBasedOffer: !remove ? false : undefined,
    //             isProductBasedOffer: !remove ? true : undefined,
    //             offerInfo: !remove ? coupon._id : undefined
    //         };
    //         try {
    //             const productUpdateRes = await this.productModel.update({_id: {$in: coupon.products}}, {$set: obj}, {multi: true});
    //             return {response_code: HttpStatus.OK, response_data: 'Offeer saved in products'};
    //         } catch (e) {
    //             return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Something went wrong, Please try again'};
    //         }
    //         // return {response_code: HttpStatus.CREATED, response_data: 'Coupon saved successfully'};
    //     }
    // }
}
