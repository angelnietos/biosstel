/**
 * @biosstel/api-dashboard - Infrastructure Layer: TypeORM Dashboard Repository
 *
 * Implementation of IDashboardRepository using TypeORM.
 * This is the adapter in the hexagonal architecture.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, type Repository } from 'typeorm';
import type { DashboardHomeResponse, TerminalObjectivesResponse } from '@biosstel/shared-types';
import type { IDashboardRepository } from '../../../../domain/repositories';
import { DashboardAlertEntity } from '../../entities/DashboardAlertEntity';
import { DashboardObjectiveEntity } from '../../entities/DashboardObjectiveEntity';
import { TerminalAssignmentEntity } from '../../entities/TerminalAssignmentEntity';
import { TerminalObjectiveEntity } from '../../entities/TerminalObjectiveEntity';

function filterToArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  return [v];
}

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
    private readonly assignmentRepo: Repository<TerminalAssignmentEntity>
  ) {}

  async getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
    const objectives = await this.objectiveRepo.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });

    const alertsRows = await this.alertRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    let alerts = alertsRows.map((alert) => ({
      id: alert.id,
      usuario: alert.usuario,
      departamento: alert.departamento ?? '',
      centroTrabajo: alert.centroTrabajo ?? '',
      rol: alert.rol,
      estado: alert.estado,
      statusType: alert.statusType,
    }));

    const deptValues = filterToArray(filters?.departamento ?? filters?.departamentos);
    if (deptValues.length) {
      const deptSet = new Set(deptValues.map((d) => d.toLowerCase()));
      alerts = alerts.filter((a) => a.departamento && deptSet.has(a.departamento.toLowerCase()));
    }
    const centerValues = filterToArray(filters?.centroTrabajo ?? filters?.centrosTrabajo);
    if (centerValues.length) {
      const centerSet = new Set(centerValues.map((c) => c.toLowerCase()));
      alerts = alerts.filter((a) => a.centroTrabajo && centerSet.has(a.centroTrabajo.toLowerCase()));
    }

    return {
      objectives: objectives.map((obj) => ({
        id: obj.id,
        title: obj.title,
        achieved: obj.achieved,
        objective: obj.objective,
        unit: obj.unit || '',
        href: obj.href || undefined,
        accent: obj.accent ?? undefined,
      })),
      alerts,
    };
  }

  async getTerminalObjectives(
    filters?: Record<string, string[]>
  ): Promise<TerminalObjectivesResponse> {
    const typeValues = filterToArray(filters?.type);
    const periodValues = filterToArray(filters?.period);
    const objectiveType = (typeValues[0] === 'puntos' ? 'puntos' : 'contratos') as string;
    const period = periodValues[0] ?? null;

    const whereCurrent = { isActive: true, objectiveType, period: IsNull() };
    const whereHistoric = period
      ? { objectiveType, period }
      : null;

    const terminalObjective = await this.terminalObjectiveRepo.findOne({
      where: whereHistoric ?? whereCurrent,
      order: { createdAt: 'DESC' },
    });

    if (!terminalObjective) {
      if (period) {
        return {
          header: { id: '', title: '', rangeLabel: '', achieved: 0, objective: 0, pct: 0 },
          departmentCards: [],
          peopleCards: [],
        };
      }
      const lastInactive = await this.terminalObjectiveRepo.findOne({
        where: { isActive: false, objectiveType, period: IsNull() },
        order: { updatedAt: 'DESC' },
      });
      const lastAny = lastInactive ?? (await this.terminalObjectiveRepo.findOne({
        where: { objectiveType, period: IsNull() },
        order: { updatedAt: 'DESC' },
      }));
      return {
        header: {
          id: '',
          title: 'Objetivos terminales',
          rangeLabel: '',
          achieved: 0,
          objective: 0,
          pct: 0,
        },
        departmentCards: [],
        peopleCards: [],
        inactiveObjective: lastAny
          ? { id: lastAny.id, title: lastAny.title || 'Objetivo terminal' }
          : undefined,
      };
    }

    const assignments = await this.assignmentRepo.find({
      where: { terminalObjective: { id: terminalObjective.id } },
      order: { sortOrder: 'ASC' },
    });

    interface CardGroup {
      title: string;
      totalValue: number;
      totalObjective: number;
      rows: { id: string; label: string; value: number; total: number; ok: boolean }[];
    }
    const departmentMap = new Map<string, CardGroup>();
    const peopleMap = new Map<string, CardGroup>();

    assignments.forEach((assignment) => {
      const map = assignment.groupType === 'department' ? departmentMap : peopleMap;
      const key = assignment.groupTitle;

      let group = map.get(key);
      if (!group) {
        group = {
          title: assignment.groupTitle,
          totalValue: terminalObjective.achieved,
          totalObjective: terminalObjective.objective,
          rows: [],
        };
        map.set(key, group);
      }

      group.rows.push({
        id: assignment.id,
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
