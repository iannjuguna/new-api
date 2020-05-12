import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
const fs =require('fs');
const appRoot = require('app-root-path');

@Injectable()
export class SeedService {
    constructor(
        @InjectModel('Users') private readonly userModel: Model<any>,
        @InjectModel('Address') private readonly addressModel: Model<any>,
        @InjectModel('Setting') private readonly settingModel: Model<any>,
        @InjectModel('Categories') private readonly categoryModel: Model<any>,
        @InjectModel('Products') private readonly productModel: Model<any>,
        @InjectModel('Cart') private readonly cartModel: Model<any>,
        @InjectModel('Notifications') private readonly notificationModel: Model<any>,
        @InjectModel('Deals') private readonly dealModel: Model<any>,
        @InjectModel('Favourites') private readonly favouritesModel: Model<any>,
        @InjectModel('Order') private readonly orderModel: Model<any>,
        @InjectModel('Coupons') private readonly couponModel: Model<any>,
        @InjectModel('Rating') private readonly ratingModel: Model<any>,
        @InjectModel('Banner') private readonly bannerModel: Model<any>,
        @InjectModel('DeliveryTaxSettings') private readonly deliveryModel: Model<any>,
        @InjectModel('Chat') private readonly chatModel: Model<any>,
        @InjectModel('Business') private readonly businessModel: Model<any>,
        @InjectModel('Subcategory') private readonly subcategoryModel: Model<any>
    ) {
       
    }
    public async seed(SEED){
        console.log("INSIDE SEED DB:-", SEED);
        if (SEED) {
            let rootPath =`${appRoot.path}/mongo-json`
            let dirs=fs.readdirSync(`${rootPath}`)
            for(let dir of dirs){
                let path=`${rootPath}/${dir}/${dir}.json`
                if (fs.existsSync(path)) {
                    let data = await fs.readFileSync(path, {encoding:'utf8', flag:'r'});
                    data=JSON.parse(data);
                    if(data && data.length){
                        if(dir=="users"){
                            await this.userModel.deleteMany({})
                            let docCount=await this.userModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="banners"){
                            await this.bannerModel.deleteMany({})
                            let docCount=await this.bannerModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="categories"){
                            await this.categoryModel.deleteMany({})
                            let docCount=await this.categoryModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="products"){
                            await this.productModel.deleteMany({})
                            let docCount=await this.productModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="orders"){
                            await this.orderModel.deleteMany({})
                            let docCount=await this.orderModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="addresses"){
                            await this.addressModel.deleteMany({})
                            let docCount=await this.addressModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="deliverytaxsettings"){
                            await this.deliveryModel.deleteMany({})
                            let docCount=await this.deliveryModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="ratings"){
                            await this.ratingModel.deleteMany({})
                            let docCount=await this.ratingModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="settings"){
                            await this.settingModel.deleteMany({})
                            let docCount=await this.settingModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="carts"){
                            await this.cartModel.deleteMany({})
                            let docCount=await this.cartModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="favourites"){
                            await this.favouritesModel.deleteMany({})
                            let docCount=await this.favouritesModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="notifications"){
                            await this.notificationModel.deleteMany({})
                            let docCount=await this.notificationModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="coupons"){
                            await this.couponModel.deleteMany({})
                            let docCount=await this.couponModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="deals"){
                            await this.dealModel.deleteMany({})
                            let docCount=await this.dealModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="chats"){
                            await this.chatModel.deleteMany({})
                            let docCount=await this.chatModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="businesses"){
                            await this.businessModel.deleteMany({})
                            let docCount=await this.businessModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }if(dir=="subcategories"){
                            await this.subcategoryModel.deleteMany({})
                            let docCount=await this.subcategoryModel.create(data)
                            console.log(`${dir}:-`,JSON.stringify(docCount.length))
                        }
                    }
                }
            }
            console.log(`All DATA MIGRATED....`)
        } 
    }
}
