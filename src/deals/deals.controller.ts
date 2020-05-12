import {Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {DealsService} from './deals.service';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {DealsDTO, DealsStatusDTO} from './deals.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('deals')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DealsController {
    constructor(private dealService: DealsService) {

    }



    // sends request to get deals by pagination
    @Get('/:page/:limit')
    public getDealsByPagination(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.dealService.getDealsByPagination(Number(page), Number(limit));
    }

    // sends request to get deal information
    @Get('/:dealId')
    public getDealInformation(@Param('dealId') dealId: string): Promise<CommonResponseModel> {
        return this.dealService.getDealInformation(dealId);
    }

    // sends request to create a new deal
    @Post('')
    public saveDeal(@GetUser() user: UsersDTO, @Body() dealData: DealsDTO): Promise<CommonResponseModel> {
        return this.dealService.createNewDeal(user, dealData);
    }

    // sends request to update deal
    @Put('/:dealId')
    public updateDeal(@GetUser() user: UsersDTO, @Param('dealId') dealId: string, @Body() dealData: DealsDTO): Promise<CommonResponseModel> {
        return this.dealService.updateDeal(user, dealId, dealData);
    }

    // sends request to delete deal
    @Delete('/delete/:dealId')
    public deleteDeal(@GetUser() user: UsersDTO, @Param('dealId') dealId: string): Promise<CommonResponseModel> {
        return this.dealService.deletesDeal(user, dealId);
    }

    //deal status Update
    @Put('status/update/:id')
    public dealStatus(@Param('id')id: string, @Body()dealstatusData: DealsStatusDTO): Promise<CommonResponseModel> {
        return this.dealService.dealsUpdateStatus(id, dealstatusData);
    }
}
