import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Res, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../utils/user.decorator';
import { UsersDTO } from '../users/users.model';
import { BuyNowDTO, OrderRatingDTO, OrdersDTO, OrderStatusDTO, NewOderModel, AssignOrderDTO, StartEndDTO } from './order.model';
import { CommonResponseModel } from '../utils/app-service-data';
import { CartDTO } from '../cart/cart.model';

@Controller('orders')

export class OrderController {
    constructor(private orderService: OrderService) {

    }

    // sends request to get order details
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/info/:orderId')
    public getOrderDetails(@Param('orderId') orderId: string) {
        return this.orderService.getOrderDetails(orderId);
    }

    // sends request to get all ratings of order
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/ratings/:orderId')
    public getOrderRatings(@Body() orderData: OrderRatingDTO, @Param('orderId') orderId: string): Promise<CommonResponseModel> {
        return this.orderService.giveratingOfOrder(orderData, orderId);
    }

    // get all oder List
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('all/oder/list')
    public getAllOderList(): Promise<CommonResponseModel> {
        return this.orderService.findAllOderList();
    }

    // sends request to get orders by pagination
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get(':page/:limit')
    public getOrderByPagination(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.orderService.getOrderList(parseInt(page), parseInt(limit));
    }

    // sends request to get order's by status
    @Get('/by/status/:status')
    public getOrderByStatus(@GetUser() user: UsersDTO, @Param('status') status: string): Promise<CommonResponseModel> {
        return this.orderService.getOrderByStatus(user, status);
    }

    @Post('/send/notification')
    public async sendNotification() {
        const token = 'eCNT4HJAQNM:APA91bGsNsaRzbhtAe9c140K5hekhKtzoBeF7q8s5xGpUl-3bUoZNwVZwvZfe8TpM7LVptu575mghUiGaYlsza7qj9cUSoPXmdF1r_jUF6ySCsYvqUWYh4eMClPiJB1IdVzlFcFXaaRJ';
        const data: any = {
            title: 'Order status updated',
            description: `Your order is accepted`,
        };
        const check = await this.orderService.sendNotification(token, data);
        console.log('NotiFFFFFFFFFFFFffffffffDATTTTTTTT', check);
    }

    // sends request to save order
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/place/order')
    public placeOrder(@GetUser() user: UsersDTO, @Body() orderData: OrdersDTO) {
        return this.orderService.cartVerify(user, orderData);
    }




    // sends request to get tax related information
    @Post('/get/tax/info')
    public getTaxRelatedInfo(/*@GetUser() user: UsersDTO,*/ @Body() cart: CartDTO): Promise<CommonResponseModel> {
        return this.orderService.getTaxRelatedInformation(/*user, */cart);
    }


    // sends request to update order status
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Patch('/update/status/ByAdmin')
    public updateOrderStatus(@GetUser() user: UsersDTO, @Body() orderData: OrderStatusDTO): Promise<CommonResponseModel> {
        return this.orderService.updateOrderStatusByAdmin(user, orderData);
    }

    //graph for oders
    @Get('/graph')
    public oderGraph(): Promise<CommonResponseModel> {
        return this.orderService.getOrderEarnings();
    }

    //dummy API for SOCKET.IO checking
    @Post('/dumy/api/oder')
    public createOderByAm(@Body() orderdDATA: NewOderModel): Promise<CommonResponseModel> {
        return this.orderService.saveOderData(orderdDATA);
    }



    //mobile order Hister
    @Get('history/of/user/mobile/data/:userID')
    public orderHistery(@Param('userID') userID: string): Promise<CommonResponseModel> {
        return this.orderService.orderOnMobileUserHitory(userID);
    }

    // all order recoder graph
    @Get('all/record/graph')
    public allOrderRecord(): Promise<CommonResponseModel> {
        return this.orderService.allOderrecord();
    }

    // assigns the order to a delivery boy
    @Post('/assign/order')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public assignOrder(@GetUser() user: UsersDTO, @Body() assignData: AssignOrderDTO): Promise<CommonResponseModel> {
        return this.orderService.assignOrder(user, assignData);
    }
    //here admin enter the start date and end date and get all data
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('/export')
    public orderExport(@GetUser() user: UsersDTO, @Body() startEndDTO: StartEndDTO): Promise<CommonResponseModel> {
        return this.orderService.orderExport(user, startEndDTO);
    }
    // get exported file
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/export/file/download')
    public getExportFile(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.orderService.getExportFile(user);
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('/export/file/delete/:deleteKey')
    public orderExportDelete(@GetUser() user: UsersDTO, @Param('deleteKey') deleteKey: string): Promise<CommonResponseModel> {
        return this.orderService.orderExportDelete(user, deleteKey);
    }
    // get exported file
    @Get('/invoic/pdf/download/:id')
    public async invoiceDownload(@Res() res, @Param('id') id: string) {
        return this.orderService.invoiceDownload(res, id)
    }

    //webhook from mpesa to update payment status in db
    @Post('/webhook/mpesa')
    public webhookMpesa(@Body() payload: any) {
        return this.orderService.webhookM(payload);
    }
    // @Get('/test/test/test/test')
    // public async test(){
    //     return this.orderService.sendInvoice()
    // }


}
