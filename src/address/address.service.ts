import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDTO } from '../users/users.model';
import { AddressDTO } from './address.model';
import { CommonResponseModel } from '../utils/app-service-data';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class AddressService {
  constructor(@InjectModel('Address') private readonly addressModel: Model<any>, private uploadService: UploadService) {

  }

  // get's list of all Address of user
  public async getAddress(userId: string): Promise<CommonResponseModel> {
    const address = await this.addressModel.find({ user: userId });
    return { response_code: HttpStatus.OK, response_data: address };
  }

  // get's Address information
  public async getAddressInformation(addressId: string): Promise<CommonResponseModel> {
    console.log("addressId",addressId)
    const addressInfo = await this.addressModel.findById(addressId) as AddressDTO;
    
    if (addressInfo) {
      return { response_code: HttpStatus.OK, response_data: addressInfo };
    } else {
      return { response_code: HttpStatus.BAD_REQUEST, response_data: 'No Address found' };
    }
  }

  // creates a new Address
  public async saveAddress(user: UsersDTO, address: AddressDTO): Promise<CommonResponseModel> {
    if (user.role !== 'User') {
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: 'Sorry !!, Only user are allowed to access this api',
      };
    } else {
      address.user = user._id;
      // const geoCodedRes = await this.uploadService.geoCodeAddress(address, 'address');
      // address.location = {
      //   type: 'Point',
      //   coordinates: [geoCodedRes[0].longitude, geoCodedRes[0].latitude],
      // };
      const response = await this.addressModel.create(address);
      if (response._id) {
        return { response_code: HttpStatus.CREATED, response_data: {message:'Address saved successfully' }};
      } else {
        return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Something went wrong. Could not save Address' };
      }
    }
  }

  // updates Address info
  public async updateAddress(user: UsersDTO, addressId: string, addressData: AddressDTO): Promise<CommonResponseModel> {
    if (user.role !== 'User') {
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: 'Sorry !!, Only user are allowed to access this api',
      };
    } else {
      // const geoCodedRes = await this.uploadService.geoCodeAddress(addressData, 'address');
      // addressData.location = {
      //   type: 'Point',
      //   coordinates: [geoCodedRes[0].longitude, geoCodedRes[0].latitude],
      // };
      const response = await this.addressModel.findByIdAndUpdate(addressId, addressData);
      return { response_code: HttpStatus.OK, response_data: 'Address updated successfully' };
    }
  }

  // deletes user's Address
  public async deleteAddress(user: UsersDTO, addressId: string): Promise<CommonResponseModel> {
    if (user.role !== 'User') {
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: 'Sorry !!, Only user are allowed to access this api',
      };
    } else {
      const response = await this.addressModel.findByIdAndDelete(addressId);
      return { response_code: HttpStatus.OK, response_data: 'Address deleted successfully' };
    }
  }
}
