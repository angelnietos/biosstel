import { BASEURL, ENDPOINTS } from '@biosstel/shared';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASEURL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Logs', 'Users'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: unknown; accessToken: string },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: ENDPOINTS.POST.LOGIN,
        method: 'POST',
        body: { email, password },
      }),
    }),
    getUsers: builder.query<unknown[], Record<string, unknown> | void>({
      query: (params) => {
        const args: { url: string; method: string; params?: Record<string, unknown> } = {
          url: ENDPOINTS.GET.USERS,
          method: 'GET',
        };
        if (params && typeof params === 'object' && Object.keys(params).length > 0) {
          args.params = params as Record<string, unknown>;
        }
        return args;
      },
      transformResponse: (response: { items?: unknown[] }) => {
        if (response?.items && Array.isArray(response.items)) {
          return response.items.map((item: unknown) => {
            const i = item as Record<string, unknown>;
            return {
              id: i.id,
              name: i.firstName ?? '',
              last_name: i.lastName ?? '',
              email: i.email,
              email_confirmed: true,
              phone: '',
              first_login: false,
              created_at: i.createdAt,
              deleted_at: i.updatedAt,
              profile: '',
            };
          });
        }
        return [];
      },
      providesTags: ['Users'],
    }),
    addUser: builder.mutation<
      unknown,
      { name: string; email: string; last_name: string; phone: string; role: string }
    >({
      query: ({ name, email, last_name, phone, role }) => ({
        url: ENDPOINTS.POST.ADD_USER,
        method: 'POST',
        body: {
          firstName: name,
          lastName: last_name,
          email,
          phone,
          organizationId: role,
        },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useLoginMutation, useAddUserMutation } = adminApi;
