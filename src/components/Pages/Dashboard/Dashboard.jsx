import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../Services/Users/UsersThunk";
import { fetchAllLeadConversionStats } from "../../Services/Analytics/AnalyticsThunk";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import AddUserModal from "../../UI/Modals/UserModals/AddUser/AddUserModal";
import AddLeadModal from "../../UI/Modals/LeadModal/AddLeadModal";
import CreateDealModal from "../../UI/Modals/DealModal/CreateDealModal";

const Dashboard = () => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);
    const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllLeadConversionStats());
    }, [dispatch]);

    const { usersData = [] } = useSelector((state) => state.users);
    const { allLeadConservation = [] } = useSelector((state) => state.dashboard);

    const toggleAddUserModal = () => {
        setIsAddUserModalOpen((prev) => !prev);
    };

    const toggleCreateLeadModal = () => {
        setIsCreateLeadModalOpen((prev) => !prev)
    };

    const toggleCreateDealModal = () => {
        setIsCreateDealModalOpen((prev) => !prev);
    };

    const totalUsers = usersData?.length || 1;
    const totalLeads =
        (allLeadConservation?.leadStats?.new || 0) +
        (allLeadConservation?.leadStats?.contacted || 0) +
        (allLeadConservation?.leadStats?.converted || 0) +
        (allLeadConservation?.leadStats?.lost || 0);

    const totalRevenue = allLeadConservation?.stats?.revenue || 0;

    const getWeeklyUsers = (users) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const result = days.map((day) => ({
            name: day,
            users: 0,
        }));

        users.forEach((user) => {
            if (!user.createdAt) return;

            const date = new Date(user.createdAt);
            const dayIndex = date.getDay();

            result[dayIndex].users += 1;
        });
        return result;
    };

    const weeklyUsersData = getWeeklyUsers(usersData);

    // KPI Cards
    const stats = [
        { title: "Total Users", value: totalUsers, color: "bg-blue-500" },
        { title: "Total Leads", value: totalLeads, color: "bg-purple-500" },
        { title: "Deals Closed", value: "0", color: "bg-green-500" },
        { title: "Revenue", value: totalRevenue, color: "bg-yellow-500" },
    ];

    // Line Chart
    const lineData = [
        { name: "Jan", revenue: 2000 },
        { name: "Feb", revenue: 3000 },
        { name: "Mar", revenue: 2500 },
        { name: "Apr", revenue: 4000 },
        { name: "May", revenue: 3500 },
        { name: "Jun", revenue: 5000 },
    ];

    // Pie Chart
    const pieData = [
        { name: "Active Deals", value: 400 },
        { name: "Pending", value: 300 },
        { name: "Closed", value: 300 },
    ];

    const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

    // Area Chart
    const areaData = [
        { name: "Jan", users: 200 },
        { name: "Feb", users: 300 },
        { name: "Mar", users: 250 },
        { name: "Apr", users: 400 },
        { name: "May", users: 600 },
    ];

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>
                <p className="text-gray-500">
                    CRM analytics overview & performance insights
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {stats.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-2"
                    >
                        <div className={`w-10 h-10 rounded-lg ${item.color}`}></div>
                        <h2 className="text-sm text-gray-500">{item.title}</h2>
                        <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                ))}

            </div>

            {/* BAR + LINE CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">Weekly Users</h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyUsersData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* LINE */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">Revenue Trend</h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* PIE + AREA CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PIE */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">Deals Distribution</h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                label
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* AREA */}
                <div className="lg:col-span-2 bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">User Growth</h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />

                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                fill="url(#colorUv)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* ACTIVITY + ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ACTIVITY */}
                <div className="lg:col-span-2 bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">Recent Activity</h2>

                    <div className="space-y-3 text-sm">
                        <p>🟢 New lead added by Admin</p>
                        <p>🔵 Deal successfully closed</p>
                        <p>🟣 User profile updated</p>
                        <p>🟡 Task marked as completed</p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="font-semibold mb-4">Quick Actions</h2>

                    <div className="space-y-3">
                        <button
                            onClick={toggleAddUserModal}
                            className="w-full py-2 bg-blue-500 text-white rounded-lg">
                            + Add User
                        </button>
                        <button
                            onClick={toggleCreateLeadModal}
                            className="w-full py-2 bg-green-500 text-white rounded-lg">
                            + Add Lead
                        </button>
                        <button
                            onClick={toggleCreateDealModal}
                            className="w-full py-2 bg-purple-500 text-white rounded-lg">
                            + Create Deal
                        </button>
                    </div>
                </div>

            </div>
            {
                isAddUserModalOpen && (
                    <div>
                        <AddUserModal onClose={toggleAddUserModal} />
                    </div>
                )
            }
            {
                isCreateLeadModalOpen && (
                    <div>
                        <AddLeadModal onClose={toggleCreateLeadModal} />
                    </div>
                )
            }
            {
                isCreateDealModalOpen && (
                    <div>
                        <CreateDealModal onClose={toggleCreateDealModal} />
                    </div>
                )
            }
        </div>
    );
};

export default Dashboard;