import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    onClose?: () => void;
    onNavigate?: () => void;
}

export default function Sidebar({collapsed,setCollapsed,onClose,onNavigate,}: SidebarProps) {

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "⌂",
        },
        {
            name: "My Resumes",
            path: "/resumes",
            icon: "▤",
        },
        {
            name: "AI Analysis",
            path: "/dashboard#analysis",
            icon: "✦",
        },
        {
            name: "Analytics",
            path: "/dashboard#analytics",
            icon: "◒",
        },
        {
            name: "AI Career Assistant",
            path: "/dashboard#assistant",
            icon: "◌",
        },
        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: "⚙",
        },
        {
            name: "Profile",
            path: "/dashboard/profile",
            icon: "◉",
        },
    ];

    return (
        <aside
            className={`flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 ${
                collapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
            }`}
        >

            {/* Sidebar Header */}
            <div
                className={`flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 ${
                    collapsed
                        ? "justify-center px-3 py-4 sm:px-4"
                        : "justify-between px-4 py-5 sm:px-6"
                }`}
            >

                {!collapsed && (
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
                                R
                            </span>
                            <div>
                                <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-lg">
                                    Resume<span className="text-cyan-500">AI</span>
                                </h2>
                                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                                    Career workspace
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapse Button */}
                <button
                    type="button"
                    onClick={() => {
                        if (onClose) {
                            onClose();
                            return;
                        }

                        setCollapsed(!collapsed);
                    }}
                    className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {collapsed ? ">" : "<"}
                </button>

            </div>


            {/* Menu */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 sm:px-3">

                {!collapsed && (
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Workspace
                    </p>
                )}

                <div className="space-y-1">

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            title={
                                collapsed
                                    ? item.name
                                    : undefined
                            }
                            className={({ isActive }) => {
                                const hashActive = item.path.includes("#")
                                    ? `${location.pathname}${location.hash}` === item.path
                                    : isActive;

                                return `group flex items-center rounded-xl transition duration-200 ${
                                    collapsed
                                        ? "justify-center px-3 py-3"
                                        : "gap-3 px-3 py-2.5"
                                } ${
                                    hashActive
                                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-cyan-500/20"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                                }`;
                            }}
                        >

                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base text-slate-500 transition group-hover:bg-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700">
                                {item.icon}
                            </span>

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            )}

                        </NavLink>

                    ))}

                </div>

            </nav>


            {/* Logout */}
            <div className="border-t border-slate-200 px-2 py-3 dark:border-slate-800 sm:px-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        collapsed
                            ? "Logout"
                            : undefined
                    }
                    className={`flex w-full items-center rounded-xl py-3 text-sm font-medium text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-red-400 ${
                        collapsed
                            ? "justify-center px-3"
                            : "gap-3 px-4"
                    }`}
                >

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base dark:bg-slate-800">
                        ↪
                    </span>

                    {!collapsed && (
                        <span>
                            Logout
                        </span>
                    )}

                </button>

            </div>

        </aside>
    );
}