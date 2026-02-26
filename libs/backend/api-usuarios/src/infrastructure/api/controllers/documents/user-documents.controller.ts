/**
 * @biosstel/api-usuarios - Documentación de usuario (listar, subir, descargar, eliminar)
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Res,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional, ApiParam } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserDocumentEntity } from '../../../postgres';

class UploadDocumentDto {
  @IsString()
  @ApiProperty({ type: String, example: 'DNI.pdf' })
  name!: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'application/pdf' })
  mimeType?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Contenido en base64 (para subida simple sin multipart).' })
  contentBase64?: string;
}

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users/:userId/documents')
export class UserDocumentsController {
  constructor(
    @InjectRepository(UserDocumentEntity)
    private readonly repo: Repository<UserDocumentEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar documentos del usuario' })
  @ApiParam({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  @ApiResponse({ status: 200, description: 'Lista de documentos (id, name, mimeType, createdAt).' })
  async list(@Param('userId', ParseUUIDPipe) userId: string) {
    const list = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'mimeType', 'createdAt'],
    });
    return list.map((d) => ({
      id: d.id,
      name: d.name,
      mimeType: d.mimeType ?? undefined,
      createdAt: d.createdAt,
    }));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Subir documento (metadatos + base64 opcional)' })
  @ApiResponse({ status: 201, description: 'Documento creado.' })
  async upload(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UploadDocumentDto,
  ) {
    try {
      const entity = this.repo.create({
        userId,
        name: dto.name ?? '',
        mimeType: dto.mimeType ?? undefined,
        contentBase64: dto.contentBase64 ?? undefined,
      });
      const saved = await this.repo.save(entity);
      return { id: saved.id, name: saved.name, mimeType: saved.mimeType, createdAt: saved.createdAt };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir documento';
      throw new BadRequestException(message);
    }
  }

  @Get(':docId')
  @ApiOperation({ summary: 'Descargar/ver documento (devuelve base64 o 404)' })
  @ApiParam({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  @ApiParam({ name: 'docId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000003' })
  async getOne(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('docId', ParseUUIDPipe) docId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const doc = await this.repo.findOne({ where: { id: docId, userId } });
    if (!doc) {
      res.status(404).end();
      return;
    }
    if (doc.contentBase64) {
      return { id: doc.id, name: doc.name, mimeType: doc.mimeType, contentBase64: doc.contentBase64 };
    }
    return { id: doc.id, name: doc.name, mimeType: doc.mimeType };
  }

  @Delete(':docId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar documento' })
  @ApiParam({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  @ApiParam({ name: 'docId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000003' })
  async remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('docId', ParseUUIDPipe) docId: string,
  ): Promise<void> {
    await this.repo.delete({ id: docId, userId });
  }
}
