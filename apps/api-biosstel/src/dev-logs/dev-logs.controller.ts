import { Controller, Post, Body, Headers, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { DevLogsService } from './dev-logs.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

class SaveFrontendLogDto {
  @IsArray()
  entries!: unknown[];
}

/**
 * Solo disponible cuando NODE_ENV=development.
 * Permite guardar en BD el log de flujo exportado desde el frontend.
 */
@ApiTags('dev-logs')
@Controller('dev-logs')
export class DevLogsController {
  constructor(
    private readonly devLogsService: DevLogsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  private ensureDev(): void {
    if (this.config.get('NODE_ENV') !== 'development') {
      throw new ForbiddenException('Este endpoint solo está disponible en desarrollo');
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Exportar log de flujo del frontend a la BD',
    description:
      'Solo en NODE_ENV=development. Guarda el array de entradas del flow log en la tabla frontend_logs. Opcional: Authorization Bearer para asociar al usuario.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Log guardado; devuelve { id }.' })
  @ApiResponse({ status: 403, description: 'Entorno no es development.' })
  async saveFrontendLog(
    @Body() dto: SaveFrontendLogDto,
    @Headers('authorization') authorization?: string
  ): Promise<{ id: string }> {
    this.ensureDev();

    const entries = Array.isArray(dto?.entries) ? dto.entries : [];
    let userId: string | null = null;
    if (authorization?.startsWith('Bearer ')) {
      try {
        const token = authorization.slice(7);
        const payload = this.jwtService.verify(token);
        if (payload?.sub && payload?.tokenType !== 'refresh') {
          userId = payload.sub;
        }
      } catch {
        // ignore invalid token; save without user
      }
    }
    return this.devLogsService.saveFrontendLog(entries, userId);
  }
}
