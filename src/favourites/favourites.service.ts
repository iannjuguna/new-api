import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {FavouritesDTO} from './favourites.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';

@Injectable()
export class FavouritesService {
    constructor(@InjectModel('Favourites') private readonly favouritesModel: Model<any>,@InjectModel('Cart') private readonly cartModel: Model<any>) {

    }
    // product data normalize
    public async ProductDataCustomize(cart,products){
        for(let item of cart.cart){
            console.log("fav.unit",item.unit)
            let unit=item.unit;
            let quantity=item.quantity
            const productIndex = products.findIndex(val => (val && val.product && val.product._id.toString() == item.productId.toString()));
            if (productIndex === -1) {
            } else {
                console.log("fav productIndex",productIndex)
                let obj=products[productIndex].toJSON();
                if(obj && obj.product.variant.length>1){
                    const unitIndex = obj.product.variant.findIndex(val => val.unit == unit);
                    if(unitIndex>0){
                        console.log("unitIndex",obj.product.variant[unitIndex])
                        let tempVariant=obj.product.variant[unitIndex];
                        obj.product.variant.splice(unitIndex,1)
                        obj.product.variant.unshift(tempVariant)
                    }
                }
                obj.cartAddedQuantity=quantity;
                obj.cartId=cart._id;
                obj.cartAdded=true;
                products.splice(productIndex, 1,obj) 
            }
        }
        return products
    }
    
    // get's all favourites of user
    public async getUserFavourites(userId: string): Promise<CommonResponseModel> {
        let products = await this.favouritesModel.find({user: userId}).populate('product','title imageUrl category isDealAvailable delaPercent variant averageRating')
        if(products && products.length){
            let cart=await this.cartModel.findOne({user: userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        return {response_code: HttpStatus.OK, response_data: products};
    }

    // get's favourite information
    public async getFavouriteInfo(favouriteId: string): Promise<CommonResponseModel> {
        const favouriteInfo = await this.favouritesModel.findById(favouriteId).populate('product');
        if (favouriteInfo) {
            return {response_code: HttpStatus.OK, response_data: favouriteInfo};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such favourite record exist'};
        }
    }

    // save favourite
    public async saveFavourite(user: UsersDTO, favouriteData: FavouritesDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Sorry !!. You are not authorized to access api.'};
        }
        const checkIfExist = await this.favouritesModel.findOne({user: user._id, product: favouriteData.product});
        if (checkIfExist) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Product is already added to your favourites'};
        }
        favouriteData.user = user._id;
        const response = await this.favouritesModel.create(favouriteData);
        if (response._id) {
            return {response_code: HttpStatus.CREATED, response_data: 'Product added to favourites'};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not add the product to favourites'};
        }
    }

    // deletes favourite
    public async deleteFavourite(user: UsersDTO, favouriteId: string): Promise<CommonResponseModel> {
        if (user.role == 'User') {
            const response = await this.favouritesModel.findByIdAndDelete(favouriteId);
            return {response_code: HttpStatus.OK, response_data: 'Favourite deleted successfully'};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Sorry !!. You are not authorized to access api.'};
        }
    }

    //delete fav item by product id
    public async deleteFavouritebyProdutItem(user: UsersDTO, favouriteId: string): Promise<CommonResponseModel> {
        if (user.role == 'User') {
            const response = await this.favouritesModel.findOneAndDelete({user: favouriteId});
            return {response_code: HttpStatus.OK, response_data: 'Favourite deleted successfully'};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Sorry !!. You are not authorized to access api.'};
        }
    }

    // checks if user has added a product to favourite
    public async checkIfUserHasAddedProductToFavourite(user: UsersDTO, productId: string): Promise<CommonResponseModel> {
        if (user.role == 'User') {
            const response = await this.favouritesModel.findOne({user: user._id, product: productId});
            return {response_code: HttpStatus.OK, response_data: response};
        } else {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Sorry !!. You are not authorized to access api.'};
        }
    }
}
