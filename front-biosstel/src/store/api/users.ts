import { BASEURL, ENDPOINTS } from "@/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASEURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("tokenIde");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Logs", "Users"],
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: ({ email, password }) => ({
        url: ENDPOINTS.POST.LOGIN,
        method: "POST",
        body: { email, password },
      }),
    }),
    getUsers: builder.query<any, any>({
      query: () => ({
        url: ENDPOINTS.GET.USERS,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.users.map((item: any) => ({
          id: item.id,
          name: item.nombre,
          last_name: item.apellidos,
          email: item.email,
          email_confirmed: item.confirmacion_email,
          phone: item.telefono,
          first_login: item.primer_acceso,
          created_at: item.fecha_alta,
          deleted_at: item.fecha_baja,
          profile: item.profile_id,
        }));
      },
    }),
    addUser: builder.mutation<any, any>({
      query: ({ name, email, last_name, phone, role }) => ({
        url: ENDPOINTS.POST.ADD_USER,
        method: "POST",
        body: { name, email, last_name, phone, role },
      }),
    }),
  }),
});

export const { useGetUsersQuery, useLoginMutation } = adminApi;
