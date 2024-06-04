import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';
import { FileUploadService } from 'src/file/file-upload.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    file: any,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      // Use the FileUploadService here
      const result = this.fileUploadService.handleFileUpload(file);
      const newcategory = await this.prisma.category.create({
        data: { ...createCategoryDto, image: result.path },
      });
      return {
        data: newcategory,
        message: 'Created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      //check if duplicate
      if (error.code === 'P2002') {
        throw new ConflictException('Name already exists');
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    key: string = '',
  ): Promise<any> {
    try {
      // Calculate the offset for pagination
      const skip = (page - 1) * pageSize;

      // Build the search criteria conditionally
      const where: any = {};

      if (key) {
        where.OR = [
          { name: { contains: key, mode: 'insensitive' } },
          { description: { contains: key, mode: 'insensitive' } },
        ];
      }

      // Get the total count of users matching the criteria
      const totalCount = await this.prisma.category.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the users with pagination and search criteria
      const data = await this.prisma.category.findMany({
        where,
        skip,
        include: {
          _count: {
            select: { Product: true },
          },
        },
        take: +pageSize,
      });

      // Return the response with pagination details
      return {
        data,
        totalCount: +totalCount,
        totalPages: +totalPages,
        currentPage: +page,
        pageSize: +pageSize,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      // find category by id
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      // validate if category not found
      if (!category)
        throw new NotFoundException(`Category with id: ${id} not found`);
      // response back
      return category;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      // find category by id
      const category = await this.findOne(+id);
      // start update
      const updatecategory = await this.prisma.category.update({
        where: {
          id: category.id,
        },
        data: updateCategoryDto,
      });
      //response back
      return {
        data: updatecategory,
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      //check if duplicate
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async toggleActive(id: number): Promise<any> {
    try {
      // check is valid id
      const category = await this.findOne(+id);
      let newStatus: boolean;
      category.status ? (newStatus = false) : (newStatus = true);
      await this.prisma.category.update({
        where: { id },
        data: { status: newStatus },
      });
      return {
        message: 'Updated success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<any> {
    try {
      // find category by id
      const category = await this.findOne(+id);
      // start update
      await this.prisma.category.delete({
        where: {
          id: category.id,
        },
      });
      //response back
      return {
        message: 'Deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateImage(file: any, id: number): Promise<any> {
    try {
      // check is user is valid
      const category = await this.findOne(+id);
      const result = this.fileUploadService.handleFileUpload(file);
      // Use the FileUploadService here
      // start update
      await this.prisma.category.update({
        where: {
          id: category.id,
        },
        data: {
          image: result.path,
        },
      });
      // response back
      return {
        message: 'Updated succesfully!',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
