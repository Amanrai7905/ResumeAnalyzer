//import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  //const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      
       <div className="text-xl font-bold">
            Resume<span className="text-cyan-400">Analyzer</span>
          </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>

    </header>
  );
}