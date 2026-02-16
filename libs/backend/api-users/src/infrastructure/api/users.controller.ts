/**
 * @biosstel/api-users - Infrastructure Layer: Users Controller (Input Adapter)
 * 
 * REST controller that exposes user endpoints.
 * This is the input adapter in the hexagonal architecture.
 * It uses the Use Case (input port) to execute business logic.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserManagementUseCase } from '../../application/use-cases';
import type {
  CreateUserData,
  UpdateUserData,
  User,
  PaginatedResult,
} from '@biosstel/shared-types';

class CreateUserDto implements CreateUserData {
  email!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
}

class UpdateUserDto implements UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  password?: string;
}

class PaginationQueryDto {
  page?: number = 1;
  pageSize?: number = 10;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly userManagement: UserManagementUseCase,
  ) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<User>> {
    return this.userManagement.findAll(query.page || 1, query.pageSize || 10);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userManagement.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userManagement.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userManagement.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userManagement.delete(id);
  }
}
