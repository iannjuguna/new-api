import { HttpStatus, Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDTO } from '../users/users.model';
import { AssignOrderDTO, BuyNowDTO, DeliveryType, OrderRatingDTO, OrdersDTO, OrderStatus, OrderStatusDTO, XlsxdataModel } from './order.model';
import { CommonResponseModel, globalConfig } from '../utils/app-service-data';
import { UploadService } from '../upload/upload.service';
import { CardInformationDTO } from '../card-information/card-information.model';
import { CartDataModel, CartDTO } from '../cart/cart.model';
import * as uuid from 'uuid/v1';
import { NotificationsModel } from '../notifications/notifications.model';
import { CartService } from '../cart/cart.service';
import { ProductsDTO } from '../products/products.model';
import { NewOderModel, StartEndDTO } from './order.model';
import { AppGateway } from '../app.gateway';
const _ = require('lodash');
var appRoot = require('app-root-path');
const GeneralService = require('../utils/general-service');
var json2xls = require('json2xls');
var fs = require('fs');
// console.log("STRIPE_SECRET_KEY",process.env.STRIPE_SECRET_KEY);
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


@Injectable()
export class OrderService {
    private monthList: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(@InjectModel('Orders') private readonly orderModel: Model<any>,
        @InjectModel('Cart') private readonly cartModel: Model<any>,
        private utilsService: UploadService,
        @InjectModel('Cards') private readonly cardModel: Model<any>,
        @InjectModel('Notifications') private readonly notificationModel: Model<any>,
        private cartService: CartService, @InjectModel('Products') private readonly productModel: Model<any>,
        @InjectModel('Users') private readonly userModel: Model<any>,
        @InjectModel('Business') private readonly businessModel: Model<any>,
        @InjectModel('Rating') private readonly ratingModel: Model<any>,
        @InjectModel('Categories') private readonly categoryModel: Model<any>,
        @InjectModel('Setting') private readonly settingModel: Model<any>,
        private socketService: AppGateway,
        private readonly httpServise: HttpService,
        // private appService: AppService
        //private socketService: AppGateway
    ) {

    }

    // get's order list by pagination
    public async getOrderList(page: number, limit: number): Promise<CommonResponseModel> {
        const orders = await this.orderModel.find({}).limit(limit).skip((page * limit) - limit).populate('user', '-password -salt').populate('cart').populate('deliveryAddress');
        const totalOrders = await this.orderModel.countDocuments();
        return { response_code: HttpStatus.OK, response_data: { orders, totalOrders } };
    }

    // returns order's details
    public async getOrderDetails(orderId: string): Promise<CommonResponseModel> {
        const orderInfo = await this.orderModel.findById(orderId).populate('cart').populate('product').populate('deliveryAddress').populate('user').populate('assignedTo');
        return { response_code: HttpStatus.OK, response_data: orderInfo };
    }

    //Get all list of oder
    public async findAllOderList(): Promise<CommonResponseModel> {
        const res = await this.orderModel.find({}).sort('-createdAt').populate('cart').populate('product').populate('deliveryAddress').populate('user').populate('assignedTo');
        return {
            response_code: HttpStatus.OK,
            response_data: res
        };
    }

    // returns user orders by status
    public async getOrderByStatus(user: UsersDTO, status: string): Promise<CommonResponseModel> {
        if (user.role !== 'User') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        }
        if (!OrderStatus[status]) {
            return { response_code: HttpStatus.BAD_REQUEST, response_data: `${status} is not a valid order status.` };
        }
        const orders = await this.orderModel.find({ user: user._id, orderStatus: status }).populate('cart');
        return { response_code: HttpStatus.OK, response_data: orders };
    }
    //update rating of only order 
    public async giveratingOfOrder(orderData: OrderRatingDTO, orderId: string): Promise<CommonResponseModel> {
        const resData = await this.orderModel.findByIdAndUpdate(orderId, orderData);
        return {
            response_code: HttpStatus.OK,
            response_data: { messsge: 'ThanK You for rating' }
        };
    }
    public async verify(cart, products): Promise<any> {
        let cartArr = [], productArr = []
        for (let cartItem of cart.cart) {
            const productIndex = await products.findIndex(val => val._id.toString() == cartItem.productId.toString());
            if (productIndex === -1) {

            } else {
                if (products[productIndex].variant.length) {
                    if (products[productIndex].status == 0) {
                        console.log("INSIDE PRODUCT UNAVAILABLE", products[productIndex].title)
                        cartArr.push(cartItem)
                    } else {
                        const varientIndex = await products[productIndex].variant.findIndex(val => val.unit == cartItem.unit);
                        if (varientIndex === -1) {

                        } else {
                            if (products[productIndex].variant[varientIndex].enable && products[productIndex].variant[varientIndex].productstock < cartItem.quantity) {
                                console.log("INSIDE OUT OFF STOCK", products[productIndex].title)
                                cartArr.push(cartItem)

                            } else {
                                products[productIndex].variant[varientIndex].productstock = products[productIndex].variant[varientIndex].productstock - cartItem.quantity;
                                productArr.push(products[productIndex])
                            }
                        }
                    }
                } else {

                }
            }
        }
        return { cartArr, productArr }
    }

    public async cartVerify(user: UsersDTO, order: OrdersDTO): Promise<CommonResponseModel> {
        try {
            console.log("order", JSON.stringify(order));
            if (user.role !== 'User') {
                return {
                    response_code: HttpStatus.UNAUTHORIZED,
                    response_data: 'Sorry !!, you are not allowed to access this api',
                };
            } else {
                if (order.paymentType === 'CARD' && !order.transactionDetails) {
                    return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Please send the payment information' };
                } if (order.deliveryType === DeliveryType.Home_Delivery) {
                    if (!order.deliveryDate) {
                        return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Please provide order delivery date' };
                    } else if (!order.deliveryTime) {
                        return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Please provide order delivery time' };
                    }
                }
                const cartInfo = await this.cartModel.findById(order.cart) as CartDataModel;
                if (cartInfo.isOrderLinked) {
                    return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Order is already placed for this cart items' };
                }
                let products, cartVerifyData;
                if (cartInfo && cartInfo.products) {
                    products = await this.productModel.find({ _id: { $in: cartInfo.products } });
                    cartVerifyData = await this.verify(cartInfo, products);
                    if (cartVerifyData && cartVerifyData.cartArr.length) {
                        return { response_code: 403, response_data: { cartVerifyData, message: "Out off stock" } }
                    }
                }
                order.deliveryCharges = cartInfo.deliveryCharges;
                order.subTotal = cartInfo.subTotal;
                order.tax = cartInfo.tax;
                order.appTimestamp = Date.now();
                order.grandTotal = cartInfo.grandTotal;
                order.user = user._id;
                order.orderStatus = 'Pending';
                const randomNumber = Math.floor(900000 * Math.random()) + 100000;
                order.orderID = randomNumber;
                if (order.paymentType === 'CARD') {
                    let setting = await this.settingModel.findOne({}, 'currencyName');
                    let total = order.grandTotal * 100;
                    if (order.orderBy == "web app") {
                        const charge = await stripe.charges.create({
                            amount: total,
                            currency: setting && setting.currencyName ? setting.currencyName : "USD",
                            description: 'Payment by web app',
                            source: order.transactionDetails.paymentMethodId,
                        });
                        if (charge && charge.status == "succeeded") {
                            order.transactionDetails.transactionStatus = charge.status;
                            order.transactionDetails.receiptUrl = charge.receipt_url;
                            order.transactionDetails.transactionId = charge.id;
                            order.transactionDetails.currency = charge.currency;
                            console.log("transactionDetails web app", JSON.stringify(order.transactionDetails))
                        } else {
                            console.log("FIRST console")
                            return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong with payment" };
                        }
                    } else {
                        let paymentIntent = await stripe.paymentIntents.create({
                            amount: total,
                            currency: setting && setting.currencyName ? setting.currencyName : "USD",
                            payment_method: order.transactionDetails.paymentMethodId,
                            capture_method: "manual",
                            confirm: true
                        });
                        console.log("paymentIntent......................")
                        if (paymentIntent && paymentIntent.id && paymentIntent.status == "requires_capture") {
                            console.log("INSIDE ...CAPTURE............", JSON.stringify(paymentIntent.id))
                            let capturedPay = await stripe.paymentIntents.capture(paymentIntent.id, { amount_to_capture: total });
                            if (capturedPay && capturedPay.status == "succeeded") {
                                order.transactionDetails.transactionStatus = capturedPay.status;
                                order.transactionDetails.receiptUrl = capturedPay.charges.data[0].receipt_url;
                                order.transactionDetails.transactionId = capturedPay.charges.data[0].id;
                                order.transactionDetails.currency = capturedPay.currency;
                                console.log("transactionDetails", JSON.stringify(order.transactionDetails))
                            } else {
                                console.log("FIRST console")
                                return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong with payment" };
                            }
                        } else {
                            return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong with payment" };
                        }
                    }
                } else {
                    order.transactionDetails = null;
                }
                const orderRes = await this.orderModel.create(order);
                if (orderRes) {
                    if (cartVerifyData && cartVerifyData.productArr.length) {
                        for (let prods of cartVerifyData.productArr) {
                            await this.productModel.findByIdAndUpdate(prods._id, prods, { new: true })
                        }
                    }
                    const userData = await this.userModel.findById(order.user);
                    const notificationData: NotificationsModel = { title: 'Order Confirmation', ORDERID: orderRes.orderID, description: 'You have successfully placed the order. Thank you for shopping.', user: user._id, order: orderRes._id };
                    const notificationRes = await this.notificationModel.create(notificationData);
                    this.socketService.sendNewOrderNotification({ _id: notificationRes._id, order: notificationRes.order, ORDERID: notificationRes.ORDERID });
                    await this.cartModel.findByIdAndUpdate(order.cart, { isOrderLinked: true, grandTotal: order.grandTotal, deliveryCharges: order.deliveryCharges });
                    if (userData.playerId) {
                        console.log('Push notification...');
                        var msgg = `Thank you for Your Order. Awaiting confirmation from the store.`;
                        var title = 'New order';
                        GeneralService.orderPushNotification(userData.playerId, msgg, title);
                    }
                }
                return { response_code: HttpStatus.CREATED, response_data: 'Order placed successfully' };

            }
        } catch (e) {
            console.log(e)
            return { response_code: HttpStatus.BAD_REQUEST, response_data: e.message };
        }
    }

    // updates status by Admin
    public async updateOrderStatusByAdmin(user: UsersDTO, orderData: OrderStatusDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return { response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api' };
        } else {
            const orderInfo = await this.orderModel.findById(orderData.orderId, '').populate('deliveryAddress', 'address').populate('user', 'firstName email mobileNumber playerId').populate('cart', 'cart');
            if (orderInfo) {
                orderInfo.orderStatus = orderData.status;
                const orderRes = await this.orderModel.findByIdAndUpdate(orderData.orderId, { orderStatus: orderInfo.orderStatus });
                const data: any = {
                    title: 'Order status updated',
                    description: `Your order is ${orderData.status}`,
                };
                if (orderInfo.user) {
                    // send Invoice
                    if (orderInfo.orderStatus == 'DELIVERED') {
                        this.sendInvoice(orderInfo).then(function (data) { console.log("LAST CALL BACK") })
                    }
                    //push notificatin one signal
                    if (orderInfo.user['playerId']) {
                        console.log('new Notification=======updater after dashBord');
                        var msgg = `Order is Accepted by store :slightly_smiling_face:.`;//Your order  ${orderData.status}
                        var title = 'Order Status';
                        await GeneralService.orderPushNotification(orderInfo.user['playerId'], msgg, title);
                    }
                }
                return { response_code: HttpStatus.OK, response_data: 'Order updated successfully' };
            } else {
                return { response_code: HttpStatus.BAD_REQUEST, response_data: 'No such order exist' };
            }
        }
    }


    // get's tax related information
    public async getTaxRelatedInformation(/*user: UsersDTO, */cartInfo: CartDTO): Promise<CommonResponseModel> {
        // console.log("cartInfoDatAAAAA",cartInfo);
        // if (user.role !== 'User') {
        //   return { response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api' };
        // }
        const productInfo = await this.productModel.findById(cartInfo.productId) as ProductsDTO;
        console.log('Productinfooo', productInfo);
        const adminSettings = await this.userModel.findOne({ role: 'Admin' });
        //const subTotal = productInfo.price * cartInfo.quantity;
        const subTotal = cartInfo.price * cartInfo.quantity;
        console.log('SubTotalAAAAAA', subTotal);
        const tax = adminSettings.tax ? Number((subTotal * (adminSettings.tax / 100)).toFixed(2)) : 0;
        let taxRelatedInfo = {
            subTotal,
            tax,
            deliveryCharges: globalConfig.deliveryCharges,
            grandTotal: subTotal + tax + globalConfig.deliveryCharges,
        };
        console.log('taxRelatedInfoAAAAAAAAA', taxRelatedInfo);
        return { response_code: HttpStatus.OK, response_data: taxRelatedInfo };
    }

    // sends notifications
    public sendNotification(token: string, body: NotificationsModel): Promise<CommonResponseModel> {
        return this.utilsService.sendNotification(token, body);
    }

    //save oder dta cheaking for SOCKET.IO data
    public async saveOderData(orderdDATA: NewOderModel): Promise<CommonResponseModel> {
        console.log(orderdDATA);
        const re = await this.orderModel.create(orderdDATA);
        console.log('thisss');
        // this.appgateway.server.emit('msgToClient', re);
        return {
            response_code: HttpStatus.OK,
            response_data: 'created successfully'
        };
    }

    // get Mobile History order
    public async orderOnMobileUserHitory(userID: string): Promise<CommonResponseModel> {
        const res = await this.orderModel.find({ user: userID }).sort('-createdAt').populate('cart');
        return {
            response_code: HttpStatus.OK,
            response_data: res
        };
    }

    //all oder record
    public async allOderrecord(): Promise<CommonResponseModel> {
        const ressult = await this.orderModel.aggregate(
            [
                { $match: { orderStatus: 'DELIVERED' } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            date: { $dayOfMonth: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
            ],
            function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    let dateArr = [],
                        countArr = [];
                    result.forEach(function (data) {
                        if (data._id && data._id.year) {
                            dateArr.push(
                                data._id.date + '/' + data._id.month + '/' + data._id.year,
                            );
                            countArr.push(data.total);
                        }
                    });
                }
            },
        );
        return {
            response_code: HttpStatus.OK,
            response_data: ressult,
        };
    }

    // get's graph data
    public async getOrderEarnings(): Promise<CommonResponseModel> {
        try {
            let date = new Date();
            let thisMidnight = date.setHours(0, 0, 0, 0);
            let lastSevenDaysMidnight = thisMidnight - 6 * 24 * 60 * 60 * 1000;
            let lastsSevenDaysMidnight = new Date(lastSevenDaysMidnight);
            const ressult = await this.orderModel.aggregate([
                { $match: { orderStatus: 'DELIVERED', createdAt: { $gt: lastsSevenDaysMidnight, $lt: new Date() } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            date: { $dayOfMonth: '$createdAt' }
                        },
                        data: { $sum: '$grandTotal' }
                    }
                }
            ]);

            const res = await GeneralService.graphDataModification(new Date(), ressult);
            let graphData = {
                'barData': {
                    'labels': res.dateArr,
                    'datasets': [{
                        'data': res.totalArr
                    }]
                }
            };
            const orderCounTotal = await this.orderModel.aggregate([
                { $match: { orderStatus: 'DELIVERED' } },
                { $group: { _id: {}, data: { $sum: '$grandTotal' }, count: { $sum: 1 } } }
            ]);
            let totalOrders = 0, totalEarnings = 0;
            if (orderCounTotal && orderCounTotal.length) {
                totalOrders = orderCounTotal[0].count;
                totalEarnings = orderCounTotal[0].data;
            }
            const totalProducts: number = await this.productModel.countDocuments();
            const totalCategories: number = await this.categoryModel.countDocuments();
            return { response_code: HttpStatus.OK, response_data: { graphData, counts: { totalProducts, totalCategories, totalOrders, totalEarnings } } };
        } catch (e) {
            return { response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not fetch graph data' };
        }
    }

    // assigns order to a delivery boy
    public async assignOrder(user: UsersDTO, data: AssignOrderDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return { response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not authorized to access this api' };
        }
        const orderInfo: OrdersDTO = await this.orderModel.findById(data.orderId);
        if (orderInfo) {
            orderInfo.orderAssigned = true;
            orderInfo.isAcceptedByDeliveryBoy = false;
            orderInfo.assignedTo = data.deliveryBoy;
            try {
                const res = await this.orderModel.findByIdAndUpdate(data.orderId, orderInfo);
                const orderData = await this.orderModel.findById(data.orderId).populate('cart').populate('product').populate('deliveryAddress').populate('user');
                this.socketService.emitAssignedOrders(data.deliveryBoy, orderData);
                if (orderInfo.user['playerId']) {
                    console.log("new Notification========= for Delivery BoY")
                    var msgg = `you have  ${orderData.status} and order ID is${orderInfo.orderID}`;
                    var title = "Order Assigned";
                    await GeneralService.orderPushNotification(orderInfo.user['playerId'], msgg, title);
                }
                return { response_code: HttpStatus.OK, response_data: 'Order assigned successfully' };
            } catch (e) {
                return { response_code: HttpStatus.BAD_REQUEST, response_data: 'could not assign the order' };
            }
        }
    }
    public async  pageCreation(count) {
        let limit = 2, arr = [];
        let noOfPage = Math.ceil(count / limit);
        for (let i = 1; i <= noOfPage; i++) {
            let p = (Number(i) - 1) * limit;
            arr.push({ skip: p, limit: limit })
        }
        return arr
    }
    // json to xls and upload
    async jsonToXls(json, fileName) {
        var xls = json2xls(json);
        await fs.writeFileSync(fileName, xls, 'binary');
        let path = appRoot.path + "/" + fileName;
        console.log("FOLDER PATH AFTER WRITE", path);
        let base64 = await fs.readFileSync(path, { encoding: 'base64' });
        let uploadRes = await this.utilsService.xlsUploadToImageKit(base64, fileName);
        await fs.unlinkSync(path);
        console.log("XLS FILE UPLOADED", JSON.stringify(uploadRes))
        return uploadRes
    }
    // data Manupulation
    public async dataManupulation(data) {
        let newArr = [];
        for (let item of data) {
            let obj = {
                ORDER_ID: item.orderID,
                NAME: item.user ? item.user.firstName : null,
                EMAIL: item.user ? item.user.email : null,
                ORDER_STATUS: item.orderStatus,
                DELIVERY_TYPE: item.deliveryType,
                PAYMENT_TYPE: item.paymentType,
                TOTAL_ITEM: item.cart ? item.cart.products.length : null,
                DELIVERY_DATE: item.deliveryDate,
                SUB_TOTAL: item.subTotal,
                TAX: item.tax,
                DELIVERY_CHARGES: item.deliveryCharges,
                GRAND_TOTAL: item.grandTotal,
                DELIVERED_BY: item.assignedTo ? item.assignedTo.firstName : null
            }
            newArr.push(obj)
        }
        return newArr;
    }
    // data fetch
    public async dataFetch(pageArr, query) {
        let mergeArr = [];
        for (let item of pageArr) {
            const data = await this.orderModel.find(query, 'orderStatus orderID deliveryType paymentType deliveryDate subTotal tax deliveryCharges grandTotal').populate('user', 'firstName email').populate('cart', 'products').populate('assignedTo', 'firstName').skip(Number(item.skip)).limit(Number(item.limit)).sort("-createdAt");
            console.log("ORDER DATA FETCH ONE BY ONE", JSON.stringify(data.length))
            mergeArr.push(...data)
        }
        let formateData = await this.dataManupulation(mergeArr)
        let fileName = "order_data_export.xlsx"
        let fileRes = await this.jsonToXls(formateData, fileName)
        let obj = { url: fileRes.url, status: "Completed", publicId: fileRes.key }
        await this.userModel.findOneAndUpdate({ role: "Admin" }, { exportedFile: obj }, { new: true });
        return true;
    }
    // data export
    public async orderExport(user: UsersDTO, startEndDTO: StartEndDTO): Promise<CommonResponseModel> {
        console.log(JSON.stringify(startEndDTO))
        let startDate = new Date(startEndDTO.startDate);
        let endDate = new Date(startEndDTO.endDate);
        startDate.setHours(0, 0, 0, 999)
        endDate.setHours(23, 59, 59, 999)
        console.log("startDate", startDate)
        console.log("endDate", endDate)

        if (user.role !== 'Admin') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            let query = { createdAt: { $gt: startDate, $lt: endDate } };
            const count = await this.orderModel.countDocuments(query);
            let pageArr = await this.pageCreation(count)
            if (pageArr && pageArr.length) {
                this.dataFetch(pageArr, query).then(function (d) { console.log("Data fetched") })
            }
            let obj = { url: null, status: "Processing", publicId: null }
            await this.userModel.findOneAndUpdate({ role: "Admin" }, { exportedFile: obj }, { new: true });
            console.log("brfore res")
            return {
                response_code: HttpStatus.OK,
                response_data: obj
            }
        }
    }
    // data export
    public async getExportFile(user: UsersDTO, ): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            const user = await this.userModel.findOne({ role: "Admin" }, 'exportedFile');
            return {
                response_code: HttpStatus.OK,
                response_data: user
            }
        }

    }
    public async orderExportDelete(user: UsersDTO, deleteKey: string): Promise<CommonResponseModel> {
        console.log(StartEndDTO)
        if (user.role !== 'Admin') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'Sorry !!, you are not allowed to access this api',
            };
        } else {
            await this.utilsService.deleteUplodedFile(deleteKey)
            let obj = { url: null, status: "Pending", publicId: null }
            await this.userModel.findOneAndUpdate({ role: "Admin" }, { exportedFile: obj }, { new: true });
            return {
                response_code: HttpStatus.OK,
                response_data: obj
            }
        }
    }
    // invoice download
    public async invoiceDownload(res, id): Promise<CommonResponseModel> {
        const order = await this.orderModel.findById(id).populate('deliveryAddress', 'address').populate('user', 'firstName email mobileNumber').populate('cart', 'cart');
        const businessInfo = await this.businessModel.findOne({}, 'address email phoneNumber storeName webApp');
        return res.sendFile(await this.utilsService.invoicePdfGenerate(order, businessInfo));
    }
    // send invoice and mail
    public async sendInvoice(order): Promise<CommonResponseModel> {
        //let id="5e99915e90d5ea4d672224ea";
        //const order=await this.orderModel.findById(id).populate('deliveryAddress','address').populate('user','firstName email mobileNumber').populate('cart','cart');
        const businessInfo = await this.businessModel.findOne({}, 'address email phoneNumber storeName webApp');
        let res = await this.utilsService.sendOrderMail(order, businessInfo)
        return {
            response_code: HttpStatus.OK,
            response_data: res
        }
    }
    // test 
    public async notificationTest(): Promise<CommonResponseModel> {
        const OneSignal = require('onesignal-node');
        const client = new OneSignal.Client('a76b6867-bf12-440f-8bc2-30946c652af8', 'NDA2Mzc0NzAtM2QwNy00MTE2LWEyNzUtOTkyZDM2NzU5N2I5', { apiRoot: 'https://onesignal.com/api/v2' });
        console.log("brfore res")
        const notification = {
            contents: {
                'tr': 'Yeni bildirim',
                'en': 'New notification',
            },
            included_segments: ["Active Users"],
            filters: [
                //{ field: 'tag', key: 'level', relation: '>', value: 10 }
            ]
        };

        // using async/await
        try {
            const response = await client.createNotification(notification);
            console.log(response);
            return {
                response_code: HttpStatus.OK,
                response_data: response
            }
        } catch (e) {
            console.log(JSON.stringify(e))
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    }

    //webhook from mpesa to update payment status in db
    public async webhookM(payload: any): Promise<CommonResponseModel> {
        console.log("payload", payload)
        console.log("payload.Body.stkCallback", payload.Body.stkCallback);
        payload.Body.stkCallback = JSON.stringify(payload.Body.stkCallback);
        let obj = JSON.parse(payload.Body.stkCallback);

        console.log("obj===", obj)
        console.log("MERCHANTREQUESTID", obj.MerchantRequestID)
        console.log("CheckoutRequestID", obj.CheckoutRequestID)
        if (obj && obj.MerchantRequestID && obj.CheckoutRequestID) {

            console.log("obj", obj);
            console.log("obj.MerchantRequestID", obj.MerchantRequestID);
            console.log("obj.CheckoutRequestID", obj.CheckoutRequestID);


            let order = await this.orderModel.findOne({ MerchantRequestID: obj.MerchantRequestID, CheckoutRequestID: obj.CheckoutRequestID });
            if (order) {
                console.log("obj.ResultCode", obj.ResultCode);
                if (obj.ResultCode === 0) {

                    order.transactionDetails = { transactionStatus: "Success" };
                } else {
                    order.transactionDetails = { transactionStatus: "Failed" };
                }
                await order.save();
                return {
                    response_code: HttpStatus.OK,
                    response_data: { messsge: 'Success' }
                };
            } else {
                return {
                    response_code: HttpStatus.OK,
                    response_data: { messsge: 'Fail' }
                };
            }

        } else {
            return {
                response_code: HttpStatus.OK,
                response_data: { messsge: 'Fail' }
            };
        }
    }
}


