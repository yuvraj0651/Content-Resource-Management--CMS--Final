import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    dealsData: [],
    currentDeal: null,
    fetchLoading: false,
    addLoading: false,
    deleteLoading: {},
    updateLoading: {},
    bulkLoading: false,
    statusLoading: {},
    currentDealLoading: false,
    errors: null,
};

const BASE_URL = "https://content-resource-management-cms-final.onrender.com/api";

// fetch All Deals
export const fetchAllDeals = createAsyncThunk(
    "deals/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching all deals data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Create New Deal
export const createDeal = createAsyncThunk(
    "deals/createDeal",
    async (newDeal, { rejectWithValue }) => {
        const DealWithStatus = {
            ...newDeal,
            status: "active",
        };
        try {
            const response = await fetch(`${BASE_URL}/deals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DealWithStatus),
            });
            if (!response.ok) {
                throw new Error("something went wrong while creating new deal");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Delete Existing Deal
export const deleteDeal = createAsyncThunk(
    "deals/deleteDeal",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting existing deal");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Existing Deal
export const updateDeal = createAsyncThunk(
    "deals/updateDeal",
    async ({ id, updatedDeal }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedDeal),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing deal");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Deal Status
export const updateDealStatus = createAsyncThunk(
    "deals/updateDealStatus",
    async ({ id, updatedDealStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: updatedDealStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing deal status");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// fetch Current Deal
export const fetchCurrentDeal = createAsyncThunk(
    "deals/fetchCurrent",
    async (dealId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${dealId}`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching current deal");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        };
    }
);

// Update Deal Stage
export const updateDealStage = createAsyncThunk(
    "deals/updateDealStage",
    async ({ id, stage }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stage }),
            });

            if (!response.ok) {
                throw new Error("Failed to update deal stage");
            }

            const data = await response.json();
            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Close Deal
export const closeDeal = createAsyncThunk(
    "deals/closeDeal",
    async ({ id, result }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "closed",
                    stage: result,
                    closedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to close deal");
            }

            const data = await response.json();
            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Bulk Delete Deals
export const bulkDeleteDeals = createAsyncThunk(
    "deals/bulkDelete",
    async (dealIds, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                dealIds.map((id) =>
                    fetch(`${BASE_URL}/deals/${id}`, {
                        method: "DELETE",
                    })
                )
            );
            responses.forEach((response) => {
                if (!response.ok) {
                    throw new Error("something went wrong while bulk deleting deals data");
                };
            });
            return dealIds;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const DealSlice = createSlice({
    name: "deals",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDeals.pending, (state) => {
                state.fetchLoading = true;
                state.errors = null;
            })
            .addCase(fetchAllDeals.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.dealsData = action.payload;
                state.errors = null;
            })
            .addCase(fetchAllDeals.rejected, (state, action) => {
                state.fetchLoading = false;
                state.errors = action.payload;
            })
            .addCase(createDeal.pending, (state) => {
                state.addLoading = true;
                state.errors = null;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.addLoading = false;
                state.dealsData.push(action.payload);
                state.errors = null;
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.addLoading = false;
                state.errors = action.payload;
            })
            .addCase(deleteDeal.pending, (state, action) => {
                const id = action.meta.arg;

                state.deleteLoading[id] = true;
                state.errors = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.dealsData = state.dealsData.filter((item) => item.id !== action.payload);
                state.errors = null;
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateDeal.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.dealsData = state.dealsData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateDeal.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateDealStatus.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.statusLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateDealStatus.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.dealsData = state.dealsData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateDealStatus.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(fetchCurrentDeal.pending, (state) => {
                state.currentDealLoading = true;
                state.errors = null;
            })
            .addCase(fetchCurrentDeal.fulfilled, (state, action) => {
                state.currentDealLoading = false;
                state.currentDeal = action.payload;
                state.errors = null;
            })
            .addCase(fetchCurrentDeal.rejected, (state, action) => {
                state.currentDealLoading = false;
                state.errors = action.payload;
            })
            .addCase(updateDealStage.pending, (state, action) => {
                const id = action.meta.arg.id;
                state.statusLoading[id] = true;
            })
            .addCase(updateDealStage.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];

                state.dealsData = state.dealsData.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(updateDealStage.rejected, (state, action) => {
                const id = action.meta.arg.id;
                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(closeDeal.pending, (state, action) => {
                const id = action.meta.arg.id;
                state.statusLoading[id] = true;
            })
            .addCase(closeDeal.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];

                state.dealsData = state.dealsData.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(closeDeal.rejected, (state, action) => {
                const id = action.meta.arg.id;
                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(bulkDeleteDeals.pending, (state) => {
                state.bulkLoading = true;
                state.errors = null;
            })
            .addCase(bulkDeleteDeals.fulfilled, (state, action) => {
                state.bulkLoading = false;
                state.dealsData = state.dealsData.filter((item) => !action.payload.includes(item.id));
                state.errors = null;
            })
            .addCase(bulkDeleteDeals.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
    },
});

export default DealSlice.reducer;