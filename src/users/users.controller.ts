import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Headers,
    Req,
    Param,
    Put,
    Patch,
    HttpStatus,
    Res, Delete,
} from '@nestjs/common';
import * as path from 'path';
import {
    UsersDTO,
    CredentialsDTO,
    ChangePasswordDTO,
    VerifyEmailDTO,
    OTPVerificationDTO,
    PasswordResetDTO,
    UsersUpdateDTO, DeviceTokenDTO, MobileDTO, CredentialsMobileDTO, DeliverBoyStatusDTO, PushNotificationDTO, 
} from './users.model';
import {UsersService} from './users.service';
import {ApiBearerAuth} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {CommonResponseModel} from '../utils/app-service-data';
import {GetUser} from '../utils/user.decorator';
import {LocationDTO} from '../address/address.model';
import {identity} from 'rxjs';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {

    }

    // sends request to get all delivery boys list
    @Get('/delivery/boys/list')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getAllDeliveryBodyList(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.userService.getAllDeliveryBoys(user);
    }

    // sends request to get user's information
    @Get('/me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getUserInformation(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.userService.getUserInformation(user._id);
    }

    // sends request to get delivery boys list
    @Get('/delivery/boys/:page/:limit')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getDeliveryBoysList(@GetUser() user, @Param('page') pageNumber: number, @Param('limit') pageLimit: number): Promise<CommonResponseModel> {
        return this.userService.getDeliveryBoyList(user, Number(pageLimit), Number(pageNumber));
    }

    // sends request to get list of users
    @Get('/list/:page/:limit')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getUsersList(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.userService.getListOfUsers(Number(page), Number(limit));
    }

    // sends request to get admin's settings
    @Get('/delivery/information')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getAdminSettings(): Promise<CommonResponseModel> {
        return this.userService.getAdminSettings();
    }

    // sends request to verify user email
    @Get('/verify/email/:verificationId')
    public async verifyUserAccount(@Param('verificationId') verificationId: string, @Res() res) {
        const response = await this.userService.verifyEmail(verificationId);
        if (response.response_code === 200) {
            res.sendFile(path.resolve('src/templates/success.html'));
        } else {
            res.sendFile(path.resolve('src/templates/error.html'));
        }
    }

    // sends request to verify token
    @Get('/verify/token')
    public async verifyToken(@Headers() headers, @Res() res) {
        this.userService.verifyToken(headers.authorization).then(data => {
            res.status(HttpStatus.OK).json({
                response_code: 200, response_data: {tokenVerify: true}
            });
        }).catch(error => {
            res.status(HttpStatus.UNAUTHORIZED).json({
                response_code: 200, response_data: {tokenVerify: false}
            });
        });
    }

    // sends request to register new user
    @Post('/register')
    public registerNewUser(@Body() userData: UsersDTO): Promise<CommonResponseModel> {
        return this.userService.registerNewUser(userData);
    }

    // sends request to validate user's credentials
    @Post('/login')
    public validateUser(@Body() credentials: CredentialsDTO): Promise<CommonResponseModel> {
        return this.userService.validateUserCredentials(credentials);
    }

    //login with mobile Number
    @Post('/with/mobile')
    public async loginWithMobileNo(@Body() credentials: CredentialsMobileDTO): Promise<CommonResponseModel> {
        return this.userService.LoginWithMobileNumber(credentials);
    }

    // sends request to change password
    @Post('/change-password')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public changePassword(@GetUser() user: UsersDTO, @Body() passwordData: ChangePasswordDTO): Promise<CommonResponseModel> {
        return this.userService.changePassword(user, passwordData);
    }

    // sends request to reset password
    @Post('/verify/email')
    public verifiesUsersEmail(@Body() emailData: VerifyEmailDTO): Promise<CommonResponseModel> {
        return this.userService.validateEmail(emailData.email);
    }

    // sends request to verify OTP
    @Post('/verify/OTP')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public verifyOTP(@GetUser() user: UsersDTO, @Body() otp: OTPVerificationDTO): Promise<CommonResponseModel> {
        return this.userService.verifyOTP(user._id, Number(otp.otp));
    }

    // sends request to reset password
    @Post('/reset-password')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public resetPassword(@GetUser() user: UsersDTO, @Body() passwordData: PasswordResetDTO): Promise<CommonResponseModel> {
        return this.userService.resetPassword(user._id, passwordData);
    }

    // sends request to set device token
    @Post('/set/device/token')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public setDeviceToken(@GetUser() user: UsersDTO, @Body() fcmData: DeviceTokenDTO): Promise<CommonResponseModel> {
        return this.userService.setDeviceToken(user, fcmData);
    }

    // sends request to update profile
    @Patch('/update/profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public updateProfile(@GetUser() user: UsersDTO, @Body() userInfo: UsersUpdateDTO): Promise<CommonResponseModel> {
        return this.userService.updateUserInfo(user._id, userInfo);
    }

    // send's request to get user's distance from shop
    @Post('/get/shop/distance')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public getUserDistanceFromShop(@GetUser() user: UsersDTO, @Body() location: LocationDTO): Promise<CommonResponseModel> {
        return this.userService.getUserDistanceFromShop(user, location);
    }

    //get All usera list
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('all/user/list')
    public getAllUserList(): Promise<CommonResponseModel> {
        return this.userService.getAlluserList();
    }

    //get Admin infomation
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/admin/infomation')
    public getAdminInfomation(): Promise<CommonResponseModel> {
        return this.userService.getAdminInfomation();
    }

    //Get byID of users list
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('getbyId/:id')
    public getByIDUser(@Param('id')id: string): Promise<CommonResponseModel> {
        return this.userService.findUserById(id);
    }

    //count user data for graph ploting
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('count/user')
    public getCountuser(): Promise<CommonResponseModel> {
        return this.userService.getUserCount();
    }

    //user Registration Record Data
    @Get('all/record/data/registration')
    public userRecordgraphdata(): Promise<CommonResponseModel> {
        return this.userService.userRegistrationRecord();
    }

//singUp with mobile number
    @Post('registration/mobile')
    public singhUpWithMobileNumber(@Body() userData: UsersDTO): Promise<CommonResponseModel> {
        return this.userService.userSinghWithMobileNumber(userData);
    }

//veify OTP Of Mobile Number
    @Post('/mobile/OTP')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public verifyOTPofMobileNo(@GetUser() user: UsersDTO, @Body() otp: OTPVerificationDTO): Promise<CommonResponseModel> {
        return this.userService.verifyOTP(user._id, Number(otp.otp));
    }

//find the FCM token from DB
    @Post('/send/pushnotification/all')
    public sendPushNotificationtToAlluser(@Body() data:PushNotificationDTO): Promise<CommonResponseModel> {
        return this.userService.pushNotificatioalToAllusers(data);
    }

    // Admin create Role Like Delivery Boy
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/create/delivery-boy')
    public createNewRoleByAdmin(@Body() userData: UsersDTO): Promise<CommonResponseModel> {
        return this.userService.adminCreateNewRole(userData);
    }

    // deletes the delivery boy
    @Delete('/delete/delivery/body/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public deleteDeliveryBoy(@GetUser() user: UsersDTO, @Param('id') id: string): Promise<CommonResponseModel> {
        return this.userService.deleteDeliveryBody(user, id);
    }

    // update status like enble and disable
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/deliveryboy/status/update/:id')
    public updatEableandDisable(@Param('id')id:string,@Body() data:DeliverBoyStatusDTO):Promise<CommonResponseModel>{
        return this.userService.updateDeliveryBoyStatus(id,data)
    }
    //get by id DeliveryBoy
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/get/deliveryBoy/:id')
    public findByIddeliveryBoy(@Param('id')id:string):Promise<CommonResponseModel>{
        return this.userService.getByIdDeliveryBoy(id);
    }
    // update delivery boy infomation by admin
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('infonation/update/by/Admin/:id')
    public updateStatusByAdnindeliveryBoy(@Param('id')id:string,user: UsersDTO):Promise<CommonResponseModel>{
      return this.userService.updateinfomationByAdmin(id,user)
    }
}
