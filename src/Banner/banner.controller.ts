import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {BannerService} from './banner.service';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {BannerDTO} from './banner.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('banner')

export class BannerController {
    constructor(private bannerService: BannerService) {
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/pagination/:pageNume/:limit')
    public getBannerByPagination(@GetUser() user: UsersDTO, @Param('pageNume') pageNume: number, @Param('limit') limit: number) {
        return this.bannerService.getBannerByPagination(user, Number(pageNume), Number(limit));
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/save')
    public saveBanner(@GetUser() user: UsersDTO, @Body() bannerData: BannerDTO): Promise<CommonResponseModel> {
        return this.bannerService.saveBanner(user, bannerData);
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/update/:bannerId')
    public updateBanner(@GetUser() user: UsersDTO, @Param('bannerId') bannerId: string, @Body() bannerData: BannerDTO): Promise<CommonResponseModel> {
        return this.bannerService.updateBanner(user, bannerId, bannerData);
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('/delete/:bannerId')
    public deleteBanner(@GetUser() user: UsersDTO, @Param('bannerId') bannerId: string): Promise<CommonResponseModel> {
        return this.bannerService.deleteBanner(user, bannerId);
    }

    //user api get banner list home page
    @Get('/')
    public getBanners(): Promise<CommonResponseModel> {
        return this.bannerService.getBanner();
    }
}
