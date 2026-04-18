import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>

        </div>
    );
};

export default AppLayout;