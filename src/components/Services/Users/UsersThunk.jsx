import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    usersData: [],
    fetchLoading: false,
    addLoading: false,
    deleteLoading: {},
    updateLoading: {},
    bulkLoading: false,
    statusLoading: {},
    roleLoading: {},
    errors: null,
};

const BASE_URL = "https://content-resource-management-cms-final.onrender.com/api";

// fetch All Users
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching all users data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Add New User
export const AddUser = createAsyncThunk(
    "users/addUser",
    async (newUser, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) {
                throw new Error("something went wrong while adding new user");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Delete Existing User
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting existing user");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Existing User
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, updatedUser }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing user");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update User Status
export const updateUserStatus = createAsyncThunk(
    "users/updateUserStatus",
    async ({ id, updatedStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: updatedStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing user status");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update User Role
export const updateUserRole = createAsyncThunk(
    "users/updateUserRole",
    async ({ id, updatedRole }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: updatedRole }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing user role");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Bulk Delete Users
export const bulkDeleteUsers = createAsyncThunk(
    "users/bulkDelete",
    async (userIds, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                userIds.map((ids) => 
                    fetch(`${BASE_URL}/auth/${ids}`, {
                        method: "DELETE",
                    })
                )
            );
            responses.forEach((response) => {
                if (!response.ok) {
                    throw new Error("something went wrong while bulk deleting users data");
                };
            });
            return userIds;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const UserSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.fetchLoading = true;
                state.errors = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.usersData = action.payload;
                state.errors = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.fetchLoading = false;
                state.errors = action.payload;
            })
            .addCase(AddUser.pending, (state) => {
                state.addLoading = true;
                state.errors = null;
            })
            .addCase(AddUser.fulfilled, (state, action) => {
                state.addLoading = false;
                state.usersData.push(action.payload);
                state.errors = null;
            })
            .addCase(AddUser.rejected, (state, action) => {
                state.addLoading = false;
                state.errors = action.payload;
            })
            .addCase(deleteUser.pending, (state, action) => {
                const id = action.meta.arg;

                state.deleteLoading[id] = true;
                state.errors = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.usersData = state.usersData.filter((item) => item.id !== action.payload);
                state.errors = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateUser.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.usersData = state.usersData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateUserStatus.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.statusLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.usersData = state.usersData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateUserRole.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.roleLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.roleLoading[id];
                state.usersData = state.usersData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.roleLoading[id];
                state.errors = action.payload;
            })
            .addCase(bulkDeleteUsers.pending, (state) => {
                state.bulkLoading = true;
                state.errors = null;
            })
            .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
                state.bulkLoading = false;
                state.usersData = state.usersData.filter((item) => !action.payload.includes(item.id));
                state.errors = null;
            })
            .addCase(bulkDeleteUsers.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
    },
});

export default UserSlice.reducer;