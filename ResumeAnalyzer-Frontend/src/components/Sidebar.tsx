import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiBarChart2,
    FiChevronLeft,
    FiChevronRight,
    FiFileText,
    FiGrid,
    FiLogOut,
    FiSettings,
    FiUser,
    FiZap,
    FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    onClose?: () => void;
    onNavigate?: () => void;
}

const menuItems: {
    name: string;
    path: string;
    icon: IconType;
    iconColor: string;
    iconBackground: string;
}[] = [
    { name: "Dashboard", path: "/dashboard", icon: FiGrid, iconColor: "text-violet-600 dark:text-violet-300", iconBackground: "bg-violet-100 dark:bg-violet-950/60" },
    { name: "My Resumes", path: "/resumes", icon: FiFileText, iconColor: "text-blue-600 dark:text-blue-300", iconBackground: "bg-blue-100 dark:bg-blue-950/60" },
    { name: "AI Analysis", path: "/dashboard#analysis", icon: FiZap, iconColor: "text-amber-600 dark:text-amber-300", iconBackground: "bg-amber-100 dark:bg-amber-950/60" },
    { name: "Analytics", path: "/dashboard/analytics", icon: FiBarChart2, iconColor: "text-emerald-600 dark:text-emerald-300", iconBackground: "bg-emerald-100 dark:bg-emerald-950/60" },
    { name: "Settings", path: "/dashboard/settings", icon: FiSettings, iconColor: "text-slate-600 dark:text-slate-300", iconBackground: "bg-slate-100 dark:bg-slate-800" },
    { name: "Profile", path: "/dashboard/profile", icon: FiUser, iconColor: "text-pink-600 dark:text-pink-300", iconBackground: "bg-pink-100 dark:bg-pink-950/60" },
];

export default function Sidebar({
    collapsed,
    setCollapsed,
    onClose,
    onNavigate,
}: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <aside
            className={`flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-300 dark:border-slate-800 dark:bg-slate-950 ${
                collapsed ? "w-20" : "w-64 lg:w-72"
            }`}
        >
            <div className={`flex h-14 shrink-0 items-center ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
                {!collapsed && (
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Workspace
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => {
                        if (onClose) {
                            onClose();
                            return;
                        }
                        setCollapsed(!collapsed);
                    }}
                    aria-label={onClose ? "Close navigation menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={onClose ? "Close navigation menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                    {onClose ? (
                        <FiX size={18} />
                    ) : collapsed ? (
                        <FiChevronRight size={18} />
                    ) : (
                        <FiChevronLeft size={18} />
                    )}
                </button>
            </div>

            <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                {menuItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isHashLink = item.path.includes("#");
                    const isActive = isHashLink
                        ? `${location.pathname}${location.hash}` === item.path
                        : item.path === "/dashboard"
                          ? location.pathname === item.path && !location.hash
                          : location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            title={collapsed ? item.name : undefined}
                            aria-current={isActive ? "page" : undefined}
                            className={`group flex min-h-11 items-center rounded-xl text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${
                                collapsed ? "justify-center px-2" : "gap-3 px-3"
                            } ${
                                isActive
                                    ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${item.iconBackground}`}
                            >
                                <ItemIcon
                                    size={18}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                    className={item.iconColor}
                                    aria-hidden="true"
                                />
                            </span>
                            {!collapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
                <button
                    type="button"
                    onClick={handleLogout}
                    title={collapsed ? "Log out" : undefined}
                    className={`flex min-h-11 w-full items-center rounded-xl text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 ${
                        collapsed ? "justify-center px-2" : "gap-3 px-3"
                    }`}
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 transition-colors dark:bg-rose-950/60 dark:text-rose-300">
                        <FiLogOut size={18} aria-hidden="true" />
                    </span>
                    {!collapsed && <span>Log out</span>}
                </button>
            </div>
        </aside>
    );
}
