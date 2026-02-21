import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../api/services/models';
import type { CreateUserData } from '../../api/services/models';
import type { CreateClientData } from '../../api/services';
import type { UserDocumentItem, UploadDocumentData } from '../../api/services';
import {
  getUsers,
  createUser,
  createClient,
  getUserById,
  getUserDocuments,
  uploadUserDocument,
  deleteUserDocument,
  getUserDocument,
} from '../../api/services';

/** Efecto: carga lista de usuarios desde el API */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    return await getUsers();
  }
);

/** Efecto: crea usuario */
export const createUserThunk = createAsyncThunk(
  'users/createUser',
  async (data: CreateUserData) => {
    return await createUser(data);
  }
);

/** Efecto: crea cliente */
export const createClientThunk = createAsyncThunk(
  'users/createClient',
  async (data: CreateClientData) => {
    return await createClient(data);
  }
);

/** Efecto: carga un usuario por id */
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string) => {
    return await getUserById(userId);
  }
);

/** Efecto: carga documentos de un usuario */
export const fetchUserDocuments = createAsyncThunk(
  'users/fetchUserDocuments',
  async (userId: string) => {
    return await getUserDocuments(userId);
  }
);

/** Efecto: sube un documento */
export const uploadUserDocumentThunk = createAsyncThunk(
  'users/uploadUserDocument',
  async (arg: { userId: string; data: UploadDocumentData }) => {
    return await uploadUserDocument(arg.userId, arg.data);
  }
);

/** Efecto: elimina un documento */
export const deleteUserDocumentThunk = createAsyncThunk(
  'users/deleteUserDocument',
  async (arg: { userId: string; docId: string }) => {
    await deleteUserDocument(arg.userId, arg.docId);
    return arg.docId;
  }
);

/** Efecto: obtiene un documento (para descarga) */
export const fetchUserDocumentThunk = createAsyncThunk(
  'users/fetchUserDocument',
  async (arg: { userId: string; docId: string }) => {
    return await getUserDocument(arg.userId, arg.docId);
  }
);

export interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  mutationLoading: boolean;
  mutationError: string | null;
  currentUser: User | null;
  currentUserLoading: boolean;
  currentUserError: string | null;
  userDocuments: UserDocumentItem[];
  userDocumentsLoading: boolean;
  userDocumentsError: string | null;
  docMutationLoading: boolean;
  docMutationError: string | null;
  documentDownloadError: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
  mutationLoading: false,
  mutationError: null,
  currentUser: null,
  currentUserLoading: false,
  currentUserError: null,
  userDocuments: [],
  userDocumentsLoading: false,
  userDocumentsError: null,
  docMutationLoading: false,
  docMutationError: null,
  documentDownloadError: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMutationError: (state) => {
      state.mutationError = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.currentUserError = null;
    },
    clearUserDocuments: (state) => {
      state.userDocuments = [];
      state.userDocumentsError = null;
    },
    clearDocMutationError: (state) => {
      state.docMutationError = null;
    },
    clearDocumentDownloadError: (state) => {
      state.documentDownloadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error al obtener usuarios';
      })
      .addCase(createUserThunk.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.mutationLoading = false;
        state.mutationError = null;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.error.message ?? 'Error al crear usuario';
      })
      .addCase(createClientThunk.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(createClientThunk.fulfilled, (state) => {
        state.mutationLoading = false;
        state.mutationError = null;
      })
      .addCase(createClientThunk.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.error.message ?? 'Error al crear cliente';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.currentUserLoading = true;
        state.currentUserError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload ?? null;
        state.currentUserLoading = false;
        state.currentUserError = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.currentUserLoading = false;
        state.currentUserError = action.error.message ?? 'Error al cargar usuario';
      })
      .addCase(fetchUserDocuments.pending, (state) => {
        state.userDocumentsLoading = true;
        state.userDocumentsError = null;
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.userDocuments = action.payload ?? [];
        state.userDocumentsLoading = false;
        state.userDocumentsError = null;
      })
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.userDocumentsLoading = false;
        state.userDocumentsError = action.error.message ?? 'Error al cargar documentos';
      })
      .addCase(uploadUserDocumentThunk.pending, (state) => {
        state.docMutationLoading = true;
        state.docMutationError = null;
      })
      .addCase(uploadUserDocumentThunk.fulfilled, (state) => {
        state.docMutationLoading = false;
        state.docMutationError = null;
      })
      .addCase(uploadUserDocumentThunk.rejected, (state, action) => {
        state.docMutationLoading = false;
        state.docMutationError = action.error.message ?? 'Error al subir documento';
      })
      .addCase(deleteUserDocumentThunk.pending, (state) => {
        state.docMutationLoading = true;
        state.docMutationError = null;
      })
      .addCase(deleteUserDocumentThunk.fulfilled, (state, action) => {
        state.userDocuments = state.userDocuments.filter((d) => d.id !== action.payload);
        state.docMutationLoading = false;
        state.docMutationError = null;
      })
      .addCase(deleteUserDocumentThunk.rejected, (state, action) => {
        state.docMutationLoading = false;
        state.docMutationError = action.error.message ?? 'Error al eliminar documento';
      })
      .addCase(fetchUserDocumentThunk.fulfilled, (state) => {
        state.documentDownloadError = null;
      })
      .addCase(fetchUserDocumentThunk.rejected, (state, action) => {
        state.documentDownloadError = action.error.message ?? 'No se pudo descargar';
      });
  },
});

export const { clearError, clearMutationError, clearCurrentUser, clearUserDocuments, clearDocMutationError, clearDocumentDownloadError } = userSlice.actions;
export default userSlice.reducer;
