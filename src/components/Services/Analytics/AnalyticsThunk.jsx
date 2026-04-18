import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    allStats: [],
    allRevenue: [],
    allUserGrowth: [],
    allLeadConservation: [],
    statsLoading: false,
    revenueLoading: false,
    userGrowthLoading: false,
    leadStatsLoading: false,
    error: null,
};

// Fetch All Stats
export const fetchAllStats = createAsyncThunk(
    "stats/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/dashboard");
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard stats");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Fetch All Revenue Charts
export const fetchAllRevenueCharts = createAsyncThunk(
    "charts/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/dashboard");
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard revenue");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Fetch All USer Growth Data
export const fetchAllUserGrowthData = createAsyncThunk(
    "userGrowth/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/dashboard");
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard user growth");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Fetch All Lead Conversion Stats
export const fetchAllLeadConversionStats = createAsyncThunk(
    "leadConversionStats/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/dashboard");
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard Lead Conversion Stats");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const DashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllStats.pending, (state) => {
                state.statsLoading = true;
                state.error = null;
            })
            .addCase(fetchAllStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.allStats = action.payload;
                state.error = null;
            })
            .addCase(fetchAllStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllRevenueCharts.pending, (state) => {
                state.revenueLoading = true;
                state.error = null;
            })
            .addCase(fetchAllRevenueCharts.fulfilled, (state, action) => {
                state.revenueLoading = false;
                state.allRevenue = action.payload;
                state.error = null;
            })
            .addCase(fetchAllRevenueCharts.rejected, (state, action) => {
                state.revenueLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllUserGrowthData.pending, (state) => {
                state.userGrowthLoading = true;
                state.error = null;
            })
            .addCase(fetchAllUserGrowthData.fulfilled, (state, action) => {
                state.userGrowthLoading = false;
                state.allUserGrowth = action.payload;
                state.error = null;
            })
            .addCase(fetchAllUserGrowthData.rejected, (state, action) => {
                state.userGrowthLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllLeadConversionStats.pending, (state) => {
                state.leadStatsLoading = true;
                state.error = null;
            })
            .addCase(fetchAllLeadConversionStats.fulfilled, (state, action) => {
                state.leadStatsLoading = false;
                state.allLeadConservation = action.payload;
                state.error = null;
            })
            .addCase(fetchAllLeadConversionStats.rejected, (state, action) => {
                state.leadStatsLoading = false;
                state.error = action.payload;
            })
    },
});

export default DashboardSlice.reducer;