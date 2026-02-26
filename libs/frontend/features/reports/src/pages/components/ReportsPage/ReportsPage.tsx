'use client';

import { useEffect } from 'react';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Text, Card, Button } from '@biosstel/ui';
import { useReports } from '../../../data-access';

export function ReportsPage() {
  const { data, loading, error, fetchSummary } = useReports();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const loadData = fetchSummary;

  return (
    <PageContainer>
      <Stack gap={6}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={1} className="text-gray-900 font-bold">
            Reportes
          </Heading>
          <Button
            type="button"
            variant="secondary"
            onClick={loadData}
            className="h-[43px] font-semibold border-border-card"
          >
            Refrescar
          </Button>
        </header>

        {loading && (
          <Text variant="muted" className="text-muted">
            Cargando...
          </Text>
        )}
        {error && (
          <Card className="p-5 border border-border-card shadow-sm rounded-xl border-red-200 bg-red-50">
            <Text variant="body" className="text-red-700">
              {error}
            </Text>
          </Card>
        )}
        {data && !loading && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.summary.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 border border-border-card shadow-sm rounded-xl"
                >
                  <Stack gap={2}>
                    <Text variant="small" className="text-muted">
                      {item.label}
                    </Text>
                    <span className="text-2xl font-bold text-gray-900">
                      {item.value} {item.unit ?? ''}
                    </span>
                  </Stack>
                </Card>
              ))}
            </div>
            <Text variant="small" className="text-gray-300">
              Generado: {new Date(data.generatedAt).toLocaleString()}
            </Text>
          </>
        )}
      </Stack>
    </PageContainer>
  );
}
