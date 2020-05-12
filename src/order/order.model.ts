import * as mongoose from 'mongoose';
import {
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional, ValidateNested, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartDTO } from '../cart/cart.model';
import { ApiModelProperty } from '@nestjs/swagger';
import { CardInformationDTO } from '../card-information/card-information.model';

export const OrderSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    subTotal: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    grandTotal: {
        type: Number,
    },
    MerchantRequestID: {
        type: String
    },
    CheckoutRequestID: {
        type: String
    },

    // web or app
    orderBy: {
        type: String,
    },
    deliveryType: {
        type: String,
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    deliveryDate: {
        type: String,
    },
    deliveryTime: {
        type: String,
    },
    pickUpDate: {
        type: Number,
    },
    pickUpTime: {
        type: String,
    },
    deliveryInstruction: {
        type: String,
    },
    deliveryCharges: {
        type: Number,
    },
    locationInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locations',
    },
    paymentType: {
        type: String,
    },
    shouldCallBeforeDelivery: {
        type: Boolean,
    },
    transactionDetails: {
        type: Object,
    },
    orderStatus: {
        type: String,
    },
    orderID: {
        type: Number,
    },
    ratings: {
        type: Array,
    },
    rating: {
        type: Number
    },
    orderAssigned: {
        type: Boolean
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    // for app using
    appTimestamp: {
        type: Number
    },
    isAcceptedByDeliveryBoy: {
        type: Boolean
    },
    loyalty: {
        type: Number
    },
}, { timestamps: true });

export interface TransactionModel {
    paymentMethodId: string,
    transactionId: string;
    transactionStatus: string;
    transactionAmount: number;
    transactionDate: number;
    receiptUrl: string;
    currency: string
}

export enum OrderStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    'Out for delivery' = 'Out for delivery',
    Delivered = 'DELIVERED',
    Cancelled = 'Cancelled',
    'Order Assigned to Delivery Boy' = 'Order Assigned to Delivery Boy'
}

export class AssignOrderDTO {
    orderId: number;
    deliveryBoy: string;
}

export class OrderStatusDTO {
    @IsNotEmpty()
    @IsMongoId()
    @ApiModelProperty()
    orderId: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Enter a valid order status' })
    @ApiModelProperty()
    status: string;
}

export class OrderRatingDTO {
    @IsNotEmpty()
    @IsNumber()
    @ApiModelProperty()
    rating: number;

    // @IsNotEmpty()
    // @IsMongoId()
    // @ApiModelProperty()
    // orderId: string;
}

enum PaymentType {
    COD = 'COD',
    CARD = 'CARD',
    MPESA = 'MPESA'
}

export enum DeliveryType {
    Home_Delivery = 'Home_Delivery',
    Pick_Up = 'Pick_Up'
}

export class OrdersDTO {
    @IsNotEmpty()
    @IsMongoId()
    @ApiModelProperty()
    cart: string | Array<CartDTO>;

    @IsOptional()
    user: string;

    @IsOptional()
    subTotal: number;

    @IsOptional()
    tax: number;

    @IsOptional()
    grandTotal: number;

    @IsEnum(DeliveryType, { message: 'Delivery type should be Home_Delivery or Pick_Up' })
    @ApiModelProperty()
    deliveryType: string;

    @IsOptional()
    @ApiModelProperty()
    deliveryAddress: string;

    deliveryCharges: number;

    @IsOptional()
    @ApiModelProperty()
    locationInfo: string;

    @IsOptional()
    @ApiModelProperty()
    deliveryDate: string;

    @IsOptional()
    @ApiModelProperty()
    deliveryTime: string;

    @IsOptional()
    @ApiModelProperty()
    loyalty: number

    @IsOptional()
    @ApiModelProperty()
    appTimestamp: number;

    @IsOptional()
    @IsNumber()

    @ApiModelProperty()
    pickUpDate: number;

    @IsOptional()
    @ApiModelProperty()
    pickUpTime: string;

    // @IsNotEmpty()
    // @ApiModelProperty()
    deliveryInstruction: string;

    //@IsNotEmpty()
    @ApiModelProperty()
    shouldCallBeforeDelivery: boolean;

    @IsNotEmpty()
    @IsEnum(PaymentType, { message: 'Payment type should be CASH or COD or CARD' })
    @ApiModelProperty()
    paymentType: string;

    @IsOptional()
    @ApiModelProperty()
    cardId: string;

    @IsOptional()
    @ApiModelProperty()
    card?: CardInformationDTO

    @IsOptional()
    @ApiModelProperty()
    orderBy?: string



    @IsOptional()
    transactionDetails: TransactionModel;

    @IsOptional()
    orderStatus: string;

    @IsOptional()
    orderID: number;

    @ApiModelProperty()
    ratings: Array<any>;

    @IsOptional()
    @ApiModelProperty()
    rating: number;

    orderAssigned: boolean;
    assignedTo: string;
    isAcceptedByDeliveryBoy: boolean;
}

export class BuyNowDTO {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CartDTO)
    @ApiModelProperty()
    cart: CartDTO | string;

    @IsOptional()
    user: string;

    @IsOptional()
    subTotal: number;

    @IsOptional()
    tax: number;

    @IsOptional()
    grandTotal: number;

    @IsNotEmpty()
    @IsEnum(DeliveryType, { message: 'Delivery type should be Home_Delivery or Pick_Up' })
    @ApiModelProperty()
    deliveryType: string;

    @IsOptional()
    @IsMongoId()
    @ApiModelProperty()
    deliveryAddress: string;

    deliveryCharges: number;

    @IsOptional()
    @IsMongoId()
    @ApiModelProperty()
    locationInfo: string;

    @IsOptional()
    @ApiModelProperty()
    deliveryDate: string;

    @IsOptional()
    @ApiModelProperty()
    deliveryTime: string;

    @IsOptional()
    @IsNumber()
    @ApiModelProperty()
    pickUpDate: number;

    @IsOptional()
    @ApiModelProperty()
    pickUpTime: string;

    // @IsNotEmpty()
    // @ApiModelProperty()
    // deliveryInstruction: string;

    // @IsNotEmpty()
    // @ApiModelProperty()
    // shouldCallBeforeDelivery: boolean;

    @IsNotEmpty()
    @IsEnum(PaymentType, { message: 'Payment type should be CASH or COD or CARD' })
    @ApiModelProperty()
    paymentType: string;

    @IsOptional()
    @ApiModelProperty()
    cardId: string;

    @IsOptional()
    transactionDetails: TransactionModel;

    @IsOptional()
    orderStatus: string;

    @IsOptional()
    orderID: number;
}

// testing data
export class NewOderModel {
    @ApiModelProperty()
    productName: string;
    @ApiModelProperty()
    price: Number;
}
export class StartEndDTO {
    @ApiModelProperty()
    startDate: Date;
    @ApiModelProperty()
    endDate: Date;
}
export interface XlsxdataModel {
    deliveryType: string,
    paymentType: string
    deliveryAddress: string,
    deliveryDate: string
    deliveryTime: string,
    cart: string,
    deliveryCharges: number,
    subTotal: number,
    tax: number,
    grandTotal: number,
    firstName: string,
    lastName: string,
    email: string,
    mobileNumber: string,
    profilePic: string,
    profilePicId: string,
    orderStatus: string,
    orderID: number
}