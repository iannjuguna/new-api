import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CommonResponseModel } from '../utils/app-service-data';
import { GetUser } from '../utils/user.decorator';
import { UsersDTO } from '../users/users.model';
import { CartDTO, DeleteCartProductDTO, UpdateCartDTO } from './cart.model';
import { CouponCodeDTO} from '../coupons/coupons.model';


import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {

  }

  // sends request to get user's cart list
  @Get('/user/items')
  public getUsersCartList(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
    return this.cartService.getUsersCartList(user._id);
  }

  // sends request to apply coupon on cart item id=cart_id
  @Post('/apply/coupon/:id')
  public applyCoupon(@GetUser() user: UsersDTO, @Param('id') id: string,@Body() couponCodeDTO: CouponCodeDTO) {
    return this.cartService.applyCoupon(user, id,couponCodeDTO);
  }

  // removes coupon applied to cart id=cart_id
  @Get('/remove/coupon/:id')
  public removeCoupon(@GetUser() user: UsersDTO,@Param('id') id: string): Promise<CommonResponseModel> {
    return this.cartService.removeCoupon(user,id);
  }

  // sends request to add item to the cart
  @Post('/add/product')
  public addItem(@GetUser() user: UsersDTO, @Body() cart: CartDTO): Promise<CommonResponseModel> {
    return this.cartService.saveCartData(user, cart);
  }

  // sends request to update cart
  @Put('/update/product')
  public updateCart(@GetUser() user: UsersDTO, @Body() cart: UpdateCartDTO): Promise<CommonResponseModel> {
    return this.cartService.updateCartItem(user, cart);
  }

  // sends request to delete product from cart
  @Put('/delete/product')
  public removeProductFromCart(@GetUser() user: UsersDTO, @Body() cartData: DeleteCartProductDTO): Promise<CommonResponseModel> {
    return this.cartService.deleteProductFromCart(user, cartData);
  }
  // sends request to delete product from cart
  @Put('/remove/multi/product')
  public deleteMultiProductFromCart(@GetUser() user: UsersDTO, @Body() cartData: any): Promise<CommonResponseModel> {
    return this.cartService.deleteMultiProductFromCart(user, cartData);
  }



  // sends request to delete all products in cart
  @Delete('/all/items/:cartId')
  public deleteAllProducts(@GetUser() user: UsersDTO, @Param('cartId') cartId: string): Promise<CommonResponseModel> {
    return this.cartService.deleteCartItem(user, cartId);
  }

}
