/**
 * @biosstel/api-users - Interface Adapters: Users Controller
 * 
 * REST controller that exposes user endpoints.
 * This is the primary adapter in the hexagonal architecture.
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
import { UsersService } from './users.service';
import {
  CreateUserData,
  UpdateUserData,
  User,
  PaginatedResult,
} from './application/ports/IUserRepository';

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
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<User>> {
    return this.usersService.findAll(query.page || 1, query.pageSize || 10);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
