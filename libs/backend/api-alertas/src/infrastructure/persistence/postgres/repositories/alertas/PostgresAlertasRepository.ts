import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { DashboardAlertEntity } from '@biosstel/api-objetivos';
import type { Alert } from '../../../../../domain/entities';
import type { IAlertasRepository, CreateAlertData, UpdateAlertData } from '../../../../../domain/repositories';
import { AlertMapper } from '../../../../mappers/AlertMapper';

@Injectable()
export class PostgresAlertasRepository implements IAlertasRepository {
  constructor(
    @InjectRepository(DashboardAlertEntity)
    private readonly repository: Repository<DashboardAlertEntity>
  ) {}

  async findAllActive(): Promise<Alert[]> {
    const alerts = await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    return alerts.map((r) => AlertMapper.toDomain(r));
  }

  async findById(id: string): Promise<Alert | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? AlertMapper.toDomain(entity) : null;
  }

  async create(data: CreateAlertData): Promise<Alert> {
    const partial = AlertMapper.toCreateEntity(data);
    const entity = this.repository.create(partial);
    const saved = await this.repository.save(entity);
    return AlertMapper.toDomain(saved);
  }

  async update(id: string, data: UpdateAlertData): Promise<Alert> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Alerta ${id} no encontrada`);
    if (data.usuario !== undefined) entity.usuario = data.usuario;
    if (data.departamento !== undefined) entity.departamento = data.departamento;
    if (data.centroTrabajo !== undefined) entity.centroTrabajo = data.centroTrabajo;
    if (data.estado !== undefined) entity.estado = data.estado;
    if (data.rol !== undefined) entity.rol = data.rol;
    if (data.marca !== undefined) entity.marca = data.marca;
    if (data.statusType !== undefined) entity.statusType = data.statusType;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) entity.isActive = data.isActive;
    const saved = await this.repository.save(entity);
    return AlertMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Alerta ${id} no encontrada`);
  }
}
