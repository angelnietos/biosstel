/**
 * @biosstel/api-dashboard - Infrastructure Layer: TypeORM Dashboard Repository
 * 
 * Implementation of IDashboardRepository using TypeORM.
 * This is the adapter in the hexagonal architecture.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  DashboardHomeResponse,
  TerminalObjectivesResponse,
} from '@biosstel/shared-types';
import type { IDashboardRepository } from '../../application/ports/output/IDashboardRepository';
import {
  DashboardObjectiveEntity,
  DashboardAlertEntity,
  TerminalObjectiveEntity,
  TerminalAssignmentEntity,
} from './';

@Injectable()
export class TypeOrmDashboardRepository implements IDashboardRepository {
  constructor(
    @InjectRepository(DashboardObjectiveEntity)
    private readonly objectiveRepo: Repository<DashboardObjectiveEntity>,
    @InjectRepository(DashboardAlertEntity)
    private readonly alertRepo: Repository<DashboardAlertEntity>,
    @InjectRepository(TerminalObjectiveEntity)
    private readonly terminalObjectiveRepo: Repository<TerminalObjectiveEntity>,
    @InjectRepository(TerminalAssignmentEntity)
    private readonly assignmentRepo: Repository<TerminalAssignmentEntity>,
  ) {}

  async getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
    // TODO: Apply filters when needed
    const objectives = await this.objectiveRepo.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });

    const alerts = await this.alertRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    return {
      objectives: objectives.map((obj) => ({
        id: obj.id,
        title: obj.title,
        achieved: obj.achieved,
        objective: obj.objective,
        unit: obj.unit || '',
        href: obj.href || undefined,
        accent: obj.accent as any,
      })),
      alerts: alerts.map((alert) => ({
        id: alert.id,
        usuario: alert.usuario,
        departamento: alert.departamento,
        centroTrabajo: alert.centroTrabajo,
        rol: alert.rol,
        estado: alert.estado,
        statusType: alert.statusType,
      })),
    };
  }

  async getTerminalObjectives(filters?: Record<string, string[]>): Promise<TerminalObjectivesResponse> {
    const terminalObjective = await this.terminalObjectiveRepo.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (!terminalObjective) {
      throw new Error('No active terminal objective found');
    }

    const assignments = await this.assignmentRepo.find({
      where: { terminalObjective: { id: terminalObjective.id } },
      order: { sortOrder: 'ASC' },
    });

    // Group by type and title
    const departmentMap = new Map<string, any>();
    const peopleMap = new Map<string, any>();

    assignments.forEach((assignment) => {
      const map = assignment.groupType === 'department' ? departmentMap : peopleMap;
      const key = assignment.groupTitle;

      if (!map.has(key)) {
        map.set(key, {
          title: assignment.groupTitle,
          totalValue: terminalObjective.achieved,
          totalObjective: terminalObjective.objective,
          rows: [],
        });
      }

      map.get(key).rows.push({
        label: assignment.label,
        value: assignment.value,
        total: assignment.total,
        ok: assignment.ok,
      });
    });

    return {
      header: {
        id: terminalObjective.id,
        title: terminalObjective.title || '',
        rangeLabel: terminalObjective.rangeLabel || '',
        achieved: terminalObjective.achieved,
        objective: terminalObjective.objective,
        pct: terminalObjective.pct,
      },
      departmentCards: Array.from(departmentMap.values()),
      peopleCards: Array.from(peopleMap.values()),
    };
  }
}
