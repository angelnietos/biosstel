import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardObjectiveEntity } from './infrastructure/persistence/DashboardObjectiveEntity';
import { DashboardAlertEntity } from './infrastructure/persistence/DashboardAlertEntity';
import { TerminalObjectiveEntity } from './infrastructure/persistence/TerminalObjectiveEntity';
import { TerminalAssignmentEntity } from './infrastructure/persistence/TerminalAssignmentEntity';

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
    private readonly assignmentRepo: Repository<TerminalAssignmentEntity>,
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
      where: { terminalObjective: { id: active.id } as any },
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

