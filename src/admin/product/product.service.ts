import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/file/file-upload.service';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    file: any,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      // Use the FileUploadService here
      const result = this.fileUploadService.handleFileUpload(file);
      const newProduct = await this.prisma.product.create({
        data: { ...createProductDto, image: result.path },
      });
      return {
        data: newProduct,
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
        where.OR = [{ name: { contains: key, mode: 'insensitive' } }];
      }

      // Get the total count of users matching the criteria
      const totalCount = await this.prisma.product.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the users with pagination and search criteria
      const data = await this.prisma.product.findMany({
        where,
        skip,
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
      // find product by id
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      // validate if product not found
      if (!product)
        throw new NotFoundException(`Category with id: ${id} not found`);
      // response back
      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      // find product by id
      const product = await this.findOne(+id);
      // start update
      const updateproduct = await this.prisma.product.update({
        where: {
          id: product.id,
        },
        data: updateProductDto,
      });
      //response back
      return {
        data: updateproduct,
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      //check if duplicate
      if (error.code === 'P2002') {
        throw new ConflictException('Name already exists');
      }
      throw error;
    }
  }

  async toggleActive(id: number): Promise<any> {
    try {
      // check is valid id
      const product = await this.findOne(+id);
      let newStatus: boolean;
      product.status ? (newStatus = false) : (newStatus = true);
      await this.prisma.product.update({
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
      // find product by id
      const product = await this.findOne(+id);
      // start update
      await this.prisma.product.delete({
        where: {
          id: product.id,
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
      const product = await this.findOne(+id);
      const result = this.fileUploadService.handleFileUpload(file);
      // Use the FileUploadService here
      // start update
      await this.prisma.product.update({
        where: {
          id: product.id,
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

  async getAllCategory(): Promise<any> {
    try {
      const categories = await this.prisma.category.findMany({
        select: { id: true, name: true },
      });
      return categories;
    } catch (error) {
      throw error;
    }
  }
}
