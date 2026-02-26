import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import {
  DashboardObjectiveEntity,
  DashboardAlertEntity,
  TerminalObjectiveEntity,
  TerminalAssignmentEntity,
} from './infrastructure/persistence';

@Injectable()
export class DashboardService {
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

  async getHome() {
    const objectives = await this.objectiveRepo.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
    const alerts = await this.alertRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });

    return {
      objectives: objectives.map((o) => ({
        id: o.id,
        title: o.title,
        achieved: o.achieved,
        objective: o.objective,
        unit: o.unit ?? '',
        href: o.href ?? undefined,
        accent: o.accent,
      })),
      alerts: alerts.map((a) => ({
        id: a.id,
        usuario: a.usuario,
        departamento: a.departamento,
        centroTrabajo: a.centroTrabajo,
        rol: a.rol ?? undefined,
        estado: a.estado,
        statusType: a.statusType ?? undefined,
      })),
    };
  }

  async patchTerminalObjective(
    id: string,
    payload: { isActive?: boolean; achieved?: number; objective?: number; pct?: number }
  ): Promise<{ id: string; isActive: boolean }> {
    const objective = await this.terminalObjectiveRepo.findOne({ where: { id } });
    if (!objective) {
      throw new NotFoundException('Objetivo terminal no encontrado');
    }
    if (payload.isActive !== undefined) objective.isActive = payload.isActive;
    if (payload.achieved !== undefined) objective.achieved = payload.achieved;
    if (payload.objective !== undefined) {
      objective.objective = payload.objective;
      objective.pct = payload.objective > 0 ? Math.round((objective.achieved / payload.objective) * 100) : 0;
    }
    if (payload.pct !== undefined) objective.pct = payload.pct;
    await this.terminalObjectiveRepo.save(objective);
    return { id: objective.id, isActive: objective.isActive };
  }

  async createTerminalAssignment(
    objectiveId: string,
    payload: { groupType: 'department' | 'person'; groupTitle: string; label?: string; sortOrder?: number }
  ) {
    const objective = await this.terminalObjectiveRepo.findOne({ where: { id: objectiveId } });
    if (!objective) {
      throw new NotFoundException('Objetivo terminal no encontrado');
    }
    const assignment = this.assignmentRepo.create({
      terminalObjective: objective,
      groupType: payload.groupType,
      groupTitle: payload.groupTitle,
      label: payload.label ?? payload.groupTitle,
      sortOrder: payload.sortOrder ?? 0,
      value: 0,
      total: 0,
      ok: true,
    });
    return this.assignmentRepo.save(assignment);
  }

  async deleteTerminalAssignment(objectiveId: string, assignmentId: string) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['terminalObjective'],
    });
    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }
    if (assignment.terminalObjective?.id !== objectiveId) {
      throw new NotFoundException('La asignación no pertenece a este objetivo');
    }
    await this.assignmentRepo.remove(assignment);
    return { ok: true };
  }

  async getTerminalObjectives() {
    const active = await this.terminalObjectiveRepo.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (!active) {
      return {
        header: null,
        departmentCards: [],
        peopleCards: [],
      };
    }

    const assignments = await this.assignmentRepo.find({
      where: { terminalObjective: { id: active.id } },
      order: { groupTitle: 'ASC', sortOrder: 'ASC', createdAt: 'ASC' },
      relations: ['terminalObjective'],
    });

    const group = (type: 'department' | 'person') => {
      const byTitle = new Map<string, TerminalAssignmentEntity[]>();
      for (const a of assignments.filter((x) => x.groupType === type)) {
        const arr = byTitle.get(a.groupTitle) ?? [];
        arr.push(a);
        byTitle.set(a.groupTitle, arr);
      }
      return [...byTitle.entries()].map(([title, rows]) => ({
        title,
        totalValue: active.achieved,
        totalObjective: active.objective,
        rows: rows.map((r) => ({
          label: r.label,
          value: r.value,
          total: r.total,
          ok: r.ok,
        })),
      }));
    };

    return {
      header: {
        id: active.id,
        title: active.title,
        rangeLabel: active.rangeLabel ?? '',
        achieved: active.achieved,
        objective: active.objective,
        pct: active.pct,
      },
      departmentCards: group('department'),
      peopleCards: group('person'),
    };
  }
}
