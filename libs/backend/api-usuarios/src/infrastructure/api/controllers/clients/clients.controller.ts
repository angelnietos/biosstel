/**
 * @biosstel/api-users - Clients controller (GET/POST /clients).
 * Front expects: GET list, POST { name, email, phone }.
 */

import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ClientEntity } from '../../../postgres';

class CreateClientDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Cliente A' })
  name!: string;
  @IsEmail()
  @ApiProperty({ type: String, example: 'cliente@example.com' })
  email!: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: '+34 600 000 000' })
  phone?: string;
}

class ClientResponseDto {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  name!: string;
  @ApiProperty({ type: String })
  email!: string;
  @ApiPropertyOptional({ type: String })
  phone?: string;
}

@ApiTags('clients')
@ApiBearerAuth('access-token')
@Controller('clients')
export class ClientsController {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepo: Repository<ClientEntity>
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  async findAll(): Promise<{ id: string; name: string; email: string; phone?: string }[]> {
    const list = await this.clientRepo.find({
      order: { createdAt: 'DESC' },
    });
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
    }));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado.', type: ClientResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() dto: CreateClientDto): Promise<{ id: string; name: string; email: string; phone?: string }> {
    try {
      const client = this.clientRepo.create({
        name: dto.name ?? '',
        email: dto.email ?? '',
        phone: dto.phone ?? undefined,
      });
      const saved = await this.clientRepo.save(client);
      return {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('unique') || msg.includes('duplicate') || (err as { code?: string })?.code === '23505') {
        throw new BadRequestException('Ya existe un cliente con este email');
      }
      throw new BadRequestException(err instanceof Error ? err.message : 'Error al crear cliente');
    }
  }
}
