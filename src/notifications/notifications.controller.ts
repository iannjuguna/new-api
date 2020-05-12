import { Controller, Get, UseGuards, Post, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonResponseModel } from '../utils/app-service-data';
import { GetUser } from '../utils/user.decorator';
import { UsersDTO } from '../users/users.model';
import { NotificationsService } from './notifications.service';
import { NotificationsModel, NotificationsDTO } from './notifications.model';

@Controller('notifications')

export class NotificationsController {
  constructor(private notificationService: NotificationsService) {

  }

  // sends request to get all notifications of user
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/user/list')
  public getUserBasedNotifications(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
    return this.notificationService.getUserBasedNotifications(user);
  }
  //save notification
  @Post('save/notification')
  public saveNotification(notificationData:NotificationsDTO):Promise<CommonResponseModel>{
    return this.notificationService.createNotication(notificationData)
  }
  //here get all Notification
  @Get('all/notification')
  public showAllNotification():Promise<CommonResponseModel>{
    return this.notificationService.showAllNotification();
  }
 // here getBy id Notification
 @Get('/:id')
 public showByidNotifiaction(@Param('id')id:string):Promise<CommonResponseModel>{
   return this.notificationService.showNotificationById(id);
 }
 //delete Notification
 @Delete('/:id')
 public deleteNotification(@Param('id')id:string):Promise<CommonResponseModel>{
   return this.notificationService.deleteNotification(id);
 }
}
