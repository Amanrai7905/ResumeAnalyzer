export default function DashboardHome() {

    return (
        <div className="space-y-8">

            {/* Page Heading */}
            <div className="space-y-3">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent sm:text-4xl">
                        Welcome back 
                    </h1>
                </div>

                <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                    Track your resume analyses and get detailed insights to improve your job applications.
                </p>

            </div>


            {/* Statistics */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    title="Total Resumes"
                    value="12"
                    icon="📄"
                />

                <StatCard
                    title="Average Score"
                    value="78"
                    icon="📊"
                />

                <StatCard
                    title="Average ATS Score"
                    value="82"
                    icon="🎯"
                />

                <StatCard
                    title="Completed Analysis"
                    value="10"
                    icon="✅"
                />

            </div>


            {/* Main Content */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">

                {/* Recent Resumes */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Resumes
                            </h2>

                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Your latest resume analyses
                            </p>
                        </div>

                        <a href="/resumes" className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition dark:text-cyan-400 dark:hover:text-cyan-300 whitespace-nowrap">
                            View All →
                        </a>

                    </div>


                    <div className="mt-6 space-y-3">

                        <ResumeRow
                            name="Software_Developer.pdf"
                            score="87"
                            status="Completed"
                        />

                        <ResumeRow
                            name="Backend_Developer.pdf"
                            score="79"
                            status="Completed"
                        />

                        <ResumeRow
                            name="FullStack_Resume.pdf"
                            score="Pending"
                            status="Processing"
                        />

                    </div>

                </div>


                {/* Quick Actions */}
                <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">

                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Quick Actions
                    </h2>

                    <div className="mt-5 space-y-3 flex flex-col">

                        <a href="/upload" className="group inline-flex items-center justify-center rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50">
                            <span className="mr-2">⬆️</span>
                            Upload Resume
                        </a>

                        <a href="/resumes" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                            <span className="mr-2">📄</span>
                            View My Resumes
                        </a>

                    </div>

                </div>

            </div>

        </div>
    );
}


function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: string;
}) {

    return (
        <div className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-sm transition hover:shadow-md hover:border-cyan-200 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:hover:border-cyan-800">

            <div className="flex items-start justify-between gap-4">

                <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl dark:text-white">
                        {value}
                    </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-cyan-100 to-blue-100 text-2xl transition group-hover:scale-110 dark:from-cyan-950 dark:to-blue-950">
                    {icon}
                </div>

            </div>

        </div>
    );
}


function ResumeRow({
    name,
    score,
    status,
}: {
    name: string;
    score: string;
    status: string;
}) {

    const isCompleted = status === "Completed";

    const getStatusColor = (s: string) => {
        return s === "Completed"
            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
            : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    };

    return (
        <div className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">

            <div className="flex items-center gap-3 flex-1 min-w-0">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-700">
                    📄
                </div>

                <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {name}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                            {status === "Completed" ? "✓" : "⧗"} {status}
                        </span>
                    </div>

                </div>

            </div>


            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 flex-wrap">

                {isCompleted && (
                    <div className="flex flex-col items-end">
                        <div className="text-2xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            {score}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Score
                        </p>
                    </div>
                )}

                {!isCompleted && (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        In progress...
                    </div>
                )}

            </div>

        </div>
    );
}