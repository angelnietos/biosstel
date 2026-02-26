/**
 * Enriquece la lista de usuarios (GET /api/users) con lastFichajeAt
 * y con departamento/centroTrabajo (nombres desde empresa).
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataSource, In } from 'typeorm';
import type { User, PaginatedResult } from '@biosstel/shared-types';
import { FichajeEntity } from '@biosstel/api-fichajes';
import { DepartmentEntity, WorkCenterEntity } from '@biosstel/api-empresa';

function isPaginatedUsers(body: unknown): body is PaginatedResult<User> {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  const items = (b.items ?? b.data) as unknown[] | undefined;
  return Array.isArray(items) && items.every(
    (u) => typeof u === 'object' && u !== null && 'id' in u && typeof (u as User).id === 'string'
  );
}

@Injectable()
export class EnrichUsersListInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      switchMap((value: unknown) =>
        from(this.enrich(value, context))
      )
    );
  }

  private isListUsersPath(request: { method: string; url?: string; path?: string }): boolean {
    if (request.method !== 'GET') return false;
    const path = (request.path ?? request.url ?? '').split('?')[0].replace(/\/$/, '');
    return (
      path === '/api/users' ||
      path === '/api/v1/users' ||
      /^\/api\/v\d+\/users$/.test(path) ||
      path === '/v1/users' ||
      path === '/users'
    );
  }

  private async enrich(value: unknown, context: ExecutionContext): Promise<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; url: string; path?: string }>();
    if (!this.isListUsersPath(request)) return value;
    if (!isPaginatedUsers(value)) return value;

    const body = value;
    const items = body.items ?? body.data;
    const userIds = items.map((u) => u.id).filter(Boolean);
    if (userIds.length === 0) return value;

    await this.enrichLastFichaje(items, userIds);
    await this.enrichDepartamentoAndCentro(items);
    return value;
  }

  private async enrichLastFichaje(items: User[], userIds: string[]): Promise<void> {
    try {
      const repo = this.dataSource.getRepository(FichajeEntity);
      const rows = await repo
        .createQueryBuilder('f')
        .select('f.userId', 'userId')
        .addSelect('MAX(f.startTime)', 'lastStart')
        .where('f.userId IN (:...ids)', { ids: userIds })
        .groupBy('f.userId')
        .getRawMany<{ userId: string; lastStart: Date | string }>();

      const lastByUser = new Map<string, string>();
      for (const row of rows) {
        let iso: string | null = null;
        if (row.lastStart instanceof Date) {
          iso = row.lastStart.toISOString();
        } else if (typeof row.lastStart === 'string') {
          iso = row.lastStart;
        }
        if (iso) lastByUser.set(row.userId, iso);
      }

      for (const user of items) {
        const last = lastByUser.get(user.id);
        (user as User & { lastFichajeAt?: string }).lastFichajeAt = last;
      }
    } catch {
      // Si falla la query (ej. tabla fichajes no existe), no romper la respuesta
    }
  }

  private async enrichDepartamentoAndCentro(items: User[]): Promise<void> {
    try {
      const getDeptId = (u: User): string | undefined => {
        const r = u as Record<string, unknown>;
        const id = r.departmentId ?? r.department_id;
        return typeof id === 'string' ? id : undefined;
      };
      const getWcId = (u: User): string | undefined => {
        const r = u as Record<string, unknown>;
        const id = r.workCenterId ?? r.work_center_id;
        return typeof id === 'string' ? id : undefined;
      };
      const deptIds = [...new Set(items.map((u) => getDeptId(u)).filter(Boolean))];
      const wcIds = [...new Set(items.map((u) => getWcId(u)).filter(Boolean))];
      const deptRepo = this.dataSource.getRepository(DepartmentEntity);
      const wcRepo = this.dataSource.getRepository(WorkCenterEntity);
      const [departments, workCenters] = await Promise.all([
        deptIds.length > 0 ? deptRepo.find({ where: { id: In(deptIds) } }) : [],
        wcIds.length > 0 ? wcRepo.find({ where: { id: In(wcIds) } }) : [],
      ]);
      const deptByName = new Map(departments.map((d) => [d.id, d.name]));
      const wcByName = new Map(workCenters.map((w) => [w.id, w.name]));
      for (const user of items) {
        const deptId = getDeptId(user);
        const wcId = getWcId(user);
        if (deptId) {
          (user as User & { departamento?: string }).departamento = deptByName.get(deptId) ?? undefined;
        }
        if (wcId) {
          (user as User & { centroTrabajo?: string }).centroTrabajo = wcByName.get(wcId) ?? undefined;
        }
      }
    } catch {
      // Si empresa no está disponible o tablas no existen, no romper la respuesta
    }
  }
}
