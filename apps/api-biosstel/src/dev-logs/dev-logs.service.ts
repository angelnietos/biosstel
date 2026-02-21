import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FrontendLogEntity } from './frontend-log.entity';

export interface SaveFrontendLogDto {
  entries: unknown[];
}

@Injectable()
export class DevLogsService {
  constructor(
    @InjectRepository(FrontendLogEntity)
    private readonly repo: Repository<FrontendLogEntity>
  ) {}

  async saveFrontendLog(entries: unknown[], userId: string | null): Promise<{ id: string }> {
    const row = this.repo.create({
      payload: entries,
      userId,
    });
    const saved = await this.repo.save(row);
    return { id: saved.id };
  }
}
