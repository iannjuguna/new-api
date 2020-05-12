import {Injectable, HttpStatus, HttpService, Req, Res} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {CommonResponseModel, globalConfig} from '../utils/app-service-data';
import * as uuid from 'uuid/v1';
import * as mailer from 'nodemailer';
import {NotificationsModel} from '../notifications/notifications.model';
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder(globalConfig.geoCoderOption);
import * as Stripe from 'stripe';
import * as FCM from 'fcm-node';
import * as geoLib from 'geolib';
const resizeImg = require('resize-img');
const ImageKit = require("imagekit");
const ejs = require('ejs');
const appRoot = require('app-root-path');
const path   = require("path");
var pdf = require('html-pdf')
const fs=require('fs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);
let stripe: any;
let s3;
let fcm;
let imagekit;
@Injectable()
export class UploadService {
    private months: Array<string> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    public transporter;
    constructor() {
        AWS.config.update({
            accessKeyId: "process.env.ACCESS_KEY",
            secretAccessKey: "process.env.SECRET_ACCESS_KEY",
        });
        s3 = new AWS.S3();
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        fcm = new FCM("AAAALp0hXEw:APA91bFkr0ofDWMucAUgysMw1YMWOCc_gxFeFVHxZFX01W7yTDpGbSL-g1RU0f1_lf3R9BmzRZuHHgP_rraYWTNY1dvXU50FYY5Jd4lk273RT2sDBb3-RCvBAr-AYM-835Cu-ZpWyRFI");
        imagekit = new ImageKit({
            publicKey : process.env.ImageKitPublicKey,
            privateKey : process.env.ImageKitPrivateKey,
            urlEndpoint : process.env.ImageKitUrlEndpoint
        });

    }
    //resize function
    public async resizeFunction(buffer, width, height) {
        const image = await resizeImg(buffer, {
            width: width,
            height: height,
        });
        return image;
    }
    public async resizeUploadFunction(file, buf, type, picType) {
        const params = {
            Bucket: "process.env.BUCKET_NAME",
            Body: buf,
            Key: this.getFolderName(file, type, picType),
            ACL: 'public-read',
        };
        const response = await s3.upload(params).promise();
        if (response.Location) {
            return {url: response.Location, key: response.Key};
        } else {
            return false;
        }
    }
    // uploads file and returns file url and public id
    public async uploadFileToS3ResizeFormate(file, type: string) {
        let imageArr = [];
        let mid_resize_Buf = await this.resizeFunction(file.buffer, 360, 360);
        let thumb_resize_Buf = await this.resizeFunction(file.buffer, 128, 128);
        let originalImage = await this.resizeUploadFunction(file, file.buffer, type, '_orginal_',);
        let midImage = await this.resizeUploadFunction(file, mid_resize_Buf, type, '_mid_');
        let thumbImage = await this.resizeUploadFunction(file, thumb_resize_Buf, type, '_thumb_');
        if (originalImage) {
            imageArr.push({originalImage});
        }
        if (midImage) {
            imageArr.push({midImage});
        }
        if (thumbImage) {
            imageArr.push({thumbImage});
        }
        return {response_code: HttpStatus.OK, response_data: imageArr};
    }
    // resize the image uploadtion
    public async reSizeProfilePic(file, type: string) {
        let profile_resize_Buf = await this.resizeFunction(file.buffer, 200, 200);
        let profileImage = await this.resizeUploadFunction(
            file,
            profile_resize_Buf,
            type,
            '_profile_',
        );
        if (profileImage) {
            return {response_code: HttpStatus.OK, response_data: profileImage};
        } else {
            return {
                response_code: 400,
                response_data: {message: 'Something went wrong'},
            };
        }
    }
    // seprate API for image uplodation via ImageKit
    public async imgeUploadtionViaImageKit(file, type: string):Promise<CommonResponseModel>{
        console.log("file",file)
        let buff = new Buffer(file.buffer);
        let base64data = buff.toString('base64');
        let fileName= Date.now()+'_original_'+file.originalname
        let imageURL=await imagekit.upload({
            file : base64data,
            fileName : fileName,
        })
        return{
            "response_code": HttpStatus.OK,
            "response_data": [{
                "originalImage": {
                    "url": imageURL.url,
                    "key": imageURL.fileId
                }
            },  {
                "thumbImage": {
                    url:imageURL.thumbnailUrl,
                    key: imageURL.fileId
                }
            }]
        }
    }
    public async xlsUploadToImageKit(base64data,fileName){
        let imageURL=await imagekit.upload({
            file : base64data,
            fileName : fileName,
        })
        return{
            url: imageURL.url,
            key: imageURL.fileId
        }
    }
    // deletes uploaded file
    public async deleteImage(imageKey: string): Promise<CommonResponseModel> {
        const response = await s3
            .deleteObject({Key: imageKey, Bucket: "process.env.BUCKET_NAME"})
            .promise();
        return {
            response_code: HttpStatus.OK,
            response_data: 'File deleted successfully',
        };
    }
    //delete imageKit uloded file
    public async deleteUplodedFile(fileId:string):Promise<CommonResponseModel>{
        try{
            console.log("res",fileId)
            const res=await imagekit.deleteFile(fileId);
            if(res){
                return{
                    response_code:HttpStatus.OK,
                    response_data:"deletd succesfully"
                }

            }else{
                return{
                    response_code:HttpStatus.OK,
                    response_data:"deletd succesfully"
                }
            }
            
        }catch(e){
            console.log("errrrrrrrr",e)
            return{
                response_code:HttpStatus.OK,
                response_data:"deletd succesfully"
            }
        }
        //console.log("res",res)
        
    }
    // gets folder name and sub folder
    private getFolderName(file, type: string, picType: string) {
        const month = this.months[new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        const uniqueId = uuid();
        const fileName = `${picType}${file.originalname}`;
        return `${type}/${month}-${currentYear}/${uniqueId}${fileName}`;
    }
    // geo codes Address into co-ordinates
    public async geoCodeAddress(address: any, type: string) {
        const geoCodedResponse = await geocoder.geocode(
            `${type === 'address' ? address.flatNumber : address.buildingNo} ${
                address.street
            } ${address.locality} ${address.city} ${address.postalCode}`,
        );
        return geoCodedResponse;
    }
    // create user payment using credit/debit card
    public async makeCardPayment(email: string, cardInfo: any, amount: number) {
        // @ts-ignore
        const token = await stripe.tokens.create({card: cardInfo});
        const cardType = token.card.brand;
        const customerInfo = await stripe.customers.create({email: email});
        const sourceInfo = await stripe.customers.createSource(customerInfo.id, {source: cardType === 'Visa' ? 'tok_visa' : 'tok_mastercard'});
        const charges = await stripe.charges.create({amount: amount * 100, currency: 'usd', customer: sourceInfo.customer.toString()});
        return {cardType, charges};
    }
    // creates a refund for the user
    public async createRefund(charge: string) {
        const refundRes = await stripe.refunds.create({
            charge,
        });
        return refundRes;
    }
    // sends email to the recipient
    public async sendEmail(email: string, subject: string, body: string, html?: string): Promise<any> {
        const msg = {
            to: email,
            from: process.env.SendGrid_from,
            subject: subject,
            text: body,
            html: html,
        };
        const response = await sgMail.send(msg);
        console.log("response",response)
        return response;
    }
    // sends notifications
    public async sendNotification(token: string, notification?: NotificationsModel): Promise<CommonResponseModel> {
        const message = {
            notification: {
                title: notification ? notification.title : 'Registration confirmation',
                body: notification
                    ? notification.description
                    : 'You have successfully subscribed to notifications',
                image:
                    'https://res.cloudinary.com/ddrvlb0rx/image/upload/v1568614806/Group_2006_cygw4b.png',
            },
            to: token,
        };
        return new Promise((resolve, reject) => {
            fcm.send(message, function(err, response) {
                if (err) {
                    resolve({
                        response_code: HttpStatus.BAD_REQUEST,
                        response_data: 'Invalid registration token',
                    });
                }
                console.log(JSON.parse(response));
                if (response) {
                    resolve({
                        response_code: HttpStatus.OK,
                        response_data: 'Notification sent successfully',
                    });
                }
            });
        });
    }
    // here push notification for all user
    public async subscribeToAllUsersTopic(token: string, topic: string) {
        return new Promise((resolve, reject) => {
            fcm.subscribeToTopic([token], topic, (err, response) => {
                if (err) {
                    resolve({
                        response_code: HttpStatus.BAD_REQUEST,
                        response_data: 'Invalid registration token',
                    });
                }
                console.log('topic subscription  ' + JSON.stringify(err), JSON.stringify(response));
                if (response) {
                    resolve({
                        response_code: HttpStatus.OK,
                        response_data: 'Topic subscription successfull',
                    });
                }
            });
        });
    }
    // calculates the distance between two co-ordinates
    public calculateDistance(userLocation, storeLocation): number {
        const preciseDistance = geoLib.getPreciseDistance(storeLocation, userLocation);
        return preciseDistance / 1000;
    }
    //  ************MAIL AND INVOICE
    public async dataRenderToTemplate(orderData,businessInfo) {
        let dateSplit=orderData.deliveryDate.split("-");
        let originalDate=orderData.deliveryDate;
        if(dateSplit.length>2){
            if(dateSplit && dateSplit[2]){
                let z=dateSplit[2];
                let d=z[z.length-2]+z[z.length-1];
                originalDate=`${dateSplit[0]}/${dateSplit[1]}/${d}`
            }
        }
        var myMessage = {
            storeName:  businessInfo.storeName,
            logo:businessInfo.webApp.imageUrl,
            address:businessInfo.address,
            officeEmail:businessInfo.email,
            officeContact:businessInfo.phoneNumber,
            InvoiceID:orderData.orderID,
            deliveryDate:originalDate,
            paymentType:orderData.paymentType,
            userName:orderData.user.firstName,
            fullAddress:orderData.deliveryAddress.address,
            userContact:orderData.user.mobileNumber,
            userEmail:orderData.user.email,
            cart:orderData.cart.cart,
            subTotal: orderData.subTotal,
            deliveryCharges:orderData.deliveryCharges ,
            tax: orderData.tax,
            couponDiscount:0,
            grandTotal:orderData.grandTotal ,
        };
        let templatePath =`${appRoot.path}/components/order_invoice.ejs`
        console.log("templatePath",templatePath)
        let templateHtml =await fs.readFileSync(templatePath,'utf-8');
        let html_body = await ejs.render(templateHtml, myMessage);
        return html_body
    }
    public async invoicePdfGenerate(order,businessInfo){
        let html_body_pdf=await this.dataRenderToTemplate(order,businessInfo)
        let p=new Promise(function(resolve){
          var options = { "format": "Letter" };
          pdf.create(html_body_pdf, options).toFile("invoice.pdf", function (err, pdfRes) {
            if (err) {
              console.log("err.........." + err)
            }else {
              console.log("invoice-file" + JSON.stringify(pdfRes))
              resolve(pdfRes.filename)
            }
          })
        })
        return p
    }
    public async sendOrderMail(orderData,businessInfo) {
        let pathToAttachment=await this.invoicePdfGenerate(orderData,businessInfo);
        console.log("inpathToAttachmentvoice-file" + JSON.stringify(pathToAttachment))
        let attachment = await fs.readFileSync(pathToAttachment).toString("base64");
        var myMessage = {
            name:  orderData.user.firstName,
            logo:businessInfo.webApp.imageUrl,
            image:businessInfo.webApp.imageUrl,
            banner:businessInfo.webApp.imageUrl,
            status: orderData.orderStatus,
            add:businessInfo.address
        };
        let templatePath =`${appRoot.path}/components/order.ejs`
        let templateHtml =await fs.readFileSync(templatePath,'utf-8');
        let html_body = await ejs.render(templateHtml, myMessage);
        const msg = {
            to:
            //"kumarsujeetraj68@gmail.com",
            orderData.user.email,
            from: process.env.SendGrid_from,
            subject: "Order Invoice",
            text: "Order Invoice",
            html: html_body,
            attachments: [
                {
                  content: attachment,
                  filename: "invoice.pdf",
                  type: "application/pdf",
                  disposition: "attachment"
                }
            ]
        };
        const response = await sgMail.send(msg);
        return response;
    }
}
