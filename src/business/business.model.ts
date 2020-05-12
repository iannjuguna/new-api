import * as mongoose from 'mongoose';
import {IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsUrl} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export const BusinessSchema = new mongoose.Schema({
    email: {
        type:String
    },
    profession: {
        type:String
    },
    description: {
        type:String
    },
    address: {
        type:String
    },
    facebookUrl: {
        type: String
    },googleUrl:{
     type:String
    },tearmsAndConditionUrl:{
        type:String
    },
    privacyPolicyUrl:{
     type:String
    },
    webLogo:{
     imageUrl:{
         type:String
     },
     imageId:{
           type:String
    },
   },
    dasboardLogo:{
        imageUrl:{
            type:String
        },
        imageId:{
              type:String
       },
    },
    deliveryAppLogo:{
        imageUrl:{
            type:String
        },
        imageId:{
              type:String
       },
    },
     userApp:{
        imageUrl:{
            type:String
        },
        imageId:{
              type:String
       },
     },
     webApp:{
        imageUrl:{
            type:String
        },
        imageId:{
              type:String
       },
     },
    instagramUrl: {
        type:String
    },
    twitterUrl: {
        type:String
    },
    linkedInUrl:{
        type:String
    },
    officeLocation: {
        type:Array
    },
    phoneNumber: {
        type: Number
    },
    pinterestPage: {
        type:String
    },
    storeName: {
        type:String
    },
    mapAnnotation: {
        type:Array
    },
    mapOriginLatitude: {
        type:Number
    },
    mapOriginLongitude: {
        type:Number
    },
    mapZoomLevel: {
        type:Number
    },
    aboutUs:{
        type:String
    },
}, {timestamps: true});

export class BusinessDTO{
    @IsOptional()
    @IsMongoId()
    _id: string;

    @ApiModelProperty()  
    email:string;

    @ApiModelProperty()
    phoneNumber:number

    @ApiModelProperty()
    profession:string;

    @ApiModelProperty()
    description:string;

    @ApiModelProperty()
    address:string;

    @ApiModelProperty()
    facebookUrl:string;
    @ApiModelProperty()
    googleUrl:string
    @ApiModelProperty()
    tearmsAndConditionUrl:string
    @ApiModelProperty()
    privacyPolicyUrl:string
    @ApiModelProperty()
    linkedInUrl:string

    @ApiModelProperty()
    twitterUrl:string

    @ApiModelProperty()
    instagramUrl:string
    
    @ApiModelProperty()
    dasboardLogo:string;

    @ApiModelProperty()
    deliveryAppLogo:string;

    @ApiModelProperty()
    userApp:string

    @ApiModelProperty()
    webApp:string;

    @ApiModelProperty()
    storeName:string;

    @ApiModelProperty()
    pinterestPage:string
    
    @ApiModelProperty()
    aboutUs:string

}
//dasbordupdate
export class dashBordDTO{
    @IsOptional()
    @IsMongoId()
    _id: string;
    @ApiModelProperty()  
    email:string;
    @ApiModelProperty()
    profession:string;
    @ApiModelProperty()
    description:string;
    @ApiModelProperty()
    address:string;
    @ApiModelProperty()
    facebookUrl:string;
    @ApiModelProperty()
    dasboardLogo:string;

}