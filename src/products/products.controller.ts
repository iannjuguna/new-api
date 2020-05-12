import {Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, Query} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth} from '@nestjs/swagger';
import {ProductsService} from './products.service';
import {ProductsDTO, PuductStatusDTO} from './products.model';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {ProdStockDTO} from '../productstock/productstock.model';

@Controller('products')

export class ProductsController {
    constructor(private productService: ProductsService) {

    }

    // sends request to get all products thi one for admin
    // @UseGuards(AuthGuard('jwt'))
    // @ApiBearerAuth()
    @Get('')
    public getAllProducts(): Promise<CommonResponseModel> {
        return this.productService.getAllProducts();
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/list')
    public getAllSpecificFieldsProducts(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.productService.getSPecificFieldsInAllProducts(user);
    }

    

    // sends request to get all products by pagination
    @Get('pagination/:page/:limit')
    public getAllProductsByPagination(@Param('page') page: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.productService.getProductsByPagination(Number(page), Number(limit));
    }

    // sends request to get product information
    @Get('/:productId')
    public getProductInformation(@Param('productId') productId: string): Promise<CommonResponseModel> {
        return this.productService.getProductInformation(productId);
    }

    // sends request to get products by category
    @Get('/by/category/:categoryId')
    public getProductsByCategory(@Param('categoryId') categoryId: string ,@Query() query): Promise<CommonResponseModel> {
        console.log("MY")
        return this.productService.getProductsByCategory(categoryId,query);
    }
    // sends request to get products by category
    @Get('/by/subcategory/:subCategoryId')
    public getProductsBySubCategory(@Param('subCategoryId') subCategoryId: string ,@Query() query): Promise<CommonResponseModel> {
        console.log("MY")
        return this.productService.getProductsBySubCategory(subCategoryId,query);
    }

    // sends request to check whether the product is linked to a deal or not
    @Get('/check/deal/linking/:productId')
    public checkProductDealLinking(@Param('productId') productId: string,) {
        return this.productService.checkProductDealLinking(productId);
    }

    // sends request to create new product record
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('')
    public saveProduct(@GetUser() user: UsersDTO, @Body() productData: ProductsDTO): Promise<CommonResponseModel> {
        return this.productService.saveProduct(user, productData);
    }

    // sends request to update product record
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/:productId')
    public updateProduct(@GetUser() user: UsersDTO, @Param('productId') productId: string, @Body() productData: ProductsDTO, @Body()productstockData: ProdStockDTO): Promise<CommonResponseModel> {
        return this.productService.updateProductRecord(user, productId, productData, productstockData);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/stock/:productId')
    public updateProductStock(@GetUser() user: UsersDTO, @Param('productId') productId: string, @Body()productstockData: ProdStockDTO): Promise<CommonResponseModel> {
        return this.productService.stockUpdateOne(user, productId, productstockData);
    }

    // sends requests to delete this product
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('/delete/:productId')
    public deleteProduct(@GetUser() user: UsersDTO, @Param('productId') productId: string): Promise<CommonResponseModel> {
        return this.productService.deleteProduct(user, productId);
    }
    //update product status
    @Put('status/update/:productId')
    public updateStatus(@Param('productId')productId: string, @Body()statuData: PuductStatusDTO): Promise<CommonResponseModel> {
        return this.productService.statusUpdate(productId, statuData);
    }

    // //product and category data combine
    @Get('category/combineData')
    public productAndCategoryData(): Promise<CommonResponseModel> {
        return this.productService.poductAndCategoryCombine();
    }

                        //*******************user apis ********************//
    // product detail by id for user 
    @Get('/info/:id')
    public productInfo(@Param('id') id:string,@Query() query): Promise<CommonResponseModel> {
        return this.productService.productInfo(id,query);
    }

    // home page apis list
    @Get('/home/page')
    public homePage(@Query() query): Promise<CommonResponseModel> {
        //console.log("queryqueryqueryquery",query)
        return this.productService.homePage(query);
    }
    //home top deal list
    @Get('/home/top/deal')
    public homePageTopDeal(): Promise<CommonResponseModel> {
        return this.productService.homePageTopDeal();
    }
    //  page apis list
    @Get('/home/deal/of/day')
    public homePageDealsOfDay(): Promise<CommonResponseModel> {
        return this.productService.homePageDealsOfDay();
    }
    //  page apis list
    @Get('/home/category')
    public homePageCategory(): Promise<CommonResponseModel> {
        return this.productService.homePageCategory();
    }
    //  page apis list
    @Get('/home/product')
    public homePageProduct(@Query() query): Promise<CommonResponseModel> {
        return this.productService.homePageProduct(query);
    }
    // sends request to search products
    @Get('/search/:query')
    public searchProduct(@Param('query') search_key: string,@Query() query) {
        return this.productService.searchProduct(search_key,query);
    }
    // get filter product data
    @Get('/filter/:query')
    public getFilterProductList(@Param('query')search_key: string,@Query() query):Promise<CommonResponseModel>{
        return this.productService.getFilterData(search_key,query)
    }
}
