import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const storedAuth = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

export const initialState = {
    authData: storedAuth?.user || [],
    currentUser: storedAuth?.currentUser || null,
    isAuthenticated: storedAuth?.isAuthenticated || false,
    token: storedAuth?.token || null,
    loginLoading: false,
    registerLoading: false,
    currentUserLoading: false,
    error: null,
};

const BASE_URL = "https://content-resource-management-cms-final.onrender.com/api";

// login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userResponse = await fetch(`${BASE_URL}/auth`);
            if (!userResponse.ok) {
                throw new Error("something went wrong while logging in user");
            };

            const users = await userResponse.json();

            const existingUser = users.find((user) => user.email === email && user.password === password);

            if (!existingUser) {
                throw new Error("Invalid Credentials");
            };

            return existingUser;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// register new user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (newUser, { rejectWithValue }) => {
        const newUserWithData = {
            ...newUser,
            status: "active",
            role: "user",
            createdAt: new Date().toISOString(),
        };
        try {
            const userResponse = await fetch(`${BASE_URL}/auth`);
            if (!userResponse.ok) {
                throw new Error("something went wrong while fetching users data");
            };
            const users = await userResponse.json();

            const existingUser = users.find((user) => user.email === newUser.email);

            if (existingUser) {
                throw new Error("User Already Exists");
            };

            const response = await fetch(`${BASE_URL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUserWithData),
            });
            if (!response.ok) {
                throw new Error("something went wrong while registering new user");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// fetch Current User
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/${userId}`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching current user data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.authData = [];
            state.currentUser = null;
            state.isAuthenticated = false;
            state.token = null;
            state.currentUserLoading = false;
            state.loginLoading = false;
            state.registerLoading = false;
            state.error = null;

            localStorage.removeItem("auth");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const fakeToken = Math.random().toString(36).slice(2);

                state.loginLoading = false;
                state.authData = action.payload;
                state.currentUser = action.payload;
                state.isAuthenticated = true;
                state.token = fakeToken;
                state.error = null;

                localStorage.setItem("auth", JSON.stringify({
                    user: state.authData,
                    isAuthenticated: true,
                    token: fakeToken,
                    currentUser: state.currentUser,
                }));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginLoading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.registerLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const fakeToken = Math.random().toString(36).slice(2);

                state.registerLoading = false;
                state.authData.push(action.payload);
                state.isAuthenticated = true;
                state.token = fakeToken;
                state.error = null;

                localStorage.setItem("auth", JSON.stringify({
                    user: state.authData,
                    isAuthenticated: true,
                    token: fakeToken,
                    currentUser: state.currentUser,
                }));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.currentUserLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                const fakeToken = Math.random().toString(36).slice(2);

                state.currentUserLoading = false;
                state.currentUser = action.payload;
                state.isAuthenticated = true;
                state.token = state.token || null;
                state.error = null;

                localStorage.setItem("auth", JSON.stringify({
                    user: state.authData,
                    isAuthenticated: true,
                    token: fakeToken,
                    currentUser: state.currentUser,
                }));
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.currentUserLoading = false;
                state.error = action.payload;
            })
    },
});

export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;