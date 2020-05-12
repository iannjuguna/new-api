import {Controller, Post, UseInterceptors, UploadedFile, Delete, Param, UseGuards, Body, Req, Res} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiConsumes, ApiImplicitFile, ApiBearerAuth, ApiImplicitBody} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {UploadService} from './upload.service';
import {DeleteFileDTO, UploadFileDTO, ImageKitdDeleteDTO} from '../users/users.model';
import {CommonResponseModel} from '../utils/app-service-data';
import {LocationDTO} from '../address/address.model';

@Controller('utils')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
export class UploadController {
    constructor(private uploadService: UploadService) {

    }

    // profile pic upload to s3 (resize)
    @Post('/upload/profile')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: 'file', required: true, description: 'Category/Product image'})
    public uploadFile(@UploadedFile() file): Promise<CommonResponseModel> {
        return this.uploadService.reSizeProfilePic(file, 'User');
    }

    // product image upload multiple formate
    @Post('/upload/file/resize')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: 'file', required: true, description: 'Profile picture upload'})
    public uplodaProfilePic(@UploadedFile() file, @Body() data: UploadFileDTO): Promise<CommonResponseModel> {
        return this.uploadService.uploadFileToS3ResizeFormate(file, data.type);
    }

    // sends request to delete file
    @Post('/file/delete')
    public deleteImage(@Body() data: DeleteFileDTO) {
        return this.uploadService.deleteImage(data.key);
    }
    //deleted imagekit uploadtion
    @Delete('/imgaeKit/delete/:fileId')
    public deletdImgageKitFile(@Param('fileId')fileId:string):Promise<CommonResponseModel>{
        return this.uploadService.deleteUplodedFile(fileId)
    }
    // File upload to ImgeKit API 
    @Post('/upload/file/imagekit')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: 'file', required: true, description: 'Profile picture upload'})
    public imageKitProfileupload(@UploadedFile() file, @Body() data: UploadFileDTO):Promise<CommonResponseModel>{
        return this.uploadService.imgeUploadtionViaImageKit(file, data.type)
    }
}
