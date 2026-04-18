import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../../Services/Auth/AuthThunk";
import UserReducer from "../../Services/Users/UsersThunk";
import CustomerReducer from "../../Services/Customers/CustomersThunk";
import TaskReducer from "../../Services/Tasks/TaskThunks";
import DashboardReducer from "../../Services/Analytics/AnalyticsThunk";
import LeadReducer from "../../Services/Leads/LeadsThunk";
import DealReducer from "../../Services/Deals/DealsThunk";

const Store = configureStore({
    reducer: {
        auth: AuthReducer,
        users: UserReducer,
        customers: CustomerReducer,
        leads: LeadReducer,
        deals: DealReducer,
        tasks: TaskReducer,
        dashboard: DashboardReducer,
    }
});

export default Store;