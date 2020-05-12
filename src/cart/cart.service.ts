import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CommonResponseModel, globalConfig} from '../utils/app-service-data';
import {UsersDTO, UsersUpdateDTO} from '../users/users.model';
import {CartDataModel, CartDTO, CartModel, DeleteCartProductDTO, UpdateCartDTO} from './cart.model';
import {ProductsDTO} from '../products/products.model';
import {CouponsDTO,CouponCodeDTO} from '../coupons/coupons.model';

import {DeliveryTaxDTO} from '../delivery-tax-info/delivery-tax.model';

@Injectable()
export class CartService {
    constructor(@InjectModel('Cart') private readonly cartModel: Model<any>, @InjectModel('Products') private readonly productsModel: Model<any>, @InjectModel('Coupons') private readonly couponModel: Model<any>, @InjectModel('Users') private readonly usersModel: Model<any>, @InjectModel('DeliveryTaxSettings') private readonly deliveryModel: Model<any>) {

    }

    // get's user's cart list
    public async getUsersCartList(userId: string): Promise<CommonResponseModel> {
        const cartData = await this.cartModel.findOne({
            user: userId,
            isOrderLinked: false,
        }).populate('coupon').populate('cart.productId').populate('product');
        return {response_code: HttpStatus.OK, response_data: cartData ? cartData : 'You have not added items to cart'};
    } 

    // saves cart info
    public async saveCartData(user: UsersDTO, cartData: CartDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const check = await this.cartModel.findOne({user: user._id, isOrderLinked: false});
            let cartInfo: CartDataModel = {
                cart: [],
                subTotal: 0,
                tax: 0,
                grandTotal: 0,
                deliveryCharges: 0,
                isOrderLinked: false,
                user: user._id,
                products: check ? (check.products ? check.products : []) : [],

            };
            if (!check) {
                const productInfo = await this.productsModel.findById(cartData.productId) as ProductsDTO;
                if (productInfo) {
                    if(productInfo && productInfo.variant && productInfo.variant.length){
                        console.log("unitunitunitunitunitunitunit........................",JSON.stringify(cartData["unit"]))
                        const productIndex = productInfo.variant.findIndex(val => val.unit == cartData["unit"]);
                        if (productIndex === -1) {
                        } else {
                            if(productInfo.variant[productIndex].productstock<cartData.quantity){
                                return {
                                    response_code: 400,
                                    response_data: `Only ${productInfo.variant[productIndex].productstock} Quantity left`,
                                };
                            }
                        }
                    }else{
                        return {
                            response_code: 400,
                            response_data: `Product out of stock`,
                        };
                    }




                    const data = this.setCartInfo(productInfo, cartData);
                    cartInfo.cart.push(data);
                    cartInfo.products.push(data.productId);
                    const response = await this.calculateTotalAndSaveCart(cartInfo, 'save', null);
                    if (response._id) {
                        const updatedCart = await this.cartModel.findOne({
                            user: user._id,
                            isOrderLinked: false,
                        }).populate('coupon');
                        return {response_code: HttpStatus.OK, response_data: updatedCart, extra: response._id};
                    } else {
                        return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not add product to cart'};
                    }
                }
            } else {
                cartInfo.cart = check.cart;
                const productInfo = await this.productsModel.findById(cartData.productId) as ProductsDTO;
                if (productInfo) {
                    if(productInfo && productInfo.variant && productInfo.variant.length){
                        console.log("unitunitunitunitunitunitunit........................",JSON.stringify(cartData["unit"]))
                        const index = productInfo.variant.findIndex(val => val.unit == cartData["unit"]);
                        if (index === -1) {
                        } else {
                            if(productInfo.variant[index].productstock<cartData.quantity){
                                return {
                                    response_code: 400,
                                    response_data: `Only ${productInfo.variant[index].productstock} Quantity left`,
                                };
                            }
                        }
                    }else{
                        return {
                            response_code: 400,
                            response_data: `Product out of stock`,
                        };
                    }
                    const productIndex = cartInfo.cart.findIndex(val => val.productId == cartData.productId);
                    if (productIndex === -1) {
                        const data = this.setCartInfo(productInfo, cartData);
                        cartInfo.cart.push(data);
                        cartInfo.products.push(data.productId);
                    } else {
                        cartInfo.cart[productIndex].quantity = cartData.quantity;
                    }
                    const response = await this.calculateTotalAndSaveCart(cartInfo, 'update', check._id);
                    const updatedCart = await this.cartModel.findOne({user: user._id, isOrderLinked: false}).populate('coupon');
                    return {response_code: HttpStatus.OK, response_data: updatedCart};
                }
            }
        }
    }
    
    // calculate cart sub total and grand total and save cart ObjectId("")
    private async calculateTotalAndSaveCart(cartInfo: CartDataModel, type: string, cartId: string) {
        //const list = await this.deliveryModel.find();
        const adminSettings=await this.deliveryModel.findOne({})
        console.log("adminSettings",adminSettings)
        cartInfo.subTotal = 0;
        cartInfo.grandTotal = 0;
        cartInfo.cart.forEach(cart => {
            cart.dealTotalAmount = (cart.dealAmountOneProd) * cart.quantity;
            cart.productTotal = Number(((cart.price-cart.dealAmountOneProd) * cart.quantity).toFixed(2));
            cartInfo.subTotal += cart.productTotal;
        });
        cartInfo.tax = adminSettings.taxAmount;
        cartInfo.subTotal=Number(cartInfo.subTotal.toFixed(2));
        let couponCharge=0;
        if(cartInfo && cartInfo.couponInfo && cartInfo.couponInfo["couponDiscountAmount"]){
            couponCharge= cartInfo.couponInfo["couponDiscountAmount"];
        }
        cartInfo.grandTotal = Number((cartInfo.subTotal + cartInfo.tax + cartInfo.deliveryCharges-couponCharge).toFixed(2));
        // console.log("final cart.............................................",JSON.stringify(cartInfo));
        if (type === 'save') {
            const res = await this.cartModel.create(cartInfo);
            return res;
        } else {
            const response = await this.cartModel.findByIdAndUpdate(cartId, cartInfo,{new:true});
            return response;
        }
    }
    private async calculateTotalAndUpdateMultiCart(cartInfo: CartDataModel, type: string, cartId: string) {
        const list = await this.deliveryModel.find();
        const adminSettings: DeliveryTaxDTO = list[0];
        cartInfo.subTotal = 0;
        cartInfo.grandTotal = 0;
        cartInfo.cart.forEach(cart => {
            cart.dealTotalAmount = (cart.dealAmountOneProd) * cart.quantity;
            cart.productTotal = Number(((cart.price-cart.dealAmountOneProd) * cart.quantity).toFixed(2));
            cartInfo.subTotal += cart.productTotal;
        });
        cartInfo.deliveryCharges = 0;
        cartInfo.tax = adminSettings.taxAmount;
        cartInfo.subTotal=Number(cartInfo.subTotal.toFixed(2));
        if(cartInfo && cartInfo.couponInfo && cartInfo.couponInfo["couponDiscountAmount"]){
            cartInfo.coupon=null;
            cartInfo.couponInfo=null;
        }
        cartInfo.grandTotal = Number((cartInfo.subTotal + cartInfo.tax+ cartInfo.deliveryCharges).toFixed(2));
        const response = await this.cartModel.findByIdAndUpdate(cartId, cartInfo,{new:true});
        return response
    }

    // sets product information and returns cart data
    private setCartInfo(productInfo: ProductsDTO, cartData: CartDTO): CartModel {
        //finding price here
        let price;
        let originalPrice;
        for (let i = 0; i < productInfo.variant.length; i++) {
            if (productInfo.variant[i]['unit'] == cartData['unit']) {
                price = Number(productInfo.variant[i]['price']);
            }
        }
        //unit finding
        let unit; 
        for (let j = 0; j < productInfo.variant.length; j++) {
            if (productInfo.variant[j]['title'] == cartData.variantsName) {
                unit = productInfo.variant[j]['unit'];
            }
        }
        originalPrice = price;

        let delaPercent=0,dealAmount=0,isDealAvailable=false;
        if (productInfo.isDealAvailable) {
            delaPercent=productInfo.delaPercent;
            isDealAvailable=true;
            dealAmount=Number((Number(productInfo.delaPercent)*(Number(originalPrice))/100).toFixed(2))
        }
        //dscription
        let cartInfo: CartModel = {
            productId: productInfo._id,
            title: productInfo.title,
            variantsName: productInfo.title,
            productName: productInfo.title,
            imageUrl: productInfo.imageUrl,
            quantity: Number(cartData.quantity),
            // price:productInfo.price,
            price: originalPrice,
            productTotal: Number(originalPrice) * cartData.quantity,
            description: productInfo.description,
            unit: cartData['unit'],
            // weight: productInfo.weight,
            dealAmountOneProd:dealAmount,
            delaPercent:delaPercent,
            dealTotalAmount:dealAmount *cartData.quantity,
            isDealAvailable:isDealAvailable


        };


        return cartInfo;

    }

    // updates cart item
    public async updateCartItem(user: UsersDTO, cartData: UpdateCartDTO): Promise<CommonResponseModel> {
        console.log("cart update tessssssssttttttttttttttttt",JSON.stringify(cartData))
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const cartInfo = await this.cartModel.findOne({_id: cartData.cartId, isOrderLinked: false}) as CartDataModel;
            if (cartInfo) {
                const index = cartInfo.cart.findIndex(val => val.productId == cartData.productId);
                if (index !== -1) {
                    const product = await this.productsModel.findOne({_id:cartData.productId,status:1});
                    if(product && product.variant && product.variant.length){
                        const productIndex = product.variant.findIndex(val => val.unit == cartInfo.cart[index].unit);
                        console.log("productIndex",JSON.stringify(productIndex))
                        if (productIndex === -1) {
                        } else {
                            console.log("productIndex",JSON.stringify(product.variant[productIndex]))
                            if(product.variant[productIndex].productstock<cartData.quantity){
                                console.log("productIndex",JSON.stringify(product.variant[productIndex]))
                                return {
                                    response_code: 400,
                                    response_data: `Only ${product.variant[productIndex].productstock} Quantity left`,
                                };
                            }
                        }
                    }else{
                        return {
                            response_code: 400,
                            response_data: `Product out of stock`,
                        };
                    }
                    cartInfo.cart[index].quantity = cartData.quantity;
                    const res = await this.calculateTotalAndSaveCart(cartInfo, 'update', cartData.cartId);
                    const updatedCart = await this.cartModel.findOne({user: user._id, isOrderLinked: false}).populate('coupon');
                    return {response_code: HttpStatus.OK, response_data: updatedCart};
                } else {
                    return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such product is added to your cart'};
                }
            } else {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
            }
        }
    }

    // deletes product from cart
    public async deleteProductFromCart(user: UsersDTO, cartData: DeleteCartProductDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const cartInfo = await this.cartModel.findById(cartData.cartId) as CartDataModel;
            if (cartInfo) {
                const productIndex = cartInfo.cart.findIndex(list => list.productId == cartData.productId);
                if (productIndex !== -1) {
                    cartInfo.cart.splice(productIndex, 1);
                    const pIndex = cartInfo.products.findIndex(p => p == cartData.productId);
                    if (pIndex !== -1) {
                        cartInfo.products.splice(pIndex, 1);
                    }
                    if (cartInfo.cart.length > 0) {
                        const res = await this.calculateTotalAndSaveCart(cartInfo, 'update', cartData.cartId);
                        const updatedCart = await this.cartModel.findOne({
                            user: user._id,
                            isOrderLinked: false,
                        }).populate('coupon');
                        return {response_code: HttpStatus.OK, response_data: updatedCart};
                    } else {
                        const resp = await this.cartModel.findByIdAndDelete(cartData.cartId);
                        return {response_code: HttpStatus.OK, response_data: 'Your cart is empty'};
                    }
                }
            } else {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
            }
        }
    }
    // deletes MULTIPLE ITEM from cart
    public async deleteMultiProductFromCart(user: UsersDTO, cartData): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const cartInfo = await this.cartModel.findById(cartData.cartId) as CartDataModel;
            if (cartInfo) {
                if(cartData.cart.length){
                    for(let product of cartData.cart){
                        const productIndex = cartInfo.cart.findIndex(list => list.productId == product.productId);
                        if (productIndex !== -1) {
                            cartInfo.cart.splice(productIndex, 1);
                            const pIndex = cartInfo.products.findIndex(p => p == product.productId);
                            if (pIndex !== -1) {
                                cartInfo.products.splice(pIndex, 1);
                            }
                        }
                    }
                    if(cartInfo.coupon){
                        cartInfo.coupon=null;
                        cartInfo.couponInfo=null;
                    }
                    const res = await this.calculateTotalAndUpdateMultiCart(cartInfo, 'update', cartData.cartId);
                    if(res && res.cart.length==0){
                        await this.cartModel.findByIdAndRemove(cartData.cartId);
                        return {response_code: HttpStatus.OK, response_data: 'Cart deleted'};
                    }else{
                        console.log("res..........",JSON.stringify(res))
                        return {response_code: HttpStatus.OK, response_data: res};
                    }
                }
            } else {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
            }
        }
    }

    // applies coupon to cart
    public async applyCoupon(user: UsersDTO, id: string,couponCodeDTO:CouponCodeDTO): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const couponInfo = await this.couponModel.findOne({couponCode: couponCodeDTO.couponCode,status:1}) as CouponsDTO;
            if (couponInfo) {
                const currentDate = Date.now();
                if (couponInfo.startDate < currentDate && couponInfo.expiryDate>currentDate) {
                    const cartInfo = await this.cartModel.findOne({_id: id, isOrderLinked: false}) as CartDataModel;
                    if (cartInfo) {
                        if(cartInfo.coupon){
                            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Coupon already applied, first remove'};

                        }else{
                            let couponDiscountAmount=0;
                            if (couponInfo.couponType === 'PERCENTAGE') {
                                couponDiscountAmount = Number((cartInfo.subTotal * (couponInfo.offerValue / 100)).toFixed(2));
                            } else {
                                couponDiscountAmount = Number(couponInfo.offerValue);
                            }
                            cartInfo.coupon=couponInfo._id;
                            cartInfo.couponInfo={
                                couponCode:couponCodeDTO.couponCode,
                                couponDiscountAmount:couponDiscountAmount
                            }
                            cartInfo.grandTotal=Number((cartInfo.grandTotal-couponDiscountAmount).toFixed(2));
                            const res = await this.cartModel.findByIdAndUpdate(cartInfo._id, cartInfo,{new:true});
                            return {response_code: HttpStatus.OK, response_data: res}; 
                        }
                        
                    } else {
                        return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
                    }
                }else{
                    return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Coupon has expired, Enter a valid coupon.'};
                }
            } else {
                return {
                    response_code: HttpStatus.BAD_REQUEST,
                    response_data: `Coupon ${couponCodeDTO.couponCode} does not exist. Enter a valid coupon.`,
                };
            }
        }
    }

    // removes coupon
    public async removeCoupon(user: UsersDTO,id:string): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const cartInfo = await this.cartModel.findOne({_id:id, isOrderLinked: false}) as CartDataModel;
            if (cartInfo ) {
                if(cartInfo.coupon){
                    const list = await this.deliveryModel.find();
                    const adminSettings=list[0];
                    cartInfo.tax = adminSettings.taxAmount;
                    cartInfo.subTotal=Number(cartInfo.subTotal.toFixed(2));
                    cartInfo.grandTotal = Number((cartInfo.subTotal + cartInfo.tax+cartInfo.deliveryCharges).toFixed(2));
                    cartInfo.couponInfo=null;
                    cartInfo.coupon=null;
                    const res = await this.cartModel.findByIdAndUpdate(cartInfo._id, cartInfo,{new:true});
                    return {response_code: HttpStatus.OK, response_data: res};
                }else{
                    return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such coupon exist'}; 
                }
            } else {
                return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
            }
        }
    }

    // deletes cart item
    public async deleteCartItem(user: UsersDTO, cartId: string): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        }
        const cartInfo: CartDataModel = await this.cartModel.findById(cartId);
        if (!cartInfo) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Invalid cart reference'};
        }
        if (cartInfo.isOrderLinked) {
            return {
                response_code: HttpStatus.BAD_REQUEST,
                response_data: 'This cart is linked to an order, you cannot this cart.',
            };
        }
        const res = await this.cartModel.findByIdAndDelete(cartId);
        return {response_code: HttpStatus.OK, response_data: 'Cart deleted successfully'};
    }
}


// if (couponInfo.startDate < currentDate && couponInfo.expiryDate>currentDate) {
//     const cartInfo = await this.cartModel.findOne({_id: id, isOrderLinked: false}) as CartDataModel;
//     if (cartInfo) {
//         const list = await this.deliveryModel.find();
//         const adminSettings: DeliveryTaxDTO = list[0];
//         cartInfo.tax = adminSettings.taxAmount;
//         cartInfo.grandTotal = cartInfo.subTotal;
//         if (couponInfo.couponType === 'PERCENTAGE') {
//             cartInfo.grandTotal -= Number((cartInfo.grandTotal * (couponInfo.offerValue / 100)).toFixed(2));
//         } else {
//             cartInfo.grandTotal -= Number(couponInfo.offerValue);
//         }
//         cartInfo.grandTotal += cartInfo.tax;
//         cartInfo.grandTotal += cartInfo.deliveryCharges;
//         cartInfo.coupon = couponInfo._id;
//         const res = await this.cartModel.findByIdAndUpdate(cartInfo._id, cartInfo);
//         // const updatedCart = await this.cartModel.findOne({user: user._id, isOrderLinked: false}).populate('coupon');
//         return {response_code: HttpStatus.OK, response_data: cartInfo};
//     } else {
//         return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such cart exist'};
//     }
// }else{
//     return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Coupon has expired, Enter a valid coupon.'};
// }