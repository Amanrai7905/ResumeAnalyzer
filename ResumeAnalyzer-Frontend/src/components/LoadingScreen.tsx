export default function LoadingScreen() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
        >
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="relative flex h-14 w-14 items-center justify-center">
                    <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-slate-200 border-t-cyan-600 dark:border-slate-700 dark:border-t-cyan-400" />
                    <span className="text-xl font-bold text-cyan-700 dark:text-cyan-300">R</span>
                </div>
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                        ResumeAnalyzer
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Preparing your workspace...
                    </p>
                </div>
            </div>
        </div>
    );
}
