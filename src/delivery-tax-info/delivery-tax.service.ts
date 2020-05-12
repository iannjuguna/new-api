import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UsersDTO} from '../users/users.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {DeliveryTaxDTO, DeliveryTypeEnum, UserLocationDTO} from './delivery-tax.model';
import {UploadService} from '../upload/upload.service';
import {CartDataModel} from '../cart/cart.model';

@Injectable()
export class DeliveryTaxService {
    constructor(@InjectModel('DeliveryTaxSettings') private readonly deliveryModel: Model<any>, private helperService: UploadService, @InjectModel('Cart') private readonly cartModel: Model<any>) {
    }

    // get's store's settings
    public async getStoreDeliverySettings(user: UsersDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        }
        const deliveryTaxData = await this.deliveryModel.findOne({store: user._id});
        return {response_code: !deliveryTaxData ? HttpStatus.BAD_REQUEST : HttpStatus.OK, response_data: deliveryTaxData};
    }

    // get's admin delivery settings
    public async getAdminDeliverySettings(): Promise<CommonResponseModel> {
        const deliveryTaxData = await this.deliveryModel.find();
        return {response_code: !deliveryTaxData ? HttpStatus.BAD_REQUEST : HttpStatus.OK, response_data: deliveryTaxData[0]};
    }

    // saves/updates store's delivery and tax settings
    public async saveDeliveryTaxSettings(user: UsersDTO, deliveryData: DeliveryTaxDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        }
        if (!deliveryData._id) {
            const res = await this.deliveryModel.create(deliveryData);
            if (res._id) {
                return {response_code: HttpStatus.OK, response_data: 'Data saved successfully'};
            }
        } else {
            const res = await this.deliveryModel.findByIdAndUpdate(deliveryData._id, deliveryData);
            return {response_code: HttpStatus.OK, response_data: 'Data updated successfully'};
        }
    }

    // calculate distance between user location and store location  ObjectId("5e4e17bedba62e1b4886721a")
    public async calculateDistance(user: UsersDTO, userLocation: UserLocationDTO): Promise<CommonResponseModel> {
        if (user.role === 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to use this api'};
        }
        const list = await this.deliveryModel.find();
        const storeDeliverySettings: DeliveryTaxDTO = list[0];
        let temp=0
        let cartInfo: CartDataModel = await this.cartModel.findById(userLocation.cartId);
        if(cartInfo && cartInfo.couponInfo && cartInfo.couponInfo["couponDiscountAmount"]){
            console.log("cartInfo.couponInfo",cartInfo.couponInfo["couponDiscountAmount"])
            temp= cartInfo.couponInfo["couponDiscountAmount"];
        }
        cartInfo.deliveryAddress=userLocation.deliveryAddress

        if (storeDeliverySettings.deliveryType === DeliveryTypeEnum.flexible) {
            const adminLocation: UserLocationDTO = {latitude: storeDeliverySettings.location.lat, longitude: storeDeliverySettings.location.lng};
            const preciseDistance = this.helperService.calculateDistance(userLocation, adminLocation);
            let deliveryCharges = Number((storeDeliverySettings.deliveryChargePerKm * preciseDistance).toFixed(2));
            cartInfo.deliveryCharges = Number(deliveryCharges);
            cartInfo.tax = Number((storeDeliverySettings.taxAmount).toFixed(2));
            cartInfo.grandTotal = cartInfo.subTotal + cartInfo.tax + deliveryCharges-temp;
            cartInfo.grandTotal = Number((cartInfo.grandTotal).toFixed(2));
            let updated=await this.cartModel.findByIdAndUpdate(userLocation.cartId, cartInfo,{new:true});
            const chargesObj = Object.assign({tax: storeDeliverySettings.taxAmount, deliveryCharges, distance: preciseDistance});
            return {response_code: HttpStatus.OK, response_data: {deliveryDetails: chargesObj, cartData: updated}};
        } else {
            const chargesObj = Object.assign({tax: storeDeliverySettings.taxAmount, deliveryCharges: storeDeliverySettings.fixedDeliveryCharges});
            cartInfo.deliveryCharges = Number((storeDeliverySettings.fixedDeliveryCharges).toFixed(2));
            cartInfo.tax = Number((storeDeliverySettings.taxAmount).toFixed(2));
            cartInfo.grandTotal = Number((cartInfo.subTotal + cartInfo.tax + storeDeliverySettings.fixedDeliveryCharges-temp).toFixed(2));
            let updated=await this.cartModel.findByIdAndUpdate(userLocation.cartId, cartInfo,{new:true});
            return {response_code: HttpStatus.OK, response_data: {deliveryDetails: chargesObj, cartData: updated}};
        }
    }
}
