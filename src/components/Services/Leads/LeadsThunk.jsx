import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    leadsData: [],
    currentLead: null,
    fetchLoading: false,
    addLoading: false,
    deleteLoading: {},
    updateLoading: {},
    bulkLoading: false,
    statusLoading: {},
    currentLeadLoading: false,
    errors: null,
};

const BASE_URL = "https://content-resource-management-cms-final.onrender.com/api";

// fetch All Leads
export const fetchAllLeads = createAsyncThunk(
    "leads/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/leads`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching all leads data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Create New Leads
export const createLead = createAsyncThunk(
    "leads/createLead",
    async (newLead, { rejectWithValue }) => {
        const LeadsWithStatus = {
            ...newLead,
            leadStatus: "active",
        };
        try {
            const response = await fetch(`${BASE_URL}/leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(LeadsWithStatus),
            });
            if (!response.ok) {
                throw new Error("something went wrong while creating new lead");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Delete Existing Lead
export const deleteLead = createAsyncThunk(
    "leads/deleteLead",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/leads/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting existing leads");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Existing Lead
export const updateLead = createAsyncThunk(
    "leads/updateLead",
    async ({ id, updatedLead }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/leads/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedLead),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing leads");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Lead Status
export const updateLeadStatus = createAsyncThunk(
    "leads/updateLeadStatus",
    async ({ id, updatedLeadStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/leads/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ leadStatus: updatedLeadStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing lead status");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// fetch Current Lead
export const fetchCurrentLead = createAsyncThunk(
    "leads/fetchCurrent",
    async (leadId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/leads/${leadId}`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching current lead");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        };
    }
);

export const convertLeadToDeal = createAsyncThunk(
    "leads/convertToDeal",
    async (lead, { rejectWithValue }) => {
        try {
            const stageMap = {
                "New": "Prospect",
                "Contacted": "Prospect",
                "Qualified": "Negotiation",
                "Closed": "Won",
            };

            const dealResponse = await fetch(`${BASE_URL}/deals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dealName: lead.fullName,
                    companyName: lead.companyName,
                    email: lead.email,
                    value: lead.dealValue || 0,
                    stage: stageMap[lead.stage] || "Prospect",
                    assignedTo: lead.assignedTo || null,
                }),
            });

            if (!dealResponse.ok) {
                throw new Error("Failed to create deal");
            }

            const newDeal = await dealResponse.json();

            const deleteResponse = await fetch(`${BASE_URL}/leads/${lead.id}`, {
                method: "DELETE",
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete lead");
            }

            return { leadId: lead.id, deal: newDeal };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Bulk Delete Leads
export const bulkDeleteLeads = createAsyncThunk(
    "leads/bulkDelete",
    async (leadIds, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                leadIds.map((ids) =>
                    fetch(`${BASE_URL}/leads/${ids}`, {
                        method: "DELETE",
                    })
                )
            );
            responses.forEach((response) => {
                if (!response.ok) {
                    throw new Error("something went wrong while bulk deleting leads data");
                };
            });
            return leadIds;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const LeadSlice = createSlice({
    name: "leads",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLeads.pending, (state) => {
                state.fetchLoading = true;
                state.errors = null;
            })
            .addCase(fetchAllLeads.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.leadsData = action.payload;
                state.errors = null;
            })
            .addCase(fetchAllLeads.rejected, (state, action) => {
                state.fetchLoading = false;
                state.errors = action.payload;
            })
            .addCase(createLead.pending, (state) => {
                state.addLoading = true;
                state.errors = null;
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.addLoading = false;
                state.leadsData.push(action.payload);
                state.errors = null;
            })
            .addCase(createLead.rejected, (state, action) => {
                state.addLoading = false;
                state.errors = action.payload;
            })
            .addCase(deleteLead.pending, (state, action) => {
                const id = action.meta.arg;

                state.deleteLoading[id] = true;
                state.errors = null;
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.leadsData = state.leadsData.filter((item) => item.id !== action.payload);
                state.errors = null;
            })
            .addCase(deleteLead.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateLead.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.leadsData = state.leadsData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateLead.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateLeadStatus.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.statusLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.leadsData = state.leadsData.map((item) => item.id === action.payload.id ? action.payload : item);
                state.errors = null;
            })
            .addCase(updateLeadStatus.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(fetchCurrentLead.pending, (state) => {
                state.currentLeadLoading = true;
                state.errors = null;
            })
            .addCase(fetchCurrentLead.fulfilled, (state, action) => {
                state.currentLeadLoading = false;
                state.currentLead = action.payload;
                state.errors = null;
            })
            .addCase(fetchCurrentLead.rejected, (state, action) => {
                state.currentLeadLoading = false;
                state.errors = action.payload;
            })
            .addCase(convertLeadToDeal.pending, (state) => {
                state.bulkLoading = true;
            })
            .addCase(convertLeadToDeal.fulfilled, (state, action) => {
                state.bulkLoading = false;

                state.leadsData = state.leadsData.filter(
                    (lead) => lead.id !== action.payload.leadId
                );
            })
            .addCase(convertLeadToDeal.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
            .addCase(bulkDeleteLeads.pending, (state) => {
                state.bulkLoading = true;
                state.errors = null;
            })
            .addCase(bulkDeleteLeads.fulfilled, (state, action) => {
                state.bulkLoading = false;
                state.leadsData = state.leadsData.filter((item) => !action.payload.includes(item.id));
                state.errors = null;
            })
            .addCase(bulkDeleteLeads.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
    },
});

export default LeadSlice.reducer;