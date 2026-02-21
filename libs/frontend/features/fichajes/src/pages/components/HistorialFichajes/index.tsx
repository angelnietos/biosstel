'use client';

import { useSelector } from 'react-redux';
import type { Fichaje } from '../../../api/types';
import type { FichajesState } from '../../../data-access';
import { Heading, StatusBadge, Table, TableHead, TableBody, TableRow, TableTh, TableCell } from '@biosstel/ui';

export const HistorialFichajes = () => {
    // Use any to avoid circular dependency issues for now
    const { history } = useSelector((state: any) => state.fichajes as FichajesState);

    const formatTime = (isoString?: string) => {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (start: string, end?: string) => {
        if (!end) return '—';
        const duration = new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    const getStatusProps = (status: string): { label: string; variant: 'success' | 'warning' | 'error' | 'muted' } => {
        switch (status) {
            case 'working': return { label: 'En curso', variant: 'success' };
            case 'paused': return { label: 'Pausado', variant: 'warning' };
            case 'finished': return { label: 'Completado', variant: 'muted' };
            default: return { label: 'Desconocido', variant: 'error' };
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden mt-2">
            <div className="px-8 py-6 border-b border-border-card">
                <Heading level={2} className="text-[18px] font-bold text-black">Historial de fichajes</Heading>
            </div>
            
            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHead>
                        <TableRow className="bg-white">
                            <TableTh className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Fecha</TableTh>
                            <TableTh className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Entrada</TableTh>
                            <TableTh className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Salida</TableTh>
                            <TableTh className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">Duración</TableTh>
                            <TableTh className="px-8 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">Estado</TableTh>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="px-8 py-10 text-center text-sm text-gray-400 font-medium">
                                    No hay registros recientes en el historial
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map((fichaje: Fichaje, index: number) => {
                                const statusInfo = getStatusProps(fichaje.status);
                                return (
                                    <TableRow key={`${fichaje.id}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 border-[#F3F4F6]">
                                            {new Date(fichaje.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium border-[#F3F4F6]">
                                            {formatTime(fichaje.startTime)}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium border-[#F3F4F6]">
                                            {formatTime(fichaje.endTime)}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 whitespace-nowrap text-sm text-gray-900 font-bold border-[#F3F4F6]">
                                            {calculateDuration(fichaje.startTime, fichaje.endTime)}
                                        </TableCell>
                                        <TableCell className="px-8 py-5 whitespace-nowrap text-center border-[#F3F4F6]">
                                            <StatusBadge 
                                                label={statusInfo.label} 
                                                status={statusInfo.variant} 
                                                className="scale-110"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

