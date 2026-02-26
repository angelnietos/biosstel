import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FichajesState } from '../models';
import { fichajesService, isValidUserId } from '../../api/services';

export const fetchFichajes = createAsyncThunk(
    'fichajes/fetchFichajes',
    async (userId: string) => {
        return await fichajesService.getFichajes(userId);
    }
);

export const fetchTasks = createAsyncThunk(
    'fichajes/fetchTasks',
    async (userId: string) => {
        return await fichajesService.getTasks(userId);
    }
);

export const clockIn = createAsyncThunk(
    'fichajes/clockIn',
    async (data: { userId: string; location?: { lat: number; lng: number } }, thunkAPI) => {
        const userId = data?.userId != null ? String(data.userId).trim() : '';
        if (isValidUserId(userId)) {
            return await fichajesService.clockIn({ userId, location: data?.location });
        }
        return thunkAPI.rejectWithValue('userId es obligatorio para fichar entrada');
    }
);

export const clockOut = createAsyncThunk(
    'fichajes/clockOut',
    async (fichajeId: string) => {
        return await fichajesService.clockOut(fichajeId);
    }
);

export const pauseWork = createAsyncThunk(
    'fichajes/pauseWork',
    async ({ id, reason }: { id: string; reason?: string }) => {
        return await fichajesService.pause(id, reason);
    }
);

export const resumeWork = createAsyncThunk(
    'fichajes/resumeWork',
    async (id: string) => {
        return await fichajesService.resume(id);
    }
);

export const addTask = createAsyncThunk(
    'fichajes/addTask',
    async (data: { userId: string; title: string; description?: string }) => {
        return await fichajesService.addTask(data);
    }
);

export const completeTask = createAsyncThunk(
    'fichajes/completeTask',
    async ({ id, completed }: { id: string; completed: boolean }) => {
        return await fichajesService.updateTask(id, { completed });
    }
);

export const deleteTask = createAsyncThunk(
    'fichajes/deleteTask',
    async (id: string) => {
        await fichajesService.deleteTask(id);
        return id;
    }
);

export const fetchTaskById = createAsyncThunk(
    'fichajes/fetchTaskById',
    async (taskId: string) => {
        return await fichajesService.getTaskById(taskId);
    }
);

export const fetchCurrentFichaje = createAsyncThunk(
    'fichajes/fetchCurrentFichaje',
    async (userId: string) => {
        return await fichajesService.getCurrentFichaje(userId);
    }
);

const initialState: FichajesState = {
  currentFichaje: null,
  history: [],
  tasks: [],
  selectedTask: null,
  permisos: [],
  status: 'idle',
  error: null,
};

const fichajesSlice = createSlice({
  name: 'fichajes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFichajes.fulfilled, (state, action) => {
        state.history = action.payload;
    });
    builder.addCase(fetchCurrentFichaje.fulfilled, (state, action) => {
        state.currentFichaje = action.payload ?? null;
    });

    builder.addCase(clockIn.pending, (state) => {
        state.status = 'loading';
    });
    builder.addCase(clockIn.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentFichaje = action.payload;
    });
    builder.addCase(clockIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (typeof action.payload === 'string' ? action.payload : null) || action.error.message || 'Error al fichar entrada';
    });

    builder.addCase(clockOut.pending, (state) => {
        state.status = 'loading';
    });
    builder.addCase(clockOut.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentFichaje = null;
        state.history.unshift(action.payload);
    });

    builder.addCase(pauseWork.fulfilled, (state, action) => {
        state.currentFichaje = action.payload;
    });
    builder.addCase(resumeWork.fulfilled, (state, action) => {
        state.currentFichaje = action.payload;
    });

    builder.addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.status = 'idle';
        state.error = null;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al cargar tareas';
    });
    builder.addCase(fetchTaskById.pending, (state) => {
        state.status = 'loading';
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload ?? null;
        state.status = 'idle';
        state.error = null;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al cargar la tarea';
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
    });
    builder.addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
            state.tasks[index] = action.payload;
        }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
    });
  },
});

export const { clearError, clearSelectedTask } = fichajesSlice.actions;
export default fichajesSlice.reducer;
