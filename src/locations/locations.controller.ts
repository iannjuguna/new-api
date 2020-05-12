import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {LocationsService} from './locations.service';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {LocationsDTO, LocationStausDTO} from './locations.model';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('locations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LocationsController {
    constructor(private locationService: LocationsService) {

    }

    // sends request to get all location
    @Get('/all')
    public getAllLocations(): Promise<CommonResponseModel> {
        return this.locationService.getAlllocation();
    }

    // sends request to get location details
    @Get('/details/:locationId')
    public getDetails(@Param('locationId') locationId: string) {
        return this.locationService.getLocationInformation(locationId);
    }

    // sends request to get all location by pagination
    @Get('/:page/:limit')
    public getAllLocationsByPagination(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.locationService.getLocationByPagination(parseInt(page), parseInt(limit));
    }

    // sends request to save location
    @Post('/save')
    public saveLocation(@GetUser() user: UsersDTO, @Body() location: LocationsDTO): Promise<CommonResponseModel> {
        return this.locationService.saveLocation(user, location);
    }

    // sends request to update location
    @Put('/update/:locationId')
    public updateLocation(@GetUser() user: UsersDTO, @Param('locationId') locationId: string, @Body() location: LocationsDTO): Promise<CommonResponseModel> {
        return this.locationService.updateLocation(user, locationId, location);
    }

    // sends request to delete location
    @Delete('/delete/:locationId')
    public deleteLocation(@GetUser() user: UsersDTO, @Param('locationId') locationId: string): Promise<CommonResponseModel> {
        return this.locationService.deleteLocation(user, locationId);
    }
    //location status update
    @Put('status/update/:id')
    public statusUpdate(@Param('id')id:string,@Body()locationStatusData:LocationStausDTO):Promise<CommonResponseModel>{
        return this.locationService.updateStatusLocation(id,locationStatusData);
    }
}
