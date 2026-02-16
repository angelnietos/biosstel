export const BASEURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const ENDPOINTS = {
  POST: {
    LOGIN: '/api/auth/login',
    ADD_USER: '/api/users',
  },
  GET: {
    USERS: '/api/users',
  },
  PUT: {},
  PATCH: {},
  DELETE: {},
};
