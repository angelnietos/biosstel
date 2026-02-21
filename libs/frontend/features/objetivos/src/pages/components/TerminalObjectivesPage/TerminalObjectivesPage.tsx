/**
 * @biosstel/objetivos - Objetivos Terminales Page
 * Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter, usePathname, logUserAction } from '@biosstel/platform';
import { useTerminalObjectives, useTerminalObjectivesByPeriod, patchTerminalObjectiveThunk } from '../../..';
import { patchTerminalObjective, createTerminalAssignment, deleteTerminalAssignment } from '../../../api/services/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  ConfirmModal,
  Heading,
  Text,
  Button,
  Card,
  Skeleton,
  ButtonBack,
  ButtonEdit,
  ButtonActivate,
  ButtonAddSecondary,
  CalendarIcon,
  Alert,
  Tabs,
  MinusRedIcon,
  useToast,
} from '@biosstel/ui';
import { PageContainer, Stack, Grid } from '@biosstel/ui-layout';
import type { TerminalAssignmentCard, TerminalObjectivesHeader } from '@biosstel/shared-types';
import { AssignmentCard, type AssignmentRowData } from './AssignmentCard';
import { ObjectiveProgress } from './ObjectiveProgress';
import { AssignmentSection } from '../AssignmentSection';
import { DropdownAction } from '../DropdownAction';
import { formatMonthName } from '../../../data-access/models';

// Helper for date range display
const getMonthRange = (y: number, m: number) => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${monthNames[m - 1]} ${y}`;
};

export const TerminalObjectivesPage = () => {
  const searchParams = useSearchParams();
  const detailView = searchParams.get('detail');
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<'contratos' | 'puntos'>('contratos');
  const [selectedHistoricMonth, setSelectedHistoricMonth] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useTerminalObjectives(activeTab);
  const { data: historicData, isLoading: historicLoading } = useTerminalObjectivesByPeriod(
    activeTab,
    selectedHistoricMonth
  );
  const { addToast } = useToast();
  const header = data?.header as TerminalObjectivesHeader | null | undefined;

  const departmentCards = data?.departmentCards ?? [];
  const peopleCards = data?.peopleCards ?? [];
  const inactiveObjective = data?.inactiveObjective;

  /** Objetivo actual activo (con id). Mientras carga o sin datos, se considera activo para no mostrar mensaje inactivo. */
  const active = data != null ? !!(header?.id) : true;
  const dispatch = useDispatch();
  const patchLoading = useSelector((state: { dashboard?: { patchLoading?: boolean } }) => state.dashboard?.patchLoading ?? false);
  const [isEditing, setIsEditing] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [saveConfigLoading, setSaveConfigLoading] = useState(false);
  /** Meta (objetivo) editada en formulario; se persiste al guardar configuración */
  const [editedObjective, setEditedObjective] = useState<number>(0);
  const [addAssignmentLoading, setAddAssignmentLoading] = useState(false);
  const historicContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = header?.objective ?? 0;
    setEditedObjective(typeof obj === 'number' ? obj : Number(obj) || 0);
  }, [header?.objective]);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  // Historic months (past 6 months). Key format YYYY-MM (API/DB period).
  const historicMonths = useMemo(() => {
    const months: string[] = [];
    for (let i = 1; i <= 6; i++) {
      let mm = m - i;
      let yy = y;
      if (mm < 1) { mm += 12; yy -= 1; }
      months.push(`${yy}-${String(mm).padStart(2, '0')}`);
    }
    return months;
  }, [y, m]);

  const handleActivateClick = async () => {
    if (active) {
      logUserAction('objetivos_open_deactivate_modal');
      setDeactivateModalOpen(true);
      return;
    }
    logUserAction('objetivos_activate', undefined, { type: activeTab });
    const idToActivate = inactiveObjective?.id;
    if (!idToActivate) {
      addToast('No hay objetivo inactivo para activar. Recarga la página o contacta con soporte.', 'error');
      return;
    }
    try {
      await (dispatch as (thunk: ReturnType<typeof patchTerminalObjectiveThunk>) => Promise<unknown>)(patchTerminalObjectiveThunk({ id: idToActivate, isActive: true })).unwrap();
      setDeactivateModalOpen(false);
      await refetch();
      addToast('Objetivo activado correctamente. Ya puedes editarlo.', 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al activar el objetivo.', 'error');
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!header?.id) return;
    logUserAction('objetivos_deactivate');
    try {
      await (dispatch as (thunk: ReturnType<typeof patchTerminalObjectiveThunk>) => Promise<unknown>)(patchTerminalObjectiveThunk({ id: header.id, isActive: false })).unwrap();
      setDeactivateModalOpen(false);
      refetch();
      addToast('Objetivo desactivado.', 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al desactivar.', 'error');
    }
  };

  const handleHistoricMonthSelect = (key: string) => {
    logUserAction('objetivos_historic_month', key);
    const next = selectedHistoricMonth === key ? null : key;
    setSelectedHistoricMonth(next);
    if (next) {
      requestAnimationFrame(() =>
        historicContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  };

  const handleSaveConfig = async () => {
    const id = header?.id;
    if (!id || typeof id !== 'string') {
      addToast('No hay objetivo activo para guardar.', 'error');
      return;
    }
    logUserAction('objetivos_save_config', undefined, { objective: editedObjective });
    setSaveConfigLoading(true);
    try {
      await patchTerminalObjective(id, { objective: editedObjective });
      await refetch();
      setIsEditing(false);
      addToast('Configuración guardada correctamente.', 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al guardar la configuración.', 'error');
    } finally {
      setSaveConfigLoading(false);
    }
  };

  const mapToAssignmentRows = (card: TerminalAssignmentCard): AssignmentRowData[] => {
     return card.rows.map((r, i) => ({
        id: (r as { id?: string }).id ?? `${card.title}-${i}`,
        name: r.label,
        achieved: typeof r.value === 'number' ? r.value : parseInt(String(r.value), 10) || 0,
        target: typeof r.total === 'number' ? r.total : parseInt(String(r.total), 10) || 0,
        assigned: true,
     }));
  };
  /** Id de asignación para eliminar (una card de departamento tiene una asignación = primera fila con id). */
  const getCardAssignmentId = (card: TerminalAssignmentCard): string | undefined =>
    card.rows?.[0] && 'id' in card.rows[0] ? (card.rows[0] as { id: string }).id : undefined;

  const decodedDetail = detailView ? decodeURIComponent(detailView) : null;

  const allDepartmentCards = departmentCards;
  const hasAssignments = allDepartmentCards.length > 0 || peopleCards.length > 0;

  const availableDepartments = useMemo(() => {
    const all = [
      { label: 'Administración', value: 'Administración' },
      { label: 'Logística', value: 'Logística' },
      { label: 'Soporte', value: 'Soporte' },
      { label: 'Comercial', value: 'Comercial' },
      { label: 'Tienda', value: 'Tienda' },
      { label: 'Telemarketing', value: 'Telemarketing' },
      { label: 'Departamento 2', value: 'Departamento 2' },
    ];
    const existing = new Set(allDepartmentCards.map((c) => c.title));
    return all.filter((d) => !existing.has(d.value));
  }, [allDepartmentCards]);

  const handleAddDepartment = async (value: string) => {
    const objectiveId = header?.id;
    if (!objectiveId) {
      addToast('Activa el objetivo antes de añadir departamentos.', 'error');
      return;
    }
    logUserAction('objetivos_add_department', value);
    const option = availableDepartments.find((o) => o.value === value);
    const name = option?.label ?? value;
    setAddAssignmentLoading(true);
    try {
      await createTerminalAssignment(objectiveId, { groupType: 'department', groupTitle: value });
      await refetch();
      addToast(`Departamento «${name}» añadido correctamente.`, 'success');
      if (decodedDetail && pathname) {
        router.push(pathname);
      }
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al añadir el departamento.', 'error');
    } finally {
      setAddAssignmentLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    const objectiveId = header?.id;
    if (!objectiveId) return;
    logUserAction('objetivos_remove_assignment', undefined, { assignmentId });
    try {
      await deleteTerminalAssignment(objectiveId, assignmentId);
      await refetch();
      addToast('Asignación eliminada.', 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al eliminar.', 'error');
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <Stack gap={6}>
        {isLoading ? (
          <Stack gap={4}>
            <Skeleton height="lg" className="w-1/2" />
            <Card className="p-8"><Skeleton height="lg" /></Card>
          </Stack>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : (
          <>
            {/* PAGE HEADER */}
            <div className="flex flex-wrap gap-4 items-start">
              <ButtonBack href="/home" />
              <div className="min-w-0 flex-1">
                <Heading level={1} className="text-[26px] font-semibold text-black leading-tight">
                  {decodedDetail ? `Objetivos ${decodedDetail}` : header?.title ?? 'Objetivos'}
                </Heading>
                <Text variant="small" className="text-gray-400 font-medium">
                  Mes actual: {getMonthRange(y, m)}
                </Text>
              </div>
              <div className="flex gap-4 items-center">
                {active && (
                  <>
                    <ButtonEdit
                      active={isEditing}
                      onClick={() => setIsEditing(!isEditing)}
                      cancelLabel="Cancelar"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="primary"
                        className="h-[27px] px-4 text-[12px] font-medium ml-auto"
                        onClick={handleSaveConfig}
                        disabled={saveConfigLoading}
                      >
                        {saveConfigLoading ? 'Guardando…' : 'Guardar configuración'}
                      </Button>
                    )}
                  </>
                )}
                <ButtonActivate active={active} onClick={handleActivateClick} disabled={patchLoading} />
              </div>
            </div>

            {/* Figma Base-3: mensaje rosa cuando objetivo inactivo */}
            {!active && (
              <div className="rounded-xl bg-[#FAE8FF] px-4 py-3 text-sm text-[#D946EF] font-medium border border-[#F5D0FE]">
                Objetivo inactivo. Usa «→ Activar» para editarlo y que vuelva a mostrarse en Departamentos y Usuario/as.
              </div>
            )}

            {/* MAIN CONTENT Area */}
            <div className={`flex flex-col gap-8 transition-all duration-300 ${!active ? 'grayscale opacity-40 pointer-events-none' : ''}`}>
              {/* Figma Base: tabs Contratos / Puntos */}
              {!decodedDetail && (
                <Tabs
                  tabs={[
                    { key: 'contratos', label: 'Contratos' },
                    { key: 'puntos', label: 'Puntos' },
                  ]}
                  activeKey={activeTab}
                  onSelect={(key) => setActiveTab(key as 'contratos' | 'puntos')}
                />
              )}

              {/* CURRENT PROGRESS CARD */}
              {!decodedDetail && header && (
                <Card className="px-6 py-5">
                  <ObjectiveProgress 
                    achieved={header.achieved} 
                    target={header.objective} 
                    color="blue" 
                    centered 
                    isEditing={isEditing}
                    editedTarget={editedObjective}
                    onEditedTargetChange={setEditedObjective}
                  />
                </Card>
              )}

              {decodedDetail && (
                (() => {
                  const card = [...departmentCards, ...peopleCards].find(c => c.title === decodedDetail);
                  if (!card) return <Text variant="body" className="py-10 text-center text-gray-400">Objetivo no encontrado.</Text>;
                  return (
                    <Card className="px-6 py-5">
                      <ObjectiveProgress 
                        achieved={card.totalValue} 
                        target={card.totalObjective} 
                        color="blue" 
                        centered 
                        isEditing={isEditing}
                      />
                    </Card>
                  );
                })()
              )}

              {/* ASSIGNMENTS SECTION - DEPARTMENTS */}
              <AssignmentSection
                title="Asignaciones departamento"
                headerRight={hasAssignments && isEditing && (
                  <DropdownAction
                    label="Añadir departamentos"
                    options={availableDepartments}
                    onSelect={handleAddDepartment}
                  />
                )}
              >
                {!decodedDetail ? (
                  allDepartmentCards.length > 0 ? (
                    <Grid cols={3} gap={4}>
                      {allDepartmentCards.map((card) => (
                        <AssignmentCard 
                          key={card.title} 
                          title={card.title}
                          color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                          rows={card.rows?.length ? mapToAssignmentRows(card as TerminalAssignmentCard) : []}
                          totalAchieved={card.totalValue}
                          totalTarget={card.totalObjective}
                          isEditing={isEditing}
                          assignmentId={getCardAssignmentId(card as TerminalAssignmentCard)}
                          onRemove={handleRemoveAssignment}
                          footerLabel="Plantilla Objetivos"
                          onFooterClick={() => router.push(`?detail=${encodeURIComponent(card.title)}`)}
                        />
                      ))}
                      {availableDepartments.length > 0 && (
                        <Card className="flex flex-col items-center justify-center gap-4 py-8 px-6 border-dashed border-gray-200 min-h-[140px]">
                          <DropdownAction
                            label="Añadir departamentos +"
                            options={availableDepartments}
                            onSelect={handleAddDepartment}
                            disabled={addAssignmentLoading}
                          />
                        </Card>
                      )}
                    </Grid>
                  ) : (
                    <Card className="flex flex-col items-center gap-4 py-12 px-6 border-dashed">
                      <Text variant="body" className="text-gray-500 font-medium">Sin asignaciones de departamento</Text>
                      <DropdownAction
                        label="Añadir departamentos +"
                        options={availableDepartments}
                        onSelect={handleAddDepartment}
                        disabled={addAssignmentLoading}
                      />
                    </Card>
                  )
                ) : (
                  (() => {
                    const card = allDepartmentCards.find(c => c.title === decodedDetail);
                    if (!card) return null;
                    return (
                      <Grid cols={2} gap={4} className="max-w-[800px]">
                        <AssignmentCard 
                          title={card.title}
                          color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                          rows={card.rows?.length ? mapToAssignmentRows(card as TerminalAssignmentCard) : []}
                          totalAchieved={card.totalValue}
                          totalTarget={card.totalObjective}
                          isEditing={isEditing}
                        />
                      </Grid>
                    );
                  })()
                )}
              </AssignmentSection>

              {/* ASSIGNMENTS SECTION - PEOPLE */}
              <AssignmentSection title="Asignaciones personas">
                {!decodedDetail ? (
                  peopleCards.length > 0 ? (
                    <Grid cols={3} gap={4}>
                      {peopleCards.map((card) => (
                        <AssignmentCard 
                          key={card.title} 
                          title={card.title}
                          color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                          rows={mapToAssignmentRows(card)}
                          totalAchieved={card.totalValue}
                          totalTarget={card.totalObjective}
                          isEditing={isEditing}
                          footerLabel="Ver detalle"
                          onFooterClick={() => router.push(`?detail=${encodeURIComponent(card.title)}`)}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Card className="py-10 text-center text-gray-400 border-dashed">
                      No hay asignaciones de personas.
                    </Card>
                  )
                ) : (
                  (() => {
                    const card = peopleCards.find(c => c.title === decodedDetail);
                    if (!card) return null;
                    return (
                      <Grid cols={2} gap={4} className="max-w-[800px]">
                        <AssignmentCard 
                          title={card.title}
                          color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                          rows={mapToAssignmentRows(card)}
                          totalAchieved={card.totalValue}
                          totalTarget={card.totalObjective}
                          isEditing={isEditing}
                        />
                      </Grid>
                    );
                  })()
                )}
              </AssignmentSection>

              {/* HISTORIC SECTION */}
              <AssignmentSection title="Histórico">
                <div className="flex flex-wrap gap-2 mb-4">
                  {historicMonths.map((key) => {
                    const [year, month] = key.split('-').map(Number);
                    return (
                      <ButtonAddSecondary
                        key={key}
                        showIcon={false}
                        onClick={() => handleHistoricMonthSelect(key)}
                        cssProps={`transition-colors h-[27px] font-medium ${selectedHistoricMonth === key ? '!bg-black !text-white !border-black' : ''}`}
                      >
                        <CalendarIcon className={`w-3 h-3 ${selectedHistoricMonth === key ? 'text-white' : 'text-black'}`} />
                        {formatMonthName(month, year)}
                      </ButtonAddSecondary>
                    );
                  })}
                </div>

                {selectedHistoricMonth && (
                  <div ref={historicContentRef} className="flex flex-col gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
                    <Text variant="small" className="font-bold text-gray-400 uppercase tracking-widest">
                      Mes: {formatMonthName(Number(selectedHistoricMonth.split('-')[1]) - 1, Number(selectedHistoricMonth.split('-')[0]))}
                    </Text>
                    {historicLoading ? (
                      <Card className="p-6"><Skeleton height="md" className="w-full" /></Card>
                    ) : historicData?.header && (historicData.departmentCards.length > 0 || historicData.peopleCards.length > 0) ? (
                      <>
                        <Card className="px-6 py-5">
                          <ObjectiveProgress
                            achieved={historicData.header.achieved}
                            target={historicData.header.objective}
                            color="blue"
                            centered
                            isEditing={false}
                          />
                        </Card>
                        <Grid cols={3} gap={4}>
                          {historicData.departmentCards.map((card) => (
                            <AssignmentCard
                              key={card.title}
                              title={card.title}
                              color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                              rows={card.rows.map((r, i) => ({
                                id: `${card.title}-${i}`,
                                name: r.label,
                                achieved: r.value,
                                target: r.total,
                                assigned: true,
                              }))}
                              totalAchieved={card.totalValue}
                              totalTarget={card.totalObjective}
                              isEditing={false}
                            />
                          ))}
                          {historicData.peopleCards.map((card) => (
                            <AssignmentCard
                              key={card.title}
                              title={card.title}
                              color={card.title === 'Comercial' ? 'maroon' : card.title === 'Tienda' ? 'purple' : 'teal'}
                              rows={card.rows.map((r, i) => ({
                                id: `${card.title}-${i}`,
                                name: r.label,
                                achieved: r.value,
                                target: r.total,
                                assigned: true,
                              }))}
                              totalAchieved={card.totalValue}
                              totalTarget={card.totalObjective}
                              isEditing={false}
                            />
                          ))}
                        </Grid>
                      </>
                    ) : (
                      <Card className="p-6 text-center">
                        <Text variant="body" className="text-gray-500">
                          No hay datos históricos para este mes.
                        </Text>
                      </Card>
                    )}
                  </div>
                )}
              </AssignmentSection>
            </div>
          </>
        )}

        {/* MODALS */}
        <ConfirmModal
          open={deactivateModalOpen}
          onClose={() => setDeactivateModalOpen(false)}
          onConfirm={handleConfirmDeactivate}
          icon={<MinusRedIcon className="shrink-0" />}
          title="Desactivar objetivo"
          description="Al desactivar, dejará de mostrarse en Departamentos y en Usuario/as hasta que lo reactives."
          confirmLabel="Desactivar"
          cancelLabel="Cancelar"
        />
      </Stack>
    </PageContainer>
  );
};

export default TerminalObjectivesPage;
