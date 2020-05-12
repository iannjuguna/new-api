import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UploadService} from '../upload/upload.service';
import {UsersDTO} from '../users/users.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {LocationsDTO, LocationStausDTO} from './locations.model';
import { ok } from 'assert';

@Injectable()
export class LocationsService {
    constructor(@InjectModel('Locations') private readonly locationModel: Model<any>, private utilService: UploadService) {

    }

    // get's all location
    public async getAlllocation(): Promise<CommonResponseModel> {
        const locations = await this.locationModel.find({});
     //console.log(locations);
        if(locations.length==0){
           // console.log(locations);
            return {
                response_code:HttpStatus.OK,
                response_data:{message:"No Location Found"}
            };
        }
        else{
        return {response_code: HttpStatus.OK, response_data: locations};
        }
    }

    // get's all location by pagination
    public async getLocationByPagination(page: number, limit: number): Promise<CommonResponseModel> {
        console.log(page, limit);
        const locations = await this.locationModel.find({}).limit(limit).skip((page * limit) - limit);
        const totalLocations = await this.locationModel.countDocuments();
        return {response_code: HttpStatus.OK, response_data: {locations, totalLocations}};
    }

    // gets information about a location
    public async getLocationInformation(locationId: string): Promise<CommonResponseModel> {
        console.log(locationId);
        const locationInfo = await this.locationModel.findById(locationId);
        console.log(locationInfo);
        if (locationInfo) {
            return {response_code: HttpStatus.OK, response_data: locationInfo};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'No such location exist'};
        }
    }
    
    // save location
    public async saveLocation(user: UsersDTO, location: LocationsDTO): Promise<CommonResponseModel> {
        // if (user.role !== 'Admin') {
        //     return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
        // } else {
            const geoCodedRes = await this.utilService.geoCodeAddress(location, 'location');
            location.location = {
                type: 'Point',
                coordinates: [geoCodedRes[0].longitude, geoCodedRes[0].latitude]
            };
            const res = await this.locationModel.create(location);
            if (res._id) {
                return {response_code: HttpStatus.CREATED, response_data: 'Location saved successfully'};
            } else {
                return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'Could not save location'};
            }
       // }
    }

    // updates location
    public async updateLocation(user: UsersDTO, locationId: string, locationData: LocationsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
        } else {
            const geoCodeRes = await this.utilService.geoCodeAddress(locationData, 'location');
            locationData.location = {
                type: 'Point',
                coordinates: [geoCodeRes[0].longitude, geoCodeRes[0].latitude]
            };
            const res = await this.locationModel.findByIdAndUpdate(locationId, locationData);
            return {response_code: HttpStatus.OK, response_data: 'Location updated successfully'};
        }
    }

    // deletes location
    public async deleteLocation(user: UsersDTO, locationId: string): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api'};
        } else {
            const response = await this.locationModel.findByIdAndDelete(locationId);
            return {response_code: HttpStatus.OK, response_data: 'Location deleted successfully'};
        }
    }
    //Location status Update
    public async updateStatusLocation(id:string,locaationStatusData:LocationStausDTO):Promise<CommonResponseModel>{
        const res=await this.locationModel.findByIdAndUpdate(id,locaationStatusData);
        return{
            response_code:HttpStatus.OK,
            response_data:"Location status update successfully"
        }
    }
}
