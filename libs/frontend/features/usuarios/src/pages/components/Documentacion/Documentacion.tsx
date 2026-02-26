/**
 * @biosstel/usuarios - Documentacion
 * Lista de documentos del usuario + Añadir Documentación + (Figma Base-20). Subir, listar, descargar, eliminar.
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button, Input, Modal } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { UsersPageLayout } from '../../layouts';
import {
  fetchUserDocuments,
  uploadUserDocumentThunk,
  deleteUserDocumentThunk,
  fetchUserDocumentThunk,
  type UserState,
  type UserDocumentItem,
} from '../../../data-access';

export interface DocumentacionProps {
  userId?: string;
}

export const Documentacion = ({ userId }: DocumentacionProps) => {
  const dispatch = useDispatch();
  const {
    userDocuments: docs,
    userDocumentsLoading: loading,
    userDocumentsError: error,
    docMutationLoading: uploading,
    docMutationError: docMutationErrorState,
    documentDownloadError: downloadError,
  } = useSelector((state: { users: UserState }) => state.users);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocs = () => {
    if (!userId) return;
    (dispatch as (thunk: ReturnType<typeof fetchUserDocuments>) => void)(fetchUserDocuments(userId));
  };

  useEffect(() => {
    loadDocs();
  }, [userId]);

  const handleUpload = async () => {
    if (!userId || !newDocName.trim()) return;
    let contentBase64: string | undefined;
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      contentBase64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const result = (r.result as string) || '';
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64);
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });
    }
    try {
      const result = await (dispatch as (thunk: ReturnType<typeof uploadUserDocumentThunk>) => Promise<{ meta: { requestStatus: string }; payload?: unknown }>)(uploadUserDocumentThunk({
        userId,
        data: { name: newDocName.trim(), mimeType: file?.type, contentBase64 },
      }));
      if (result.meta.requestStatus === 'rejected') return;
      setNewDocName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddModal(false);
      loadDocs();
    } catch {
      // error in docMutationError from state
    }
  };

  const handleDelete = async (docId: string) => {
    if (!userId) return;
    setDeletingId(docId);
    try {
      const result = await (dispatch as (thunk: ReturnType<typeof deleteUserDocumentThunk>) => Promise<{ meta: { requestStatus: string } }>)(deleteUserDocumentThunk({ userId, docId }));
      if (result.meta.requestStatus === 'fulfilled') {
        // list updated in reducer
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (docId: string) => {
    if (!userId) return;
    try {
      const result = await (dispatch as (thunk: ReturnType<typeof fetchUserDocumentThunk>) => Promise<{ meta: { requestStatus: string }; payload?: { id: string; name: string; mimeType?: string; contentBase64?: string } }>)(fetchUserDocumentThunk({ userId, docId }));
      const doc = result.meta.requestStatus === 'fulfilled' ? result.payload : null;
      if (doc?.contentBase64) {
        const blob = new Blob([Uint8Array.from(atob(doc.contentBase64), (c) => c.charCodeAt(0))], { type: doc.mimeType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // documentDownloadError set in state
    }
  };

  const displayError = error ?? downloadError;
  const modalError = docMutationErrorState;

  const filteredDocs = docs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEmpty = !loading && !error && docs.length === 0;

  return (
    <UsersPageLayout title="Detalle Usuario – Documentación">
      <Stack gap={6}>
        {userId && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link href={`/users/${userId}`} className="text-sm font-medium text-muted hover:text-gray-900 underline">
              ← Volver al usuario
            </Link>
            <Button type="button" variant="primary" onClick={() => setShowAddModal(true)} className="shrink-0">
              Añadir Documentación +
            </Button>
          </div>
        )}

        {userId && (
          <Input
            placeholder="Buscar documentos (Q)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        )}

        <Modal open={showAddModal} onClose={() => setShowAddModal(false)} size="m">
          <Stack gap={4}>
            <Text as="h2" className="text-lg font-semibold text-gray-900">Añadir Documentación</Text>
            {(displayError || modalError) && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{modalError ?? displayError}</div>}
            <Input
              label="Nombre del documento"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="Ej. Contrato 2024"
            />
            <div>
              <Text variant="small" className="block mb-2 text-muted">Archivo (opcional)</Text>
              <input
                ref={fileInputRef}
                type="file"
                className="block w-full text-sm text-muted file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancelar</Button>
              <Button variant="primary" type="button" disabled={!newDocName.trim() || uploading} onClick={handleUpload}>
                {uploading ? 'Subiendo…' : 'Añadir'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Fecha</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-40">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>}
              {displayError && <tr><td colSpan={4} className="px-4 py-8 text-center text-red-600">{displayError}</td></tr>}
              {!loading && !error && filteredDocs.length > 0 && filteredDocs.map((d) => (
                <tr key={d.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-muted">{d.mimeType ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <Stack direction="row" gap={2}>
                      <Button type="button" variant="secondary" className="!py-1 !text-sm" onClick={() => handleDownload(d.id)}>Descargar</Button>
                      <Button type="button" variant="secondary" className="!py-1 !text-sm !text-red-600" disabled={deletingId === d.id} onClick={() => handleDelete(d.id)}>Eliminar</Button>
                    </Stack>
                  </td>
                </tr>
              ))}
              {!loading && !error && searchQuery.trim() !== '' && filteredDocs.length === 0 && docs.length > 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <Text variant="muted">Ningún documento coincide con la búsqueda.</Text>
                  </td>
                </tr>
              )}
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4">No hay documentos. Añade documentación con el botón superior.</Text>
                    <Button type="button" variant="secondary" onClick={() => setShowAddModal(true)}>Añadir Documentación +</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted italic">Click se visualiza</p>
      </Stack>
    </UsersPageLayout>
  );
};

export default Documentacion;
