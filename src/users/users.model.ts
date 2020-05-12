import * as mongoose from 'mongoose';
import {
  IsNotEmpty,
  IsEmail,
  IsEmpty,
  IsUrl,
  IsNumber,
  Length,
  IsOptional,
  IsPositive,
  Min,
  Equals,
  IsArray,
  ValidateNested,
  IsString,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    profilePicId: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    otp: {
      type: Number,
    },
    playerId: {
      type: String
    },
    mobileNumberverified: {
      type: Boolean,
    },
    emailVerified: {
      type: Boolean,
    },
    verificationId: {
      type: String,
    },
    registrationDate: {
      type: Number,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    freeDeliveryDistance: {
      type: Number,
    },
    deliveryCharge: {
      type: Number,
    },
    deliveryDistanceUnit: {
      type: String,
    },
    tax: {
      type: Number,
    },
    fcmToken: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true
    },
    // only for admin
    exportedFile: {
      type: Object,
    },
    //newly added field loyaltyPoint and totalLoyaltyPoints
    loyaltyPoints: {
      type: Array
    },
    //current loyalty point
    totalLoyaltyPoints: {
      type: Number
    },

  },

  { timestamps: true },
);

export class CoOridnatesDTO {
  @IsOptional()
  @Equals('Point')
  @ApiModelProperty()
  type: string;

  @IsOptional()
  @IsArray()
  @ApiModelProperty()
  coordinates: Array<number>;
}
//only These role should be created
enum RoleType {
  User = 'User',
  DileveryBoy = 'Delivery Boy',
  Admin = 'Admin'
}


export class UsersDTO {
  @IsEmpty()
  _id: string;

  @IsOptional()
  @ApiModelProperty()
  firstName: string;

  @IsOptional()
  @ApiModelProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  @ApiModelProperty()
  password: string;

  @IsOptional()
  @Length(10, 12)
  @ApiModelProperty()
  mobileNumber: string;

  @IsEmpty()
  salt: string;

  @IsOptional()
  playerId: String

  @IsNotEmpty()
  @IsEnum(RoleType, { message: 'Role  type should be User or Admin or DeliveryBoy' })
  @ApiModelProperty()
  role: string;


  @IsOptional()
  otp: number;

  @IsOptional()
  @IsUrl()
  @ApiModelProperty()
  profilePic: string;

  @IsOptional()
  @ApiModelProperty()
  profilePicId: string;

  @IsOptional()
  registrationDate: number;

  @IsOptional()
  emailVerified: boolean;

  @IsOptional()
  mobileNumberverified: boolean;

  @IsOptional()
  verificationId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoOridnatesDTO)
  @ApiModelProperty()
  location: CoOridnatesDTO;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiModelProperty()
  freeDeliveryDistance: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiModelProperty()
  deliveryCharge: number;

  @IsOptional()
  @ApiModelProperty()
  deliveryDistanceUnit: string;

  fcmToken: string;
  status: boolean
  @IsOptional()
  @ApiModelProperty()
  loyaltyPoints: Array<any> = []
  @ApiModelProperty()
  totalLoyaltyPoints: number;
}

export class UsersUpdateDTO {
  @IsOptional()
  _id: string;

  @IsOptional()
  @ApiModelProperty()
  firstName: string;

  @IsOptional()
  @ApiModelProperty()
  lastName: string;

  @IsOptional()
  @Length(9, 9)
  @ApiModelProperty()
  mobileNumber: string;

  @IsEmpty()
  salt: string;

  @IsNotEmpty()
  @IsEnum(RoleType, { message: 'Role  type should be User or DeliveryBoy' })
  @ApiModelProperty()
  role: string;

  @IsOptional()
  otp: number;

  @IsOptional()
  @IsUrl()
  @ApiModelProperty()
  profilePic: string;

  @IsOptional()
  @ApiModelProperty()
  profilePicId: string;

  @IsOptional()
  registrationDate: number;

  @IsOptional()
  emailVerified: boolean;

  @IsOptional()
  mobileNumberverified: boolean;

  @IsOptional()
  verificationId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoOridnatesDTO)
  @ApiModelProperty()
  location: CoOridnatesDTO;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiModelProperty()
  freeDeliveryDistance: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiModelProperty()
  deliveryCharge: number;

  @IsOptional()
  @ApiModelProperty()
  deliveryDistanceUnit: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiModelProperty()
  tax: number;

  @IsOptional()
  @ApiModelProperty()
  fcmToken: string;

  @IsOptional()
  @ApiModelProperty()
  playerId: string
  status: boolean

}

export class CredentialsDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty()
  email: string;

  @IsOptional()
  playerId: string

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;
}
// mobile No. login credentails
export class CredentialsMobileDTO {
  @IsNotEmpty()
  @ApiModelProperty()
  mobileNumber: number

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;
}
export class UploadFileDTO {
  @ApiModelProperty()
  type: string;
}

export class DeleteFileDTO {
  fileId: string;
  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  key: string;
}
//delete imgeKit uploded file
export class ImageKitdDeleteDTO {
  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  fileId: string
}
export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty()
  email: string;
}

export class OTPVerificationDTO {
  @IsNotEmpty()
  @Length(4, 4)
  @ApiModelProperty()
  otp: string;
}

export class PasswordResetDTO {
  @IsNotEmpty()
  @Length(6, 12)
  @ApiModelProperty()
  password: string;
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  @ApiModelProperty()
  currentPassword: string;

  @IsNotEmpty()
  @ApiModelProperty()
  newPassword: string;

  @IsNotEmpty()
  @ApiModelProperty()
  confirmPassword: string;
}

export class DeviceTokenDTO {
  @IsNotEmpty()
  @ApiModelProperty()
  fcmToken: string;
}

export class MobileDTO {
  @IsNotEmpty()
  @ApiModelProperty()
  mobileNumber: string;
}

//deliveryBoy status update model
export class DeliverBoyStatusDTO {
  @IsNotEmpty()
  @ApiModelProperty()
  status: boolean
}

//only for admin
export class ExportedFileDTO {
  @ApiModelProperty()
  exportedFile: object
}
export class PushNotificationDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  title: string
  @ApiModelProperty()
  @IsNotEmpty()
  mssg: String;
  couponecode: string

}
