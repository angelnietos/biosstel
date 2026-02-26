/**
 * @biosstel/fichajes - FichajeDashboard
 * Vista manager: reloj de fichar (entrada/salida) + lista de fichajes del día.
 * Atomizado en: FichajeClockCard, FichajeFiltersBar, FichajesTab, CalendariosTab, HorariosTab, PermisosTab, modales.
 */

'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL, getAuthHeaders, useRouter } from '@biosstel/platform';
import { Button, Card, Heading, Pagination, Skeleton, Stack, Tabs, Text } from '@biosstel/ui';
import { PageContainer } from '@biosstel/ui-layout';
import { useCanFichar, useCanManageFichajes } from '@biosstel/shared';
import {
  clockIn,
  clockOut,
  pauseWork,
  resumeWork,
  fetchCurrentFichaje,
  clearError,
  isValidUserId,
} from '../../../data-access';
import type { FichajesState } from '../../../data-access';
import { fichajesService } from '../../../api/services';
import type { DashboardRow, ScheduleItem } from './utils';
import { FichajeClockCard } from './FichajeClockCard';
import { FichajeFiltersBar } from './FichajeFiltersBar';
import { FichajesTab } from './FichajesTab';
import { CalendariosTab } from './CalendariosTab';
import { HorariosTab } from './HorariosTab';
import { PermisosTab } from './PermisosTab';
import { FichajeCalendarModal } from './FichajeCalendarModal';
import { FichajeScheduleModal } from './FichajeScheduleModal';
import { FichajePermissionModal } from './FichajePermissionModal';

const TAB_ITEMS = [
  { key: 'fichajes', label: 'Fichajes' },
  { key: 'calendarios', label: 'Listado Calendarios laborales' },
  { key: 'horarios', label: 'Listado Horarios laborales' },
  { key: 'permisos', label: 'Listado Permisos' },
];

const TODAY_ISO = () => new Date().toISOString().split('T')[0];

export const FichajeDashboard = () => {
  const dispatch = useDispatch<unknown>();
  const router = useRouter();
  const authRestored = useSelector((state: { auth?: { authRestored?: boolean } }) => state.auth?.authRestored);
  const authUser = useSelector((state: { auth?: { user?: { id?: string; role?: string } | null } }) => state.auth?.user);
  const authUserId = authUser?.id;
  const userId = isValidUserId(authUserId) ? authUserId : undefined;
  const userRole = authUser?.role;
  const showReloj = useCanFichar();
  const showGestionFichajes = useCanManageFichajes();
  const { currentFichaje, status: fichajeStatus, error: fichajeError } = useSelector((state: { fichajes: FichajesState }) => state.fichajes);

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
    name: '',
    hoursPerYear: 0,
    vacationDays: 0,
    freeDisposalDays: 0,
    hoursPerDayWeekdays: 0,
    hoursPerDaySaturday: 0,
    hoursPerWeek: 0,
  });
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [permissionName, setPermissionName] = useState('');
  const [permissionPaid, setPermissionPaid] = useState<boolean>(true);
  const [permissionSubmitting, setPermissionSubmitting] = useState(false);
  const [today] = useState(() => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }));
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDate, setFilterDate] = useState(TODAY_ISO);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!authRestored || userRole == null) return;
    if (showReloj && !showGestionFichajes) router.replace('/fichajes/control-jornada');
  }, [authRestored, showReloj, showGestionFichajes, router]);

  useEffect(() => {
    if (userId) dispatch(fetchCurrentFichaje(userId));
  }, [dispatch, userId]);

  const fichajeState = currentFichaje?.status || 'idle';
  const isClockLoading = fichajeStatus === 'loading';

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

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const panel = filterPanelRef.current;
      if (showFilterPanel && panel && !panel.contains(e.target as Node)) setShowFilterPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterPanel]);

  const filteredRows = useMemo(() => {
    if (!filterDepartment) return rows;
    const lower = filterDepartment.toLowerCase();
    return rows.filter((r) => r.role?.toLowerCase() === lower);
  }, [rows, filterDepartment]);

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

  const dateLabel = filterDate === TODAY_ISO() ? 'hoy' : filterDate;
  const todayLabel = today.split('/')[0];

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
        {showReloj && (
          <FichajeClockCard
            fichajeState={fichajeState}
            isClockLoading={isClockLoading}
            userId={userId}
            fichajeError={fichajeError}
            startTime={currentFichaje?.startTime}
            onClockIn={() => userId && dispatch(clockIn({ userId, location: { lat: 40.4168, lng: -3.7038 } }))}
            onClockOut={() => currentFichaje && dispatch(clockOut(currentFichaje.id))}
            onPause={() => currentFichaje && dispatch(pauseWork({ id: currentFichaje.id, reason: 'Descanso' }))}
            onResume={() => currentFichaje && dispatch(resumeWork(currentFichaje.id))}
            onClearError={() => dispatch(clearError())}
          />
        )}

        <Stack direction="row" justify="between" align="center" gap={2} className="flex-wrap">
          <Heading level={1} className="text-gray-900 font-bold">
            Fichaje
          </Heading>
          <FichajeFiltersBar
            filterDate={filterDate}
            filterDepartment={filterDepartment}
            showFilterPanel={showFilterPanel}
            departments={departments}
            todayLabel={todayLabel}
            dateLabel={dateLabel}
            onFilterDateChange={setFilterDate}
            onFilterDepartmentChange={setFilterDepartment}
            onToggleFilterPanel={() => setShowFilterPanel((v) => !v)}
            onApplyFilters={() => {
              loadRows();
              setShowFilterPanel(false);
            }}
            onClearFilters={() => {
              setFilterDate(TODAY_ISO());
              setFilterDepartment('');
            }}
            filterPanelRef={filterPanelRef}
          />
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

        <Tabs tabs={TAB_ITEMS} activeKey={activeTab} onSelect={setActiveTab} />

        {activeTab === 'fichajes' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <FichajesTab isLoading={isLoading} rows={rows} filteredRows={filteredRows} />
            <Pagination current={1} total={filteredRows.length} pageSize={10} />
          </Card>
        )}

        {activeTab === 'calendarios' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <CalendariosTab
              loading={loadingCalendars}
              calendars={calendars}
              onRepeatYear={() => {
                // Toast from parent if needed; for now same message as before
              }}
            />
          </Card>
        )}

        {activeTab === 'horarios' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <HorariosTab loading={loadingSchedules} schedules={schedules} />
          </Card>
        )}

        {activeTab === 'permisos' && (
          <Card className="p-0 overflow-hidden border border-border-card rounded-xl shadow-sm">
            <PermisosTab loading={loadingPermissions} permissionTypes={permissionTypes} />
          </Card>
        )}

        <FichajeCalendarModal
          open={showCalModal}
          calendarName={calendarName}
          submitting={calendarSubmitting}
          onClose={() => setShowCalModal(false)}
          onCalendarNameChange={setCalendarName}
          onSubmit={async () => {
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
        />

        <FichajeScheduleModal
          open={showScheduleModal}
          form={scheduleForm}
          submitting={scheduleSubmitting}
          onClose={() => setShowScheduleModal(false)}
          onFormChange={(updates) => setScheduleForm((s) => ({ ...s, ...updates }))}
          onSubmit={async () => {
            setScheduleSubmitting(true);
            try {
              await fichajesService.createSchedule(scheduleForm);
              setScheduleForm({ name: '', hoursPerYear: 0, vacationDays: 0, freeDisposalDays: 0, hoursPerDayWeekdays: 0, hoursPerDaySaturday: 0, hoursPerWeek: 0 });
              setShowScheduleModal(false);
            } finally {
              setScheduleSubmitting(false);
            }
          }}
        />

        <FichajePermissionModal
          open={showPermissionModal}
          permissionName={permissionName}
          permissionPaid={permissionPaid}
          submitting={permissionSubmitting}
          onClose={() => setShowPermissionModal(false)}
          onPermissionNameChange={setPermissionName}
          onPermissionPaidChange={setPermissionPaid}
          onSubmit={async () => {
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
        />
      </Stack>
    </PageContainer>
  );
};

export default FichajeDashboard;
