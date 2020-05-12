import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UsersDTO} from '../users/users.model';
import {RatingDTO, RatingModel} from './rating.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {ProductsDTO} from '../products/products.model';
import {OrdersDTO} from '../order/order.model';
import {CartDataModel} from '../cart/cart.model';

@Injectable()
export class RatingService {
    constructor(@InjectModel('Rating') private readonly ratingModel: Model<any>, @InjectModel('Products') private readonly productModel: Model<any>, @InjectModel('Orders') private readonly orderModel: Model<any>, @InjectModel('Cart') private readonly cartModel: Model<any>) {

    }

    // save rating
    public async saveRating(user: UsersDTO, ratingData: RatingDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry!! You are not allowed to access this API',
            };
        }
        const productInfo = await this.productModel.findById(ratingData.productId) as ProductsDTO;
        const orderInfo = await this.orderModel.findById(ratingData.order) as OrdersDTO;
        const cartData: CartDataModel = await this.cartModel.findById(orderInfo.cart);
        console.log("ratinggggggggggggggggggggg",cartData);
        if (productInfo) {
            if (!productInfo.totalRating) {
                productInfo.totalRating = 0;
            }
            if (!productInfo.averageRating) {
                productInfo.averageRating = 0;
            }
            if (!productInfo.noOfUsersRated) {
                productInfo.noOfUsersRated = 0;
            }
            productInfo.totalRating += ratingData.rate;
            productInfo.noOfUsersRated += 1;
            productInfo.averageRating = productInfo.totalRating / productInfo.noOfUsersRated;
            const ratingInfo: RatingModel = {
                rate: ratingData.rate,
                description: ratingData.description,
                user: user._id,
                product: ratingData.productId,
                order: ratingData.order,
            };
            const cartIndex = cartData.cart.findIndex(c => c.productId == ratingData.productId);
            if (!cartData.cart[cartIndex].rating) {
                cartData.cart[cartIndex].rating = 0;
            }
            cartData.cart[cartIndex].rating = ratingData.rate;
            const ratingRes = await this.ratingModel.create(ratingInfo);
            const orderUpdate = await this.cartModel.findByIdAndUpdate(cartData._id, cartData);
            if (ratingRes._id) {
                const res = await this.productModel.findByIdAndUpdate(productInfo._id, productInfo);
                return {response_code: HttpStatus.CREATED, response_data: 'Rating saved successfully'};
            } else {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save product rating'};
            }
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such product exist'};
        }
    }

    //get Rating APi
    public async getRatedProduct(productId: string): Promise<CommonResponseModel> {
        const resData = await this.ratingModel.find({'product': productId}).populate('product');
        return {
            response_code: HttpStatus.OK,
            response_data: resData
        };
    }
}
