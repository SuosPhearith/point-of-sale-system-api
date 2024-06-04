import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { FileImagePipe } from 'src/file/validation/file-image.pipe';
import { File as MulterFile } from 'multer';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(FileImagePipe) file: MulterFile,
  ) {
    return this.categoryService.create(createCategoryDto, file);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('key') key: string = '',
  ) {
    return this.categoryService.findAll(page, pageSize, key);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(AuthenticationGuard)
  toggleActive(@Param('id') id: number) {
    return this.categoryService.toggleActive(+id);
  }

  @Patch(':id/updateImage')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateImage(
    @UploadedFile(FileImagePipe) file: MulterFile,
    @Param('id') id: number,
  ) {
    return this.categoryService.updateImage(file, id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.categoryService.remove(+id);
  }
}
