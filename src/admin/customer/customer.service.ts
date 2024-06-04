import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      const newCustomer = await this.prisma.customer.create({
        data: { ...createCustomerDto, createdBy: user.id },
      });
      return {
        data: newCustomer,
        message: 'Created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
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
          { email: { contains: key, mode: 'insensitive' } },
        ];
      }

      // Get the total count of users matching the criteria
      const totalCount = await this.prisma.customer.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get the users with pagination and search criteria
      const data = await this.prisma.customer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
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
      // find customer by id
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });
      // validate if customer not found
      if (!customer)
        throw new NotFoundException(`Employee with id: ${id} not found`);
      // response back
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      // find customer by id
      const customer = await this.findOne(id);
      // start update
      const updatecustomer = await this.prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: updateCustomerDto,
      });
      //response back
      return {
        data: updatecustomer,
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

  async remove(id: number): Promise<any> {
    try {
      // find customer by id
      const customer = await this.findOne(id);
      // start update
      await this.prisma.customer.delete({
        where: {
          id: customer.id,
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

  async toggleActive(id: number): Promise<any> {
    try {
      // check is valid id
      const customer = await this.findOne(id);
      let newStatus: boolean;
      customer.status ? (newStatus = false) : (newStatus = true);
      await this.prisma.customer.update({
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
}
