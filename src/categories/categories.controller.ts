import {
    Controller,
    UseGuards,
    Post,
    UseInterceptors,
    UploadedFile,
    Delete,
    Param,
    Body,
    Get,
    Put,
    Patch,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {CategoryService} from './categories.service';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiConsumes, ApiImplicitFile} from '@nestjs/swagger';
import {GetUser} from '../utils/user.decorator';
import {UsersDTO} from '../users/users.model';
import {CategoryDTO, CategoryStatusDTO} from './categories.model';
import {CommonResponseModel} from '../utils/app-service-data';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoryService) {

    }

    // sends request to get all categories
    @Get('')
    public getAllCategories(): Promise<CommonResponseModel> {
        return this.categoryService.getAllCategories();
    }

    // sends request to search algolia to get products and categories
    @Get('/search/:query')
    public searchCategories(@Param('query') query: string): Promise<CommonResponseModel> {
        return this.categoryService.searchCategories(query);
    }

    // sends request to get only specific fields in categories
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/list')
    public getListOfAllCategories(@GetUser() user: UsersDTO): Promise<CommonResponseModel> {
        return this.categoryService.getSpecificCategoryFields(user);
    }

    // sends request to get all categories by pagination
    @Get('/:pageNum/:limit')
    public getAllCategoriesByPagination(@Param('pageNum') pageNum: string, @Param('limit') limit: string): Promise<CommonResponseModel> {
        return this.categoryService.getAllCategoriesByPagination(Number(pageNum), Number(limit));
    }

    // sends request to get category information
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/:categoryId')
    public getCategoryInfo(@Param('categoryId') categoryId: string): Promise<CommonResponseModel> {
        return this.categoryService.getCategoryInfo(categoryId);
    }

    // sends request to check whether the category is linked to product of not
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('/check/product/linking/:categoryId')
    public checkProductLinking(@Param('categoryId') categoryId: string): Promise<CommonResponseModel> {
        return this.categoryService.checkCategoryLinkedToProduct(categoryId);
    }

    // sends request to save category
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post('')
    public saveCategory(@GetUser() user: UsersDTO, @Body() categoryData: CategoryDTO): Promise<CommonResponseModel> {
        return this.categoryService.saveCategory(user, categoryData);
    }

    // sends request to update category
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('/:categoryId')
    public updateCategory(@GetUser() user: UsersDTO, @Param('categoryId') categoryId: string, @Body() categoryData: CategoryDTO): Promise<CommonResponseModel> {
        return this.categoryService.updateCategory(user, categoryId, categoryData);
    }

    // sends request to delete category
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('/delete/:categoryId')
    public deleteCategory(@GetUser() user: UsersDTO, @Param('categoryId') categoryId: string): Promise<CommonResponseModel> {
        return this.categoryService.deleteCategory(user, categoryId);
    }
    //check enable and disable 
    @Get('category/enable/disable/:id')
    public statusEnableAndDisable(@Param('id') id: string): Promise<CommonResponseModel> {
        return this.categoryService.eNableAndDisableCategory(id);
    }

    //update category status
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put('update/status/:id')
    public categoryStatus(@Param('id')id: string, @Body()categorystatusData: CategoryStatusDTO): Promise<CommonResponseModel> {
        return this.categoryService.categoryStausupdate(id, categorystatusData);
    }
    //get All enable category Data for mobile
    @Get('/all/enable/list')
    public findOnlyEnalbecategory():Promise<CommonResponseModel>
    {
        return this.categoryService.getAllEnableCategoryList()
    }
}
