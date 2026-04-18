import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchAllUsers } from "../../Services/Users/UsersThunk";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../../Services/Auth/AuthThunk";
import toast from "react-hot-toast";

const Header = () => {
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const { authData = [], currentUser, isAuthenticated } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success("Logged Out Successfully");
                setTimeout(() => {
                    navigate("/auth");
                }, 300);
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    };

    return (
        <header className="w-full h-16 bg-gray-50 border-b shadow-sm flex items-center justify-between px-4 md:px-6">

            {/* Left - Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search customers, leads, deals..."
                        className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />

                    <span className="absolute left-3 top-2.5 text-gray-400">
                        🔍
                    </span>
                </div>

            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="relative p-2 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {isAuthenticated && (
                    <button
                        onClick={logoutHandler}
                        className="border border-[#ccc] shadow-sm px-4 py-[0.3rem] uppercase tracking-wide font-medium rounded-md text-[0.8rem] flex items-center gap-1 cursor-pointer bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300">
                        <FiLogOut />
                        <span>
                            logout
                        </span>
                    </button>
                )}

                {/* Profile */}
                <div className="relative">

                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200 transition"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                        text-white flex items-center justify-center font-bold shadow-md">
                            {currentUser?.fullName.split("")[0]}
                        </div>
                        <div className="leading-[1.2em]">
                            <span className="hidden md:block font-medium text-gray-700">
                                {currentUser?.fullName}
                            </span>
                            <span className="text-[0.8rem] font-[500] text-gray-500 capitalize tracking-wide">{currentUser?.role}</span>
                        </div>
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl overflow-hidden">

                            <NavLink className="block px-4 py-2 hover:bg-gray-100">
                                Profile
                            </NavLink>

                            <NavLink className="block px-4 py-2 hover:bg-gray-100">
                                Settings
                            </NavLink>

                            <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500">
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>
        </header>
    );
};

export default Header;