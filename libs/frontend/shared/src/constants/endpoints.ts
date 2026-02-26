import { API_BASE_URL } from '@biosstel/platform';

export const BASEURL = API_BASE_URL;

export const ENDPOINTS = {
  POST: {
    LOGIN: '/auth/login',
    ADD_USER: '/users',
    PRODUCTO: '/productos',
    INVENTORY_ITEM: '/inventory',
  },
  GET: {
    USERS: '/users',
    PRODUCTOS: '/productos',
    INVENTORY: '/inventory',
    REPORTS_SUMMARY: '/reports/summary',
    EMPRESA: '/empresa',
    OPERACIONES: '/operaciones',
    ALERTAS: '/alertas',
  },
  PATCH: {
    PRODUCTO: (id: string) => `/productos/${id}`,
    INVENTORY_ITEM: (id: string) => `/inventory/${id}`,
  },
  DELETE: {
    PRODUCTO: (id: string) => `/productos/${id}`,
    INVENTORY_ITEM: (id: string) => `/inventory/${id}`,
  },
  PUT: {} as Record<string, string>,
};
