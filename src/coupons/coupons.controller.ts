import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {CouponsService} from './coupons.service';
import {CommonResponseModel} from '../utils/app-service-data';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {CouponsDTO, CouponStatusDTO} from './coupons.model';

@Controller('coupons')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CouponsController {
    constructor(private couponService: CouponsService) {

    }
    
    // sends request to get coupon information
    @Get('/info/:couponId')
    public couponInfo(@Param('couponId') couponId: string): Promise<CommonResponseModel> {
        return this.couponService.couponInfo(couponId);
    }

    // sends request to get coupons by pagination
    @Get('/:page/:limit')
    public couponsListByPagination(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.couponService.couponsListByPagination(parseInt(page), parseInt(limit));
    }

    // sends request to save coupon
    @Post('/save')
    public saveCoupon(@GetUser() user: UsersDTO, @Body() couponData: CouponsDTO): Promise<CommonResponseModel> {
        return this.couponService.saveCoupon(user, couponData);
    }

    // sends request to update coupon
    @Put('/update/:couponId')
    public updateCoupon(@GetUser() user: UsersDTO, @Param('couponId') couponId: string, @Body() couponData: CouponsDTO): Promise<CommonResponseModel> {
        return this.couponService.updateCoupon(user, couponId, couponData);
    }

    // sends request to delete coupon
    @Delete('/delete/:couponId')
    public deleteCoupon(@GetUser() user: UsersDTO, @Param('couponId') couponId: string) {
        return this.couponService.deleteCoupon(user, couponId);
    }

    // update status coupon
    @Put('status/update/:id')
    public updateCouponStatus(@Param('id')id: string, @Body()couponStatusData: CouponStatusDTO) {
        return this.couponService.couponStatusUpdate(id, couponStatusData);
    }


    // // sends request to search coupon by title of description
    // @Get('/search/:query')
    // public searchCoupon(@Param('query') query: string): Promise<CommonResponseModel> {
    //     return this.couponService.searchCoupon(query);
    // }
}
