import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBarChart2, FiFileText, FiTarget } from "react-icons/fi";
import api from "../../api/axios";

interface Resume {
    id: number;
    fileName: string;
    status: string;
    resumeScore: number | null;
    atsScore?: number | null;
    uploadedAt: string;
}

interface TrendPoint {
    resume: Resume;
    x: number;
    y: number;
}

const scoreRanges = [
    { label: "0–59", min: 0, max: 59, color: "bg-rose-400" },
    { label: "60–74", min: 60, max: 74, color: "bg-amber-400" },
    { label: "75–89", min: 75, max: 89, color: "bg-cyan-500" },
    { label: "90–100", min: 90, max: 100, color: "bg-emerald-500" },
];

export default function AnalyticsPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isActive = true;

        api.get<Resume[]>("/Resume/GetAllResume")
            .then((response) => {
                if (isActive) {
                    setResumes(response.data);
                }
            })
            .catch((err: unknown) => {
                console.error("Failed to load analytics:", err);
                if (isActive) {
                    setError("We couldn't load your analytics. Please try again.");
                }
            })
            .finally(() => {
                if (isActive) {
                    setLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [retryCount]);

    const completedResumes = resumes.filter(
        (resume) => resume.status?.toLowerCase() === "completed"
    );
    const scoredResumes = completedResumes.filter(
        (resume) => resume.resumeScore != null
    );
    const atsScoredResumes = completedResumes.filter(
        (resume) => resume.atsScore != null
    );
    const averageScore = average(scoredResumes.map((resume) => resume.resumeScore ?? 0));
    const averageAtsScore = average(atsScoredResumes.map((resume) => resume.atsScore ?? 0));
    const inProgressCount = resumes.filter((resume) =>
        ["pending", "processing"].includes(resume.status?.toLowerCase())
    ).length;

    const scoreDistribution = scoreRanges.map((range) => ({
        ...range,
        count: scoredResumes.filter(
            (resume) =>
                (resume.resumeScore ?? 0) >= range.min &&
                (resume.resumeScore ?? 0) <= range.max
        ).length,
    }));
    const distributionMax = Math.max(1, ...scoreDistribution.map((range) => range.count));

    const statusCounts = resumes.reduce<Record<string, number>>((counts, resume) => {
        const status = resume.status?.trim() || "Unknown";
        const key = status.toLowerCase();
        counts[key] = (counts[key] ?? 0) + 1;
        return counts;
    }, {});

    const trendResumes = [...scoredResumes]
        .filter((resume) => !Number.isNaN(new Date(resume.uploadedAt).getTime()))
        .sort(
            (left, right) =>
                new Date(left.uploadedAt).getTime() -
                new Date(right.uploadedAt).getTime()
        )
        .slice(-8);
    const trendPoints: TrendPoint[] = trendResumes.map((resume, index) => ({
        resume,
        x:
            trendResumes.length === 1
                ? 360
                : 48 + (index / (trendResumes.length - 1)) * 624,
        y: 190 - ((resume.resumeScore ?? 0) / 100) * 160,
    }));
    const trendLine = trendPoints.map((point) => `${point.x},${point.y}`).join(" ");

    const topResumes = [...scoredResumes]
        .sort((left, right) => (right.resumeScore ?? 0) - (left.resumeScore ?? 0))
        .slice(0, 3);

    return (
        <div className="mx-auto min-w-0 max-w-[1440px] space-y-6 pb-10 sm:space-y-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                        YOUR PERFORMANCE
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Analytics
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                        Understand your resume scores and analysis progress.
                    </p>
                </div>
                <Link
                    to="/resumes"
                    className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:self-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <FiFileText size={17} aria-hidden="true" />
                    All resumes
                </Link>
            </header>

            {error && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => {
                            setLoading(true);
                            setError("");
                            setRetryCount((count) => count + 1);
                        }}
                        className="self-start font-semibold underline underline-offset-2 sm:self-auto"
                    >
                        Reload page
                    </button>
                </div>
            )}

            <section aria-label="Analytics overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Completed analyses"
                    value={loading ? "..." : completedResumes.length}
                    note={`of ${resumes.length} total resumes`}
                    icon={<FiFileText size={19} />}
                    tone="cyan"
                />
                <MetricCard
                    label="Average resume score"
                    value={loading ? "..." : averageScore == null ? "--" : `${averageScore}/100`}
                    note={scoredResumes.length ? `From ${scoredResumes.length} scored resumes` : "No scored resumes yet"}
                    icon={<FiBarChart2 size={19} />}
                    tone="violet"
                />
                <MetricCard
                    label="Average ATS score"
                    value={loading ? "..." : averageAtsScore == null ? "--" : `${averageAtsScore}/100`}
                    note={atsScoredResumes.length ? `From ${atsScoredResumes.length} scored resumes` : "No ATS scores yet"}
                    icon={<FiTarget size={19} />}
                    tone="blue"
                />
                <MetricCard
                    label="In progress"
                    value={loading ? "..." : inProgressCount}
                    note="Pending or processing"
                    icon={<FiArrowUpRight size={19} />}
                    tone="amber"
                />
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                Resume score trend
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Score by completed resume, ordered by upload date
                            </p>
                        </div>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {scoredResumes.length} scored
                        </span>
                    </div>

                    {loading ? (
                        <div className="mt-6 h-56 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    ) : trendPoints.length === 0 ? (
                        <EmptyChartMessage>
                            Complete a resume analysis to see your score trend.
                        </EmptyChartMessage>
                    ) : (
                        <div className="mt-5">
                            <svg
                                viewBox="0 0 720 230"
                                role="img"
                                aria-label="Resume scores over time"
                                className="h-auto w-full overflow-visible"
                            >
                                {[30, 70, 110, 150, 190].map((y, index) => (
                                    <g key={y}>
                                        <text
                                            x="0"
                                            y={y + 4}
                                            className="fill-slate-400 text-[11px] dark:fill-slate-500"
                                        >
                                            {100 - index * 25}
                                        </text>
                                        <line
                                            x1="40"
                                            x2="700"
                                            y1={y}
                                            y2={y}
                                            className="stroke-slate-100 dark:stroke-slate-800"
                                            strokeDasharray="4 6"
                                        />
                                    </g>
                                ))}

                                {trendPoints.length > 1 && (
                                    <polyline
                                        points={trendLine}
                                        fill="none"
                                        className="stroke-cyan-600 dark:stroke-cyan-400"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}

                                {trendPoints.map((point) => (
                                    <g key={point.resume.id}>
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r="5"
                                            className="fill-white stroke-cyan-600 dark:fill-slate-900 dark:stroke-cyan-400"
                                            strokeWidth="3"
                                        >
                                            <title>
                                                {point.resume.fileName}: {point.resume.resumeScore}/100, {formatDate(point.resume.uploadedAt)}
                                            </title>
                                        </circle>
                                    </g>
                                ))}
                            </svg>
                            <div className="mt-1 flex justify-between gap-3 pl-10 text-xs text-slate-500 dark:text-slate-400">
                                <span>{formatDate(trendResumes[0].uploadedAt)}</span>
                                <span>{formatDate(trendResumes[trendResumes.length - 1].uploadedAt)}</span>
                            </div>
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                            Analysis status
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Current status of your resumes
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-6 space-y-4">
                            {[0, 1, 2].map((item) => (
                                <div key={item} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                            ))}
                        </div>
                    ) : resumes.length === 0 ? (
                        <EmptyChartMessage>
                            Your resume statuses will appear here after you upload a resume.
                        </EmptyChartMessage>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <StatusRow
                                    key={status}
                                    status={status}
                                    count={count}
                                    total={resumes.length}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                            Score distribution
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Completed resumes grouped by score
                        </p>
                    </div>

                    {loading ? (
                        <div className="mt-6 h-44 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    ) : scoredResumes.length === 0 ? (
                        <EmptyChartMessage>
                            Score ranges will appear after your first completed analysis.
                        </EmptyChartMessage>
                    ) : (
                        <div className="mt-6 space-y-5">
                            {scoreDistribution.map((range) => (
                                <div key={range.label} className="grid grid-cols-[52px_1fr_28px] items-center gap-3">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {range.label}
                                    </span>
                                    <div
                                        role="progressbar"
                                        aria-label={`Score range ${range.label}`}
                                        aria-valuemin={0}
                                        aria-valuemax={scoredResumes.length}
                                        aria-valuenow={range.count}
                                        className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                                    >
                                        <div
                                            className={`h-full rounded-full transition-[width] duration-500 ${range.color}`}
                                            style={{ width: `${(range.count / distributionMax) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {range.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                Top resume scores
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Your highest-scoring completed analyses
                            </p>
                        </div>
                        <Link
                            to="/resumes"
                            aria-label="View all resumes"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-cyan-700 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        >
                            <FiArrowUpRight size={19} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="mt-6 space-y-3">
                            {[0, 1, 2].map((item) => (
                                <div key={item} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                            ))}
                        </div>
                    ) : topResumes.length === 0 ? (
                        <EmptyChartMessage>
                            Your best-scoring resumes will show up here.
                        </EmptyChartMessage>
                    ) : (
                        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                            {topResumes.map((resume, index) => (
                                <Link
                                    key={resume.id}
                                    to={`/resume/${resume.id}`}
                                    className="flex items-center gap-3 py-3 first:pt-1 last:pb-1"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 hover:text-cyan-700 dark:text-slate-200 dark:hover:text-cyan-300">
                                        {resume.fileName}
                                    </span>
                                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                                        {resume.resumeScore}/100
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function average(values: number[]) {
    return values.length
        ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
        : null;
}

function MetricCard({
    label,
    value,
    note,
    icon,
    tone,
}: {
    label: string;
    value: string | number;
    note: string;
    icon: ReactNode;
    tone: "cyan" | "violet" | "blue" | "amber";
}) {
    const tones = {
        cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
        violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
        amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {value}
                    </p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
                    {icon}
                </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{note}</p>
        </article>
    );
}

function StatusRow({
    status,
    count,
    total,
}: {
    status: string;
    count: number;
    total: number;
}) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const statusColors: Record<string, string> = {
        completed: "bg-emerald-500",
        processing: "bg-blue-500",
        pending: "bg-amber-500",
        failed: "bg-rose-500",
    };

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-slate-500 dark:text-slate-400">
                    {count} <span className="text-xs">({percentage}%)</span>
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                    className={`h-full rounded-full ${statusColors[status] ?? "bg-slate-400"}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function EmptyChartMessage({ children }: { children: ReactNode }) {
    return (
        <div className="mt-5 flex min-h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 px-5 text-center text-sm leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {children}
        </div>
    );
}

function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
