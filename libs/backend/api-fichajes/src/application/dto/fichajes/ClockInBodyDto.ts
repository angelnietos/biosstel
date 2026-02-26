import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClockInBodyDto {
  @ApiProperty({ type: String, description: 'ID del usuario que ficha.', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  userId!: string;

  @ApiPropertyOptional({
    description: 'Ubicación opcional (lat, lng).',
    type: 'object',
    properties: { lat: { type: 'number' }, lng: { type: 'number' } },
  })
  location?: { lat: number; lng: number };
}
