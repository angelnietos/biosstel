import { BASEURL, ENDPOINTS } from '../../constants/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API adaptada a la nueva arquitectura
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASEURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Logs', 'Users'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: any; accessToken: string },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: ENDPOINTS.POST.LOGIN,
        method: 'POST',
        body: { email, password },
      }),
    }),
    getUsers: builder.query<any, any>({
      query: (params) => ({
        url: ENDPOINTS.GET.USERS,
        method: 'GET',
        params,
      }),
      transformResponse: (response: any) => {
        // Adaptar respuesta a la nueva estructura de API
        if (response.items) {
          return response.items.map((item: any) => ({
            id: item.id,
            name: item.firstName || '',
            last_name: item.lastName || '',
            email: item.email,
            email_confirmed: true,
            phone: '',
            first_login: false,
            created_at: item.createdAt,
            deleted_at: item.updatedAt,
            profile: '',
          }));
        }
        return [];
      },
      providesTags: ['Users'],
    }),
    addUser: builder.mutation<
      any,
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
