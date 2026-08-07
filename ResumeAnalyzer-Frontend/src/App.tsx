import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/useTheme";
import ThemeToggle from "./components/ThemeToggle";

function App() {
    const { theme } = useTheme();

    return (
        <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-slate-50 text-slate-950"}>
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl transition duration-300 dark:border-white/10 dark:bg-slate-950/95 lg:px-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white">RA</div>
                        <span className="hidden text-sm font-semibold text-slate-950 dark:text-slate-100 sm:inline">Resume Analyzer</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <nav className="hidden gap-4 text-sm text-slate-700 dark:text-slate-300 sm:flex">
                            <a href="#" className="hover:underline">Features</a>
                            <a href="#" className="hover:underline">Pricing</a>
                            <a href="/dashboard" className="hover:underline">Dashboard</a>
                        </nav>
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main>
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;