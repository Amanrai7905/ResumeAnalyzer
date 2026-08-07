function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition duration-300 dark:border-white/10 dark:bg-slate-900/90">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                                Resume Analyzer
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-white">
                                Welcome to your dashboard
                            </h1>
                            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                                A clean overview of your latest candidates, resume insights, and hiring metrics.
                            </p>
                        </div>
                        <div className="inline-flex gap-3">
                            <button className="rounded-3xl bg-slate-100/90 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700">
                                Refresh
                            </button>
                            <button className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                New analysis
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-slate-950/20 transition duration-300 dark:border-white/10 dark:bg-slate-900/95">
                        <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80">
                            Applicants
                        </p>
                        <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">1,248</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">New resumes added this week.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-slate-950/20 transition duration-300 dark:border-white/10 dark:bg-slate-900/95">
                        <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80">
                            Matches
                        </p>
                        <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">84%</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Resume match rate across active positions.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-slate-950/20 transition duration-300 dark:border-white/10 dark:bg-slate-900/95">
                        <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80">
                            Feedback
                        </p>
                        <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">72%</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Positive review rate from recruiters.</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-slate-950/20 transition duration-300 dark:border-white/10 dark:bg-slate-900/95">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Recent activity</h2>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Latest activity from candidates and hiring managers.</p>
                            </div>
                            <button className="rounded-3xl bg-slate-100/90 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700">
                                View all
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-3xl bg-slate-100/90 px-5 py-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-700 dark:text-slate-300">New resume uploaded by <span className="font-semibold text-slate-950 dark:text-white">Jordan</span>.</p>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">10 minutes ago</p>
                            </div>
                            <div className="rounded-3xl bg-slate-100/90 px-5 py-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-700 dark:text-slate-300">Interview feedback submitted for <span className="font-semibold text-slate-950 dark:text-white">Dana Lee</span>.</p>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">1 hour ago</p>
                            </div>
                            <div className="rounded-3xl bg-slate-100/90 px-5 py-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-700 dark:text-slate-300">Position <span className="font-semibold text-slate-950 dark:text-white">Frontend Engineer</span> reached 120 candidates.</p>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Yesterday</p>
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-[1.75rem] border border-slate-200/70 bg-white/95 p-6 shadow-lg shadow-slate-950/20 transition duration-300 dark:border-white/10 dark:bg-slate-900/95">
                        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Insights</h2>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Helpful metrics to keep your hiring on track.</p>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-3xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average time to review</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">2.3 days</p>
                            </div>
                            <div className="rounded-3xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Active roles</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">7</p>
                            </div>
                            <div className="rounded-3xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pending interviews</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">14</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;