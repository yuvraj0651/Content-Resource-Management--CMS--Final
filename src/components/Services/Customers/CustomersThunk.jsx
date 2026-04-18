import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initialState = {
    customersData: [],
    currentCustomer: null,
    fetchLoading: false,
    addLoading: false,
    deleteLoading: {},
    updateLoading: {},
    statusLoading: {},
    typeLoading: {},
    currentCustomerLoading: false,
    bulkLoading: false,
    errors: null,
};

const BASE_URL = "https://content-resource-management-cms-final.onrender.com/api";

// fetch All Customers
export const fetchAllCustomers = createAsyncThunk(
    "customers/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching all customers data");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    },
);

// Add New Customer
export const AddCustomer = createAsyncThunk(
    "customers/addCustomer",
    async (newCustomer, { rejectWithValue }) => {
        const CustomerWithUser = {
            ...newCustomer,
            assignedTo: 1,
        };
        try {
            const response = await fetch(`${BASE_URL}/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(CustomerWithUser),
            });
            if (!response.ok) {
                throw new Error("something went wrong while adding new customer");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Delete Existing Customer
export const deleteCustomer = createAsyncThunk(
    "customers/deleteCustomer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("something went wrong while deleting existing customer");
            };
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Existing Customer
export const updateCustomer = createAsyncThunk(
    "customers/updateCustomer",
    async ({ id, updatedCustomer }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCustomer),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating existing customer");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Fetch Current Customer
export const fetchCurrentCustomer = createAsyncThunk(
    "customers/fetchCurrent",
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/customers/${customerId}`);
            if (!response.ok) {
                throw new Error("something went wrong while fetching current customer");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        };
    }
);

// Assign User Tp Particular Customer
export const assignCustomerToUser = createAsyncThunk(
    "customers/assignCustomer",
    async ({ customerId, userId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignedTo: userId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to assign customer");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Bulk Delete Customers
export const bulkDeleteCustomers = createAsyncThunk(
    "customers/bulkDelete",
    async (customerIds, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                customerIds.map((id) =>
                    fetch(`${BASE_URL}/customers/${id}`, {
                        method: "DELETE",
                    })
                )
            );
            responses.forEach((response) => {
                if (!response.ok) {
                    throw new Error("something went wrong while bulk deleting customers data");
                };
            });
            return customerIds;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Customer Status
export const updateCustomerStatus = createAsyncThunk(
    "customers/updateStatus",
    async ({ customerId, updatedStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: updatedStatus }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating customers status");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Update Customer Role
export const updateCustomerType = createAsyncThunk(
    "customers/updateType",
    async ({ customerId, updatedType }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type: updatedType }),
            });
            if (!response.ok) {
                throw new Error("something went wrong while updating customers type");
            };
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const CustomerSlice = createSlice({
    name: "customers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCustomers.pending, (state) => {
                state.fetchLoading = true;
                state.errors = null;
            })
            .addCase(fetchAllCustomers.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.customersData = action.payload;
                state.errors = null;
            })
            .addCase(fetchAllCustomers.rejected, (state, action) => {
                state.fetchLoading = false;
                state.errors = action.payload;
            })
            .addCase(AddCustomer.pending, (state) => {
                state.addLoading = true;
                state.errors = null;
            })
            .addCase(AddCustomer.fulfilled, (state, action) => {
                state.addLoading = false;
                state.customersData.push(action.payload);
                state.errors = null;
            })
            .addCase(AddCustomer.rejected, (state, action) => {
                state.addLoading = false;
                state.errors = action.payload;
            })
            .addCase(deleteCustomer.pending, (state, action) => {
                const id = action.meta.arg;

                state.deleteLoading[id] = true;
                state.errors = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.customersData = state.customersData.filter((item) => item.id !== action.payload);
                state.errors = null;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                const id = action.meta.arg;

                delete state.deleteLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateCustomer.pending, (state, action) => {
                const id = action.meta.arg.id;

                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.customersData = state.customersData.map((item) =>
                    String(item.id) === String(action.payload.id)
                        ? { ...item, ...action.payload }
                        : item
                );
                state.errors = null;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                const id = action.meta.arg.id;

                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateCustomerStatus.pending, (state, action) => {
                const id = action.meta.arg.customerId;

                state.statusLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateCustomerStatus.fulfilled, (state, action) => {
                const id = action.meta.arg.customerId;

                delete state.statusLoading[id];
                state.customersData = state.customersData.map((item) =>
                    String(item.id) === String(action.payload.id)
                        ? { ...item, ...action.payload }
                        : item
                );
                state.errors = null;
            })
            .addCase(updateCustomerStatus.rejected, (state, action) => {
                const id = action.meta.arg.customerId;

                delete state.statusLoading[id];
                state.errors = action.payload;
            })
            .addCase(updateCustomerType.pending, (state, action) => {
                const id = action.meta.arg.customerId;

                state.typeLoading[id] = true;
                state.errors = null;
            })
            .addCase(updateCustomerType.fulfilled, (state, action) => {
                const id = action.meta.arg.customerId;

                delete state.typeLoading[id];
                state.customersData = state.customersData.map((item) =>
                    String(item.id) === String(action.payload.id)
                        ? { ...item, ...action.payload }
                        : item
                );
                state.errors = null;
            })
            .addCase(updateCustomerType.rejected, (state, action) => {
                const id = action.meta.arg.customerId;

                delete state.typeLoading[id];
                state.errors = action.payload;
            })
            .addCase(fetchCurrentCustomer.pending, (state) => {
                state.currentCustomerLoading = true;
                state.errors = null;
            })
            .addCase(fetchCurrentCustomer.fulfilled, (state, action) => {
                state.currentCustomerLoading = false;
                state.currentCustomer = action.payload;
                state.errors = null;
            })
            .addCase(fetchCurrentCustomer.rejected, (state, action) => {
                state.currentCustomerLoading = false;
                state.errors = action.payload;
            })
            .addCase(assignCustomerToUser.pending, (state, action) => {
                const id = action.meta.arg.customerId;
                state.updateLoading[id] = true;
                state.errors = null;
            })
            .addCase(assignCustomerToUser.fulfilled, (state, action) => {
                const id = action.meta.arg.customerId;
                delete state.updateLoading[id];

                state.customersData = state.customersData.map((item) =>
                    String(item.id) === String(action.payload.id) ? action.payload : item
                );
            })
            .addCase(assignCustomerToUser.rejected, (state, action) => {
                const id = action.meta.arg.customerId;
                delete state.updateLoading[id];
                state.errors = action.payload;
            })
            .addCase(bulkDeleteCustomers.pending, (state) => {
                state.bulkLoading = true;
                state.errors = null;
            })
            .addCase(bulkDeleteCustomers.fulfilled, (state, action) => {
                state.bulkLoading = false;
                state.customersData = state.customersData.filter((item) => !action.payload.includes(item.id));
                state.errors = null;
            })
            .addCase(bulkDeleteCustomers.rejected, (state, action) => {
                state.bulkLoading = false;
                state.errors = action.payload;
            })
    },
});

export default CustomerSlice.reducer;