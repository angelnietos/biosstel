/**
 * @biosstel/fichajes - FichajeDashboard
 * Vista manager: reloj de fichar (entrada/salida) + lista de fichajes del día.
 * Usa @biosstel/ui, @biosstel/ui-layout y store fichajes para el reloj.
 */

'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL, getAuthHeaders } from '@biosstel/platform';
import {
  Chip,
  Heading,
  Text,
  Button,
  Card,
  Modal,
  Input,
  ProgressBar,
  StatusBadge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableTh,
  TableCell,
  Tabs,
  Skeleton,
  Pagination,
  ClockArc,
  useToast,
} from '@biosstel/ui';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Link, useRouter } from '@biosstel/platform';
import { useCanFichar, useCanManageFichajes } from '@biosstel/shared';
import {
  clockIn,
  clockOut,
  pauseWork,
  resumeWork,
  fetchCurrentFichaje,
  clearError,
  isValidUserId,
  fichajesService,
} from '@biosstel/fichajes';
import type { FichajesState } from '@biosstel/fichajes';

interface ScheduleItem {
  id: string;
  name: string;
  hoursPerYear?: number;
  vacationDays?: number;
  freeDisposalDays?: number;
  hoursPerDayWeekdays?: number;
  hoursPerDaySaturday?: number;
  hoursPerWeek?: number;
}

interface DashboardRow {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  startTime: string | null;
  location: { lat: number; lng: number } | null;
  minutosHoy: number;
}

const HOURS_OBJETIVO = 2400;

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h} hrs${m > 0 ? ` ${m} min` : ''}`;
}

function formatTime(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function pct(min: number, objetivo = HOURS_OBJETIVO): number {
  return Math.min(Math.round((min / objetivo) * 100), 110);
}

function getRoleVariant(role: string): 'info' | 'purple' | 'warning' | 'default' {
  switch (role?.toLowerCase()) {
    case 'comercial': return 'info';
    case 'telemarketing': return 'warning';
    case 'tienda': return 'purple';
    default: return 'default';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'working': return <StatusBadge label="Fichado" status="success" />;
    case 'paused': return <StatusBadge label="Pausado" status="warning" />;
    case 'finished': return <StatusBadge label="Finalizado" status="muted" />;
    default: return <StatusBadge label="Sin fichar" status="error" />;
  }
}

function getProgressVariant(value: number): 'default' | 'success' | 'error' {
  if (value > 100) return 'error';
  if (value > 70) return 'success';
  return 'default';
}

const TAB_ITEMS = [
  { key: 'fichajes', label: 'Fichajes' },
  { key: 'calendarios', label: 'Listado Calendarios laborales' },
  { key: 'horarios', label: 'Listado Horarios laborales' },
  { key: 'permisos', label: 'Listado Permisos' },
];

export const FichajeDashboard = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { addToast } = useToast();
  const authRestored = useSelector((state: any) => state.auth?.authRestored);
  const authUser = useSelector((state: any) => (state.auth as { user?: { id?: string; role?: string } })?.user);
  const authUserId = authUser?.id;
  const userId = isValidUserId(authUserId) ? authUserId : undefined;
  const userRole = authUser?.role;
  const showReloj = useCanFichar();
  const showGestionFichajes = useCanManageFichajes();
  const { currentFichaje, status: fichajeStatus, error: fichajeError } = useSelector((state: any) => state.fichajes as FichajesState);
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('fichajes');
  const [calendars, setCalendars] = useState<{ id: string; name: string }[]>([]);
  const [loadingCalendars, setLoadingCalendars] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [permissionTypes, setPermissionTypes] = useState<Array<{ id: string; name: string; isPaid: boolean }>>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [showCalModal, setShowCalModal] = useState(false);
  const [calendarName, setCalendarName] = useState('');
  const [calendarSubmitting, setCalendarSubmitting] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    name: '', hoursPerYear: 0, vacationDays: 0, freeDisposalDays: 0,
    hoursPerDayWeekdays: 0, hoursPerDaySaturday: 0, hoursPerWeek: 0,
  });
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [permissionName, setPermissionName] = useState('');
  const [permissionPaid, setPermissionPaid] = useState<boolean>(true);
  const [permissionSubmitting, setPermissionSubmitting] = useState(false);
  const [today] = useState(() => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }));
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  // Empleados (pueden fichar pero no gestionar) → redirigir a control de jornada (reloj + tareas)
  useEffect(() => {
    if (!authRestored || userRole == null) return;
    if (showReloj && !showGestionFichajes) {
      router.replace('/fichajes/control-jornada');
    }
  }, [authRestored, showReloj, showGestionFichajes, router]);

  useEffect(() => {
    if (userId) dispatch(fetchCurrentFichaje(userId));
  }, [dispatch, userId]);

  const fichajeState = currentFichaje?.status || 'idle';
  const isClockLoading = fichajeStatus === 'loading';
  const arcVariant = fichajeState === 'working' ? 'green' : fichajeState === 'paused' ? 'red' : 'gray';
  const arcProgress = fichajeState === 'working' ? 50 : fichajeState === 'paused' ? 25 : 0;
  const handleClockIn = () => userId && dispatch(clockIn({ userId, location: { lat: 40.4168, lng: -3.7038 } }));
  const handleClockOut = () => currentFichaje && dispatch(clockOut(currentFichaje.id));
  const handlePause = () => currentFichaje && dispatch(pauseWork({ id: currentFichaje.id, reason: 'Descanso' }));
  const handleResume = () => currentFichaje && dispatch(resumeWork(currentFichaje.id));

  const loadRows = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/fichajes?date=${encodeURIComponent(filterDate)}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data: DashboardRow[] = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterDate]);

  useEffect(() => { loadRows(); }, [loadRows]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showFilterPanel && filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterPanel]);

  const filteredRows = filterDepartment
    ? rows.filter((r) => r.role?.toLowerCase() === filterDepartment.toLowerCase())
    : rows;
  const departments = useMemo(() => Array.from(new Set(rows.map((r) => r.role).filter(Boolean))), [rows]);

  const loadCalendars = useCallback(async () => {
    setLoadingCalendars(true);
    try {
      const list = await fichajesService.getCalendars();
      setCalendars(list);
    } catch {
      setCalendars([]);
    } finally {
      setLoadingCalendars(false);
    }
  }, []);
  const loadSchedules = useCallback(async () => {
    setLoadingSchedules(true);
    try {
      const list = await fichajesService.getSchedules();
      setSchedules(list);
    } catch {
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  }, []);
  const loadPermissionTypes = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      const list = await fichajesService.getPermissionTypes();
      setPermissionTypes(list.map((p) => ({ id: p.id, name: p.name, isPaid: p.isPaid ?? false })));
    } catch {
      setPermissionTypes([]);
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'calendarios') loadCalendars();
  }, [activeTab, loadCalendars]);
  useEffect(() => {
    if (activeTab === 'horarios') loadSchedules();
  }, [activeTab, loadSchedules]);
  useEffect(() => {
    if (activeTab === 'permisos') loadPermissionTypes();
  }, [activeTab, loadPermissionTypes]);

  // Loading solo cuando aún no sabemos el usuario (restore en curso). Si ya hay user (login) mostramos la vista.
  const authPending = !authRestored && !authUser;
  if (authPending) {
    return (
      <PageContainer maxWidth="xl">
        <Stack gap={4}>
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </Stack>
      </PageContainer>
    );
  }

  // Empleados ven solo control de jornada (reloj + tareas), no este listado de admin
  const isEmployeeOnly = authRestored && userRole != null && showReloj && !showGestionFichajes;
  if (isEmployeeOnly) {
    return (
      <PageContainer maxWidth="xl">
        <Stack gap={4} align="center" className="py-12">
          <Text variant="muted">Redirigiendo a tu control de jornada...</Text>
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl">
      <Stack gap={4}>
        {/* Reloj de fichar: solo para roles que fican (Figma: admin no fica) */}
        {showReloj && (
        <Card className="p-8 border border-border-card rounded-2xl shadow-sm">
          <Stack gap={4} align="center">
            {!userId && (
              <div className="w-full rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-100">
                Inicia sesión para registrar tu jornada.
              </div>
            )}
            {fichajeError && (
              <div className="w-full rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex justify-between items-center">
                <span>{fichajeError}</span>
                <button onClick={() => dispatch(clearError())} className="font-bold underline">Cerrar</button>
              </div>
            )}
            {userId && (
              <>
                <div className="relative flex justify-center">
                  <ClockArc variant={arcVariant} progress={arcProgress} />
                  {fichajeState === 'working' && (
                    <span className="absolute top-2 right-[-24px] px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">Fichado</span>
                  )}
                  {fichajeState === 'paused' && (
                    <span className="absolute top-2 right-[-24px] px-3 py-1 rounded-full bg-[#FFEBEE] text-[#C62828] text-xs font-semibold">Pausado</span>
                  )}
                </div>
                <Stack direction="row" gap={2} justify="center" className="flex-wrap">
                  {fichajeState === 'idle' && (
                    <Button type="button" variant="primary" onClick={handleClockIn} disabled={isClockLoading}>
                      {isClockLoading ? 'Procesando...' : 'Fichar entrada'}
                    </Button>
                  )}
                  {fichajeState === 'working' && (
                    <>
                      <Button type="button" variant="secondary" onClick={handlePause} disabled={isClockLoading}>Pausar jornada</Button>
                      <Button type="button" variant="primary" onClick={handleClockOut} disabled={isClockLoading}>Fichar salida</Button>
                    </>
                  )}
                  {fichajeState === 'paused' && (
                    <>
                      <Button type="button" variant="secondary" onClick={handleResume} disabled={isClockLoading}>Retomar jornada</Button>
                      <Button type="button" variant="primary" onClick={handleClockOut} disabled={isClockLoading}>Fichar salida</Button>
                    </>
                  )}
                </Stack>
                {currentFichaje?.startTime && (
                  <Text variant="muted" className="text-sm">
                    Hora de entrada: <strong className="text-gray-900">{new Date(currentFichaje.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                  </Text>
                )}
                <Link href="/fichajes/control-jornada" className="text-sm font-medium text-gray-600 hover:text-black underline">
                  Ver gestión de jornada y tareas →
                </Link>
              </>
            )}
          </Stack>
        </Card>
        )}

        <Stack direction="row" justify="between" align="center" gap={2} className="flex-wrap">
          <Heading level={1} className="text-gray-900 font-bold">Fichaje</Heading>
          <Stack ref={filterPanelRef} direction="row" gap={3} align="center" className="flex-wrap shrink-0 relative">
            <Button
              variant="secondary"
              type="button"
              className="shrink-0"
              onClick={() => setShowFilterPanel((v) => !v)}
              aria-expanded={showFilterPanel}
            >
              Filtros
            </Button>
            {showFilterPanel && (
              <Card className="absolute right-0 top-full z-10 mt-2 p-4 min-w-[240px] shadow-lg border border-border-card rounded-xl">
                <Stack gap={3}>
                  <Text variant="small" className="font-semibold text-gray-900">Filtrar por fecha y departamento</Text>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Fecha</label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Departamento</label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full rounded-lg border border-border-card px-3 py-2 text-sm text-gray-900 bg-white"
                    >
                      <option value="">Todos</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <Stack direction="row" gap={2}>
                    <Button variant="secondary" type="button" className="!py-1.5" onClick={() => { setFilterDate(new Date().toISOString().split('T')[0]); setFilterDepartment(''); }}>
                      Limpiar
                    </Button>
                    <Button variant="primary" type="button" className="!py-1.5" onClick={() => { loadRows(); setShowFilterPanel(false); }}>
                      Aplicar
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            )}
            <span className="text-sm text-muted whitespace-nowrap">
              {filterDate === new Date().toISOString().split('T')[0] ? 'hoy' : filterDate} / mes actual / {today.split('/')[0]}
            </span>
            {showGestionFichajes && (
              <>
                <Button variant="primary" type="button" onClick={() => setShowCalModal(true)} className="shrink-0 px-5">
                  Añadir Calendario laboral +
                </Button>
                <Button variant="primary" type="button" onClick={() => setShowScheduleModal(true)} className="shrink-0 px-5 min-h-[43px]">
                  Crear horario +
                </Button>
                <Button variant="primary" type="button" onClick={() => setShowPermissionModal(true)} className="shrink-0 px-5 min-h-[43px]">
                  Crear Permiso +
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        <Tabs tabs={TAB_ITEMS} activeKey={activeTab} onSelect={setActiveTab} />

        {activeTab === 'fichajes' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <Table>
              <TableHead>
                <TableRow className="bg-table-header">
                  <TableTh>Usuario</TableTh>
                  <TableTh>Horas fichadas</TableTh>
                  <TableTh>Horas acumuladas</TableTh>
                  <TableTh>Departamento</TableTh>
                  <TableTh>Última localización</TableTh>
                  <TableTh>% Total horas por semana</TableTh>
                  <TableTh>% Horas mes</TableTh>
                  <TableTh>% Año</TableTh>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Stack gap={3} align="center" className="py-12">
                        <Text variant="muted">{rows.length === 0 ? 'No hay fichajes para la fecha seleccionada.' : 'Ningún resultado con los filtros aplicados.'}</Text>
                        <Link href="/fichajes/control-jornada" className="text-sm font-medium text-gray-600 hover:text-black underline">
                          Ir a control de jornada →
                        </Link>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => {
                    const horasMes = Math.round(row.minutosHoy * 4.3);
                    const horasAno = Math.round(row.minutosHoy * 52);
                    const pctSem = pct(row.minutosHoy);
                    const pctMes = pct(horasMes, HOURS_OBJETIVO * 4);
                    const pctAno = pct(horasAno, HOURS_OBJETIVO * 52);
                    return (
                      <TableRow key={`${row.userId}-${index}`}>
                        <TableCell>
                          <Stack direction="row" gap={2} align="center">
                            {getStatusBadge(row.status)}
                            <Text variant="body" as="span">{row.firstName} {row.lastName}</Text>
                          </Stack>
                        </TableCell>
                        <TableCell><Text variant="small">{formatMinutes(row.minutosHoy)}</Text></TableCell>
                        <TableCell><Text variant="muted">Xhrs por semana</Text></TableCell>
                        <TableCell>
                          <Chip variant={getRoleVariant(row.role)}>
                            {row.role?.charAt(0) + row.role?.slice(1).toLowerCase()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Text variant="small">
                            {row.location
                              ? `${row.location.lat.toFixed(4)}, ${row.location.lng.toFixed(4)} ${formatTime(row.startTime)}`
                              : '-'}
                          </Text>
                        </TableCell>
                        <TableCell><ProgressBar value={pctSem} max={110} showLabel variant={getProgressVariant(pctSem)} /></TableCell>
                        <TableCell><ProgressBar value={pctMes} max={110} showLabel variant={getProgressVariant(pctMes)} /></TableCell>
                        <TableCell><ProgressBar value={pctAno} max={110} showLabel variant={getProgressVariant(pctAno)} /></TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <Pagination
              current={1}
              total={filteredRows.length}
              pageSize={10}
            />
          </Card>
        )}

        {activeTab === 'calendarios' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <Table>
              <TableHead>
                <TableRow className="bg-table-header">
                  <TableTh>Nombre calendario</TableTh>
                  <TableTh>Descripción</TableTh>
                  <TableTh>{' '}</TableTh>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingCalendars ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : calendars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Stack gap={3} align="center" className="py-12">
                        <Text variant="muted">No hay calendarios. Crea uno con el botón superior.</Text>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  calendars.map((cal) => (
                    <TableRow key={cal.id}>
                      <TableCell><Text variant="body">{cal.name}</Text></TableCell>
                      <TableCell><Text variant="muted">—</Text></TableCell>
                      <TableCell>
                        <Button variant="secondary" type="button" className="!py-1 !text-sm" onClick={() => addToast('Repetir calendario para el siguiente año. Contacte con el administrador si necesita esta acción.', 'info')}>
                        Repetir para siguiente año
                      </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === 'horarios' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <div className="px-5 pt-4 pb-2">
              <span className="text-xs font-medium text-muted bg-muted/50 px-2 py-1 rounded">Listado meramente consultivo</span>
              <Heading level={2} className="text-gray-900 font-semibold mt-2">Horarios laborales</Heading>
            </div>
            <Table>
              <TableHead>
                <TableRow className="bg-table-header">
                  <TableTh>Nombre horario</TableTh>
                  <TableTh>No. horas laborales</TableTh>
                  <TableTh>Vacaciones</TableTh>
                  <TableTh>Días libre disposición</TableTh>
                  <TableTh>Horas/día L-V</TableTh>
                  <TableTh>Horas/día Sábado</TableTh>
                  <TableTh>Horas/semana</TableTh>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingSchedules ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : schedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Stack gap={3} align="center" className="py-12">
                        <Text variant="muted">No hay horarios. Crea uno con el botón «Crear horario +».</Text>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell><Text variant="body">{s.name}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.hoursPerYear ?? '—'}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.vacationDays ?? '—'}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.freeDisposalDays ?? '—'}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.hoursPerDayWeekdays ?? '—'}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.hoursPerDaySaturday ?? '—'}</Text></TableCell>
                      <TableCell><Text variant="muted">{s.hoursPerWeek ?? '—'}</Text></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === 'permisos' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <Table>
              <TableHead>
                <TableRow className="bg-table-header">
                  <TableTh>Nombre permiso</TableTh>
                  <TableTh>Tipo</TableTh>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingPermissions ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : permissionTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Stack gap={3} align="center" className="py-12">
                        <Text variant="muted">No hay tipos de permiso. Crea uno con el botón «Crear Permiso +».</Text>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  permissionTypes.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell><Text variant="body">{p.name}</Text></TableCell>
                      <TableCell>
                        <Chip variant={p.isPaid ? 'info' : 'default'}>{p.isPaid ? 'Retribuido' : 'No retribuido'}</Chip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        <Modal open={showCalModal} onClose={() => setShowCalModal(false)} size="s" allowClose>
          <Stack gap={4}>
            <Heading level={2} className="text-lg font-semibold text-gray-900">Crear calendario</Heading>
            <Input
              name="calendar-name"
              placeholder="Nombre del calendario"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="secondary" type="button" onClick={() => setShowCalModal(false)}>Cancelar</Button>
              <Button
                variant="primaryLg"
                type="button"
                disabled={!calendarName.trim() || calendarSubmitting}
                onClick={async () => {
                  if (!calendarName.trim()) return;
                  setCalendarSubmitting(true);
                  try {
                    await fichajesService.createCalendar({ name: calendarName.trim() });
                    setCalendarName('');
                    setShowCalModal(false);
                    loadCalendars();
                  } finally {
                    setCalendarSubmitting(false);
                  }
                }}
              >
                {calendarSubmitting ? 'Creando…' : 'Crear'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <Modal open={showScheduleModal} onClose={() => setShowScheduleModal(false)} size="m" allowClose>
          <Stack gap={4}>
            <Heading level={2} className="text-lg font-semibold text-gray-900">Nuevo Horario laboral</Heading>
            <Input name="schedule-name" label="Nombre del horario laboral" value={scheduleForm.name} onChange={(e) => setScheduleForm((s) => ({ ...s, name: e.target.value }))} placeholder="Ej. Jornada estándar" />
            <Input name="schedule-hours-year" type="number" label="No. de horas anuales" value={String(scheduleForm.hoursPerYear)} onChange={(e) => setScheduleForm((s) => ({ ...s, hoursPerYear: Number(e.target.value) || 0 }))} />
            <Input name="schedule-vacation" type="number" label="Vacaciones (días laborales)" value={String(scheduleForm.vacationDays)} onChange={(e) => setScheduleForm((s) => ({ ...s, vacationDays: Number(e.target.value) || 0 }))} />
            <Input name="schedule-free-disposal" type="number" label="Días de libre disposición (días laborales)" value={String(scheduleForm.freeDisposalDays)} onChange={(e) => setScheduleForm((s) => ({ ...s, freeDisposalDays: Number(e.target.value) || 0 }))} />
            <Input name="schedule-hours-weekdays" type="number" label="Horas por día Lunes-Viernes" value={String(scheduleForm.hoursPerDayWeekdays)} onChange={(e) => setScheduleForm((s) => ({ ...s, hoursPerDayWeekdays: Number(e.target.value) || 0 }))} />
            <Input name="schedule-hours-saturday" type="number" label="Horas por día Sábado" value={String(scheduleForm.hoursPerDaySaturday)} onChange={(e) => setScheduleForm((s) => ({ ...s, hoursPerDaySaturday: Number(e.target.value) || 0 }))} />
            <Input name="schedule-hours-week" type="number" label="Horas por semana" value={String(scheduleForm.hoursPerWeek)} onChange={(e) => setScheduleForm((s) => ({ ...s, hoursPerWeek: Number(e.target.value) || 0 }))} />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" type="button" onClick={() => setShowScheduleModal(false)}>Cancelar</Button>
              <Button
                variant="primary"
                type="button"
                disabled={!scheduleForm.name.trim() || scheduleSubmitting}
                onClick={async () => {
                  setScheduleSubmitting(true);
                  try {
                    await fichajesService.createSchedule(scheduleForm);
                    setScheduleForm({ name: '', hoursPerYear: 0, vacationDays: 0, freeDisposalDays: 0, hoursPerDayWeekdays: 0, hoursPerDaySaturday: 0, hoursPerWeek: 0 });
                    setShowScheduleModal(false);
                  } finally {
                    setScheduleSubmitting(false);
                  }
                }}
              >
                {scheduleSubmitting ? 'Creando…' : 'Crear'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <Modal open={showPermissionModal} onClose={() => setShowPermissionModal(false)} size="s" allowClose>
          <Stack gap={4}>
            <Heading level={2} className="text-lg font-semibold text-gray-900">Nuevo Permiso</Heading>
            <Input label="Nombre del permiso" value={permissionName} onChange={(e) => setPermissionName(e.target.value)} placeholder="Ej. Vacaciones" />
            <div>
              <Text variant="small" className="block mb-2 text-muted">Tipo</Text>
              <Stack direction="row" gap={2}>
                <Button variant={permissionPaid ? 'primary' : 'secondary'} type="button" onClick={() => setPermissionPaid(true)}>Retribuido +</Button>
                <Button variant={!permissionPaid ? 'primary' : 'secondary'} type="button" onClick={() => setPermissionPaid(false)}>No retribuido +</Button>
              </Stack>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" type="button" onClick={() => setShowPermissionModal(false)}>Cancelar</Button>
              <Button
                variant="primary"
                type="button"
                disabled={!permissionName.trim() || permissionSubmitting}
                onClick={async () => {
                  setPermissionSubmitting(true);
                  try {
                    await fichajesService.createPermissionType({ name: permissionName.trim(), isPaid: permissionPaid });
                    setPermissionName('');
                    setPermissionPaid(true);
                    setShowPermissionModal(false);
                    loadPermissionTypes();
                  } finally {
                    setPermissionSubmitting(false);
                  }
                }}
              >
                {permissionSubmitting ? 'Creando…' : 'Crear'}
              </Button>
            </div>
          </Stack>
        </Modal>
      </Stack>
    </PageContainer>
  );
};

export default FichajeDashboard;
