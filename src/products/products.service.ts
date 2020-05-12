import {HttpStatus, Injectable} from '@nestjs/common';
import {ProductsDTO, PuductStatusDTO} from './products.model';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CommonResponseModel} from '../utils/app-service-data';
import {UsersDTO} from '../users/users.model';
import {DealsDTO} from '../deals/deals.model';
import {ProdStockDTO} from '../productstock/productstock.model';


@Injectable()
export class ProductsService {
    constructor(@InjectModel('Products') private readonly productModel: Model<any>, @InjectModel('deals') private readonly dealsModel: Model<any>, @InjectModel('Favourites') private readonly favouritesModel: Model<any>, @InjectModel('Cart') private readonly cartModel: Model<any>,
                @InjectModel('Productstock') private readonly productstockModel: Model<any>, @InjectModel('Categories') private readonly categoryModel: Model<any>,@InjectModel('Subcategories') private readonly subcategoryModel: Model<any>) {
    }

    // returns list of all products
    public async getAllProducts(): Promise<CommonResponseModel> {
        const products = await this.productModel.find({}).populate('offerInfo');/*.populate('category');*/
        return {response_code: HttpStatus.OK, response_data: products};
    }

    // returns list of all products with only _id and name
    public async getSPecificFieldsInAllProducts(user: UsersDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are Not Allow This API'};
        }
        const products = await this.productModel.find({}, 'title').populate('category');
        return {response_code: HttpStatus.OK, response_data: products};
    }

    // returns list of products by pagination
    public async getProductsByPagination(page: number, limit: number): Promise<CommonResponseModel> {
        const products = await this.productModel.find({}).populate('category').populate('offerInfo').limit(limit).skip((page * limit) - limit);
        const totalProducts = await this.productModel.countDocuments();
        const paginationCount = Math.round(totalProducts / limit);
        return {response_code: HttpStatus.OK, response_data: {products, totalProducts, paginationCount}};
    }
    // returns product information
    public async getProductInformation(productId: string): Promise<CommonResponseModel> {
        const productInfo = await this.productModel.findById(productId).populate('offerInfo');
        return {response_code: HttpStatus.OK, response_data: productInfo};
    }
    // creates a new product record
    public async saveProduct(user: UsersDTO, productData: ProductsDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to create product'};
        }
        const productExist = await this.productModel.findOne({title: productData.title});
        if (productExist) {
            return {
                response_code: HttpStatus.BAD_REQUEST,
                response_data: `Product with name ${productData.title} already exist.`,
            };
        }
        productData.user = user._id;
        productData['objectID'] = String(Date.now());
        const response = await this.productModel.create(productData);
        if (response._id) {
            return {response_code: HttpStatus.CREATED, response_data: 'Product saved successfully.'};
        } else {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Could not save product'};
        }
    }
    // updates product record
    public async updateProductRecord(user: UsersDTO, productId: string, productData: ProductsDTO, productstockData: ProdStockDTO): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {response_code: HttpStatus.UNAUTHORIZED, response_data: 'You are not allowed to update product'};
        }
        if (!productId) {
            return {response_code: HttpStatus.BAD_REQUEST, response_data: 'Object ID is required'};
        }
        const response = await this.productModel.findByIdAndUpdate(productId, productData);
        return {response_code: HttpStatus.OK, response_data: 'Product updated successfully'};
    }
    // checks if product is linked to deal of not
    public async checkProductDealLinking(productId: string): Promise<CommonResponseModel> {
        const dealData = await this.dealsModel.find({products: productId}) as Array<DealsDTO>;
        if (dealData.length > 0) {
            return {response_code: HttpStatus.FOUND, response_data: 'Product you want to delete is linked to a deal'};
        } else {
            return {response_code: HttpStatus.OK, response_data: 'No linking found. You can delete the product'};
        }
    }
    // sends request to delete product
    public async deleteProduct(user: UsersDTO, productId: string): Promise<CommonResponseModel> {
        if (user.role !== 'Admin') {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                response_data: 'You are not authorized to delete this product.',
            };
        }
        const checkIfPresent = await this.cartModel.find({products: productId});
        if (checkIfPresent.length > 0) {
            return {
                response_code: HttpStatus.BAD_REQUEST,
                response_data: 'Cannot delete this product since it has a reference in orders',
            };
        }
        return {response_code: HttpStatus.OK, response_data: 'Product deleted successfully'};
    }
    public async stockUpdateOne(user: UsersDTO, id: string, productstockData: ProdStockDTO): Promise<CommonResponseModel> {
        const res = await this.productstockModel.findByIdAndUpdate(id, productstockData);
        const res1 = await this.productModel.findByIdAndUpdate(id, productstockData);
        return {
            response_code: HttpStatus.OK,
            response_data: 'update successfully both product stock and Product model'

        };
    }
    //product update status enalbe and disable
    public async statusUpdate(productId: string, statusData: PuductStatusDTO): Promise<CommonResponseModel> {
        const res = await this.productModel.findByIdAndUpdate(productId, statusData);
        return {
            response_code: HttpStatus.OK,
            response_data: ' status update successfully'
        };
    }
    //product and category combine
    public async poductAndCategoryCombine(): Promise<CommonResponseModel> {
        const productData = await this.productModel.find({});
        const categoryData = await this.categoryModel.find({});
        return {
            response_code: HttpStatus.OK,
            response_data: {productData, categoryData}
        };
    }
    //********************** */ user apis list*************************************
    //function used for user
    public async ProductDataCustomize(cart,products){
        for(let item of cart.cart){
            console.log("item.unit",item.unit)
            let unit=item.unit;
            let quantity=item.quantity
            const productIndex = products.findIndex(val => val._id.toString() == item.productId.toString());
            if (productIndex === -1) {
            } else {
                console.log("productIndex",productIndex)
                let obj=products[productIndex].toJSON();
                if(obj && obj.variant.length>1){
                    const unitIndex = obj.variant.findIndex(val => val.unit == unit);
                    if(unitIndex>0){
                        console.log("unitIndex",obj.variant[unitIndex])
                        let tempVariant=obj.variant[unitIndex];
                        obj.variant.splice(unitIndex,1)
                        obj.variant.unshift(tempVariant)
                    }
                }
                obj.cartAddedQuantity=quantity;
                obj.cartId=cart._id;
                obj.cartAdded=true;
                products.splice(productIndex, 1,obj) 
            }
        }
        return products
    }
    //product info by id user
    public async productInfo(id:string,query:any): Promise<CommonResponseModel> {
        console.log("product Info query ",query)
        let product = await this.productModel.findById(id);
        if(query && query.userId && product){
            let tempProduct=[product]
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                tempProduct=await this.ProductDataCustomize(cart,tempProduct)
            }
            product=tempProduct[0];
        }
        return {
            response_code: HttpStatus.OK,
            response_data: product
        };
    }
    //enable disable  home page user not used have to remove
    public async homePage(query:any): Promise<CommonResponseModel> {
        let limit=4;
        console.log("query home page",query)
        if(query && query.limit){
            limit=Number(query.limit);
        }
        let products = await this.productModel.find({status: 1},'title imageUrl category variant averageRating').limit(limit).sort({createdAt:-1});
        // this condition not used in app side till
        if(query && query.userId && products && products.length){
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        const categories = await this.categoryModel.find({status: 1},'title imageUrl category isSubCategoryAvailable').limit(8).sort({createdAt:-1});
        const dealsOfDay = await this.dealsModel.find({status: 1},'name imageUrl delaPercent delalType category product').limit(limit).sort({createdAt:+1});
        const topDeals = await this.dealsModel.find({status: 1,topDeal:true},'name imageUrl delaPercent delalType category product').limit(limit).sort({createdAt:-1});
        return {
            response_code: HttpStatus.OK,
            response_data: {products,categories,dealsOfDay,topDeals}
        };
    }
    public async homePageTopDeal(): Promise<CommonResponseModel> {
        const topDeals = await this.dealsModel.find({status: 1,topDeal:true},'name imageUrl delaPercent delalType category product').sort({createdAt:-1});
        return {
            response_code: HttpStatus.OK,
            response_data: topDeals
        };
    }
    public async homePageDealsOfDay(): Promise<CommonResponseModel> {
        const topDeals = await this.dealsModel.find({status: 1},'name imageUrl delaPercent delalType category product').sort({createdAt:-1});
        return {
            response_code: HttpStatus.OK,
            response_data: topDeals
        };
    }
    public async homePageCategory(): Promise<CommonResponseModel> {
        const categories = await this.categoryModel.find({status: 1},'title imageUrl category').sort({createdAt:-1});
        return {
            response_code: HttpStatus.OK,
            response_data: categories
        };
    }
    public async homePageProduct(query:any): Promise<CommonResponseModel> {
        console.log("query home product",query)
        let products;
        if(query && query.page){
            products = await this.productModel.find({status: 1},'title imageUrl category isDealAvailable delaPercent variant averageRating').skip(Number(query.page)).limit(8).sort({createdAt:-1});

        }else{
            products = await this.productModel.find({status: 1},'title imageUrl category isDealAvailable delaPercent variant averageRating').sort({createdAt:-1});
        }
        if(query && query.userId && products && products.length){
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        let total = await this.productModel.countDocuments({status: 1});
        return {
            response_code: HttpStatus.OK,
            response_data: {products,total}
        };
    }
    // product search user
    public async searchProduct(search_key: string,query): Promise<CommonResponseModel> {
        console.log("search_key",search_key);
        console.log("query",query)
        let products = await this.productModel.find( { title: { $regex:search_key,$options: 'i' },status:1},'title imageUrl category variant averageRating');
        if(query && query.userId && products && products.length){
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        return {response_code: HttpStatus.OK, response_data: products};
    }
    //filter API
    public  async getFilterData(search_key: string,query):Promise<CommonResponseModel>{
        console.log("111111111",query,search_key)
        if(search_key==="HIGHTOLOW"||search_key==="Hightolow"||search_key==="High To Low"||search_key==="high to low"||search_key==="High to low"){
           const res=await this.productModel.aggregate([
            {$unwind: '$variant'},
            {$sort: {'variant.price': -1}},
             {$group: {_id: '$_id', 'data': {$push:'$variant'}}},
             {$project: {'variant':'$data'}}
           ])
            return{
                response_code:HttpStatus.OK,
                response_data:res
            }

        }
        if(search_key==="LOWTOHIGH"||search_key==="Low To High"||search_key==="lowtohigh"||search_key==="low to high"||search_key==="Low to high"){
            const res=await this.productModel.aggregate([
                {$unwind: '$variant'},
                {$sort: {'variant.price': 1}},
                 {$group: {_id: '$_id', 'data': {$push:'$variant'}}},
                 {$project: {'variant':'$data'}}
               ])
                return{
                    response_code:HttpStatus.OK,
                    response_data:res
                }
    
        }
        if(search_key=='Top Rated'||search_key=='top Rated'||search_key=='TopRated'||search_key=='toprated'){
        const res=await this.productModel.find({}).sort({totalRating:-1})
        return{
           response_code:HttpStatus.OK,
           response_data:res
        }
     }
    }
    // returns products of a particular category
    public async getProductsByCategory(categoryId: string,query:any): Promise<CommonResponseModel> {
        let products = await this.productModel.find({category: categoryId,status:1},'title imageUrl category isDealAvailable delaPercent variant averageRating').sort({createdAt:-1});
        let subCategory = await this.subcategoryModel.find({category: categoryId,status:1},'title').sort({createdAt:-1});
        if(query && query.userId && products && products.length){
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        return {response_code: HttpStatus.OK, response_data: {products,subCategory}};
    }
    // returns products of a particular category
    public async getProductsBySubCategory(subCategoryId: string,query:any): Promise<CommonResponseModel> {
        let products = await this.productModel.find({subcategory: subCategoryId,status:1},'title imageUrl category subcategory isDealAvailable delaPercent variant averageRating').sort({createdAt:-1});
        if(query && query.userId && products && products.length){
            let cart=await this.cartModel.findOne({user: query.userId, isOrderLinked: false},'cart');
            if(cart && cart.cart && cart.cart.length){
                products=await this.ProductDataCustomize(cart,products)
            }
        }
        return {response_code: HttpStatus.OK, response_data: products};
    }

    
}