import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    tasksData: [],
    currentTask: null,
    fetchLoading: false,
    addLoading: false,
    deleteLoading: {},
    updateLoading: {},
    statusLoading: {},
    completeLoading: {},
    assignLoading: {},
    bulkLoading: false,
    currentTaskLoading: false,
    errors: null,
};

// fetch All Tasks
export const fetchAllTasks = createAsyncThunk(
    "tasks/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/tasks");
            if (!response.ok) {
                throw new Error("something went wrong while fetching all tasks data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Create New Task
export const createTask = createAsyncThunk(
    "tasks/createTask",
    async (newTask, { rejectWithValue }) => {
        const taskWithStatus = {
            ...newTask,
            status: "active",
        };
        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskWithStatus),
            });
            if (!response.ok) {
                throw new Error("something went wrong while creating new task");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Delete Existing Task
export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting existing task");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Existing Task
export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, updatedTask }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing task");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Task Status
export const updateTaskStatus = createAsyncThunk(
    "tasks/updateTaskStatus",
    async ({ id, updatedTaskStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: updatedTaskStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing task status");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// fetch Current Task
export const fetchCurrentTask = createAsyncThunk(
    "tasks/fetchCurrent",
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${taskId}`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching current tasks");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        };
    }
);

// Mark Task Complete
export const MarkTaskComplete = createAsyncThunk(
    "tasks/markComplete",
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isCompleted: true }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while marking task complete");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Assign Task To Employee
export const assignTask = createAsyncThunk(
    "tasks/assignTask",
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignedTo: userId
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to assign task");
            }

            const data = await response.json();
            return data;

        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Bulk Delete Tasks
export const bulkDeleteTasks = createAsyncThunk(
    "tasks/bulkDelete",
    async (taskIds, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                taskIds.map((id) =>
                    fetch(`http://localhost:5000/tasks/${id}`, {
                        method: "DELETE",
                    })
                )
            );
            responses.forEach((response) => {
                if (!response.ok) {
                    throw new Error("something went wrong while bulk deleting tasks");
                };
            });
            return taskIds;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const TaskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTasks.pending, (state) => {
                state.fetchLoading = true;
                state.errors = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.tasksData = action.payload;
                state.errors = null;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.fetchLoading = false;
                state.errors = action.payload;
            })
            .addCase(createTask.pending, (state) => {
                state.addLoading = true;
                state.errors = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.addLoading = false;
                state.tasksData.push(action.payload);
                state.errors = null;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.addLoading = false;
                state.errors = action.payload;
            })
            .addCase(deleteTask.pending, (state, action) => {
                const id = action.meta.arg;

                state.deleteLoading[id] = true;
                state.errors = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.tasksData = state.tasksData.filter((item) => item.id !== action.payload);
                state.errors = null;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateTask.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.tasksData = state.tasksData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateTask.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateTaskStatus.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.statusLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.tasksData = state.tasksData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(fetchCurrentTask.pending, (state) => {
                state.currentTaskLoading = true;
                state.errors = null;
            })
            .addCase(fetchCurrentTask.fulfilled, (state, action) => {
                state.currentTaskLoading = false;
                state.currentTask = action.payload;
                state.errors = null;
            })
            .addCase(fetchCurrentTask.rejected, (state, action) => {
                state.currentTaskLoading = false;
                state.errors = action.payload;
            })
            .addCase(MarkTaskComplete.pending, (state, action) => {
                const id = action.meta.arg;
                state.completeLoading[id] = true;
            })
            .addCase(MarkTaskComplete.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.completeLoading[id];

                state.tasksData = state.tasksData.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(MarkTaskComplete.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.completeLoading[id];
                state.errors = action.payload;
            })
            .addCase(assignTask.pending, (state, action) => {
                const id = action.meta.arg.id;
                state.assignLoading[id] = true;
            })
            .addCase(assignTask.fulfilled, (state, action) => {
                const id = action.meta.arg.id;
                delete state.assignLoading[id];

                state.tasksData = state.tasksData.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(assignTask.rejected, (state, action) => {
                const id = action.meta.arg.id;
                delete state.assignLoading[id];
                state.errors = action.payload;
            })
            .addCase(bulkDeleteTasks.pending, (state) => {
                state.bulkLoading = true;
                state.errors = null;
            })
            .addCase(bulkDeleteTasks.fulfilled, (state, action) => {
                state.bulkLoading = false;
                state.tasksData = state.tasksData.filter((item) => !action.payload.includes(item.id));
                state.errors = null;
            })
            .addCase(bulkDeleteTasks.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
    },
});

export default TaskSlice.reducer;