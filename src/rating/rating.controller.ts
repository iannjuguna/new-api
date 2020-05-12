import { Body, Controller, Post, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { CommonResponseModel } from '../utils/app-service-data';
import { GetUser } from '../utils/user.decorator';
import { UsersDTO } from '../users/users.model';
import { RatingDTO } from './rating.model';

@Controller('rating')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RatingController {
  constructor(private ratingService: RatingService) {

  }

  

  @Post('/rate/product')
  public rateProduct(@GetUser() user: UsersDTO, @Body() ratingData: RatingDTO): Promise<CommonResponseModel> {
    return this.ratingService.saveRating(user, ratingData);
  }
}
