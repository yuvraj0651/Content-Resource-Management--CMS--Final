import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Users", path: "/users" },
        { name: "Customers", path: "/customers" },
        { name: "Leads", path: "/leads" },
        { name: "Deals", path: "/deals" },
        { name: "Tasks", path: "/tasks" },
    ];

    return (
        <aside className="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white hidden md:flex flex-col">

            {/* Logo */}
            <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-gray-700">
                CRM Pro
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition ${isActive
                                ? "bg-blue-600"
                                : "hover:bg-gray-700"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Info */}
            <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
                © 2026 CRM System
            </div>
        </aside>
    );
};

export default Sidebar;