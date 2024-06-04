import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { multerConfig } from 'src/config/multer.config';
import { FileImagePipe } from 'src/file/validation/file-image.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(FileImagePipe) file: MulterFile,
  ) {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
  ) {
    return this.productService.findAll(page, pageSize, key);
  }

  @Get('getAll/getAllCategory')
  @UseGuards(AuthenticationGuard)
  getAllCategory() {
    return this.productService.getAllCategory();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findOne(@Param('id') id: number) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(AuthenticationGuard)
  toggleActive(@Param('id') id: number) {
    return this.productService.toggleActive(+id);
  }

  @Patch(':id/updateImage')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateImage(
    @UploadedFile(FileImagePipe) file: MulterFile,
    @Param('id') id: number,
  ) {
    return this.productService.updateImage(file, id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }
}
