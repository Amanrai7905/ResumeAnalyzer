import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

interface Resume {
    id: number;
    fileName: string;
    status: string;
    resumeScore: number | null;
    atsScore?: number | null;
    uploadedAt: string;
}

export default function DashboardHome() {

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: "assistant",
            text: "Hi! I can help improve your resume, highlight key skills, and prepare for interviews.",
        },
        {
            id: 2,
            sender: "assistant",
            text: "Ask me anything about your resume, ATS score, or career goals.",
        },
    ]);

    const generateAssistantReply = (message: string) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("resume") || lowerMessage.includes("ats")) {
            return "Your resume will perform best when it matches the job description closely, uses clear metrics, and keeps the strongest keywords near the top.";
        }

        if (lowerMessage.includes("interview") || lowerMessage.includes("job")) {
            return "Focus on your measurable achievements, the problem you solved, and the results you delivered. That makes your answers stronger and more confident.";
        }

        if (lowerMessage.includes("skill") || lowerMessage.includes("strength")) {
            return "Highlight the skills that match the role, then support each one with a concrete example from your experience.";
        }

        if (lowerMessage.includes("career") || lowerMessage.includes("next step")) {
            return "A good next step is to identify roles that match your strengths, then improve one resume version for each target position.";
        }

        return "That is a great direction. I would start by clarifying the target role, strengthening your strongest impact points, and aligning your resume language with the job description.";
    };

    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();

        const message = chatInput.trim();

        if (!message) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: message,
        };

        const assistantMessage = {
            id: Date.now() + 1,
            sender: "assistant",
            text: generateAssistantReply(message),
        };

        setChatMessages((currentMessages) => [
            ...currentMessages,
            userMessage,
            assistantMessage,
        ]);
        setChatInput("");
    };

    const fetchResumes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Resume/GetAllResume");

            //console.log("Resume list response:", response.data);
            setResumes(response.data);
        } catch (error) {
            console.error("Failed to load resumes:", error);
            setError("Failed to load resumes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchResumes();
    }, []);


    const totalResumes = resumes.length;

    const completedResumes = resumes.filter(
        (resume) =>
            resume.status?.toLowerCase() === "completed"
    );

    const completedCount = completedResumes.length;

    const averageScore =
        completedCount > 0
            ? Math.round(
                  completedResumes.reduce(
                      (sum, resume) =>
                          sum + (resume.resumeScore ?? 0),
                      0
                  ) / completedCount
              )
            : 0;

    const averageAtsScore =
        completedCount > 0
            ? Math.round(
                  completedResumes.reduce(
                      (sum, resume) =>
                          sum + (resume.atsScore ?? 0),
                      0
                  ) / completedCount
              )
            : 0;

    const completionRate =
        totalResumes > 0 ? Math.round((completedCount / totalResumes) * 100) : 0;

    const insightMessage = completedCount > 0
        ? averageAtsScore >= averageScore
            ? "Your resumes are showing strong ATS compatibility. Keep tailoring keywords to each role for an even sharper match."
            : "Your resume content is performing well. Add measurable achievements and role-specific keywords to lift ATS compatibility."
        : "Upload your first resume to unlock personalized AI recommendations for score, keywords, and ATS compatibility.";

    const recentResumes = [...resumes]
        .sort(
            (a, b) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
        )
        .slice(0, 3);

    return (
        <div className="min-w-0 space-y-6 sm:space-y-8">

            {/* ============================
                Page Heading
            ============================ */}

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-300/30 sm:px-8 sm:py-8 dark:shadow-black/20">
                <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            Career workspace
                        </span>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back 👋
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                            Turn every resume into a sharper opportunity with focused,
                            AI-powered feedback.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs text-slate-300">Analysis progress</p>
                            <p className="mt-1 text-xl font-bold">{completionRate}%</p>
                        </div>

                        <Link
                            to="/upload"
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
                        >
                            <span className="mr-2 text-base">↗</span>
                            ✨ Analyze New Resume
                        </Link>
                    </div>
                </div>
            </section>


            {/* ============================
                Error Message
            ============================ */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                    {error}
                </div>
            )}


            {/* ============================
                Statistics
            ============================ */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

                <StatCard
                    title="Total Resumes"
                    value={loading ? "..." : totalResumes.toString()}
                    icon="📄"
                    accent="cyan"
                />

                <StatCard
                    title="Average Score"
                    value={loading ? "..." : `${averageScore}/100`}
                    icon="📊"
                    accent="amber"
                />

                <StatCard
                    title="Average ATS Score"
                    value={loading ? "..." : `${averageAtsScore}/100`}
                    icon="🎯"
                    accent="blue"
                />

                <StatCard
                    title="Completed Analysis"
                    value={loading ? "..." : completedCount.toString()}
                    icon="✅"
                    accent="emerald"
                />

            </div>


            {/* ============================
                Main Content
            ============================ */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


                {/* ============================
                    Recent Resumes
                ============================ */}

                <div id="analysis" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:col-span-2">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Resumes
                            </h2>

                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Your latest resume analyses
                            </p>
                        </div>

                        <Link
                            to="/resumes"
                            className="inline-flex whitespace-nowrap items-center text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                            View All →
                        </Link>

                    </div>


                    {/* ============================
                        Resume List
                    ============================ */}

                    <div className="mt-6 space-y-3">

                        {loading && (
                            <>
                                <ResumeSkeleton />
                                <ResumeSkeleton />
                                <ResumeSkeleton />
                            </>
                        )}


                        {!loading && recentResumes.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center dark:border-slate-700">

                                <div className="text-4xl">
                                    📄
                                </div>

                                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    No resumes found
                                </p>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Upload your first resume to start analyzing it.
                                </p>

                                <Link
                                    to="/upload"
                                    className="mt-4 inline-flex rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-blue-700"
                                >
                                    Upload Resume
                                </Link>

                            </div>
                        )}


                        {!loading &&
                            recentResumes.map((resume) => (
                                <ResumeRow
                                    key={resume.id}
                                    resume={resume}
                                />
                            ))}

                    </div>

                </div>


                {/* ============================
                    Quick Actions
                ============================ */}

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-6">

                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                                Shortcuts
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                Quick Actions
                            </h2>
                        </div>
                        <span className="text-2xl">✦</span>
                    </div>

                    <div className="mt-5 flex flex-col space-y-3">

                        <Link
                            to="/upload"
                            className="group inline-flex items-center justify-center rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-500/50"
                        >
                            <span className="mr-2">
                                ⬆️
                            </span>

                            ✨ Analyze Resume
                        </Link>


                        <Link
                            to="/resumes"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <span className="mr-2">
                                📄
                            </span>

                            View My Resumes
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsAssistantOpen(true)}
                            className="inline-flex items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-950"
                        >
                            <span className="mr-2">◌</span>
                            AI Career Assistant
                        </button>

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:col-span-3">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                                Intelligent feedback
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                                ✨ AI Insights
                            </h2>
                        </div>
                        <span className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                            {completedCount > 0 ? "Based on your data" : "Ready when you are"}
                        </span>
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {insightMessage}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <InsightMetric label="Resume performance" value={completedCount > 0 ? `${averageScore}/100` : "--"} />
                        <InsightMetric label="ATS compatibility" value={completedCount > 0 ? `${averageAtsScore}/100` : "--"} />
                        <InsightMetric label="Completion" value={`${completionRate}%`} />
                    </div>
                </section>

            </div>

            {isAssistantOpen && (
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="assistant-title"
                    className="fixed bottom-20 right-4 z-40 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl sm:bottom-24 sm:right-7"
                >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-xl text-slate-950">
                                ◌
                            </span>
                            <div>
                                <h2 id="assistant-title" className="font-bold">AI Career Assistant</h2>
                                <p className="text-xs text-cyan-200">Online now</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAssistantOpen(false)}
                            aria-label="Close AI Career Assistant"
                            title="Close"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-4">
                        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                                        message.sender === "assistant"
                                            ? "bg-slate-800 text-slate-100"
                                            : "ml-auto bg-cyan-400 text-slate-950"
                                    }`}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(event) => setChatInput(event.target.value)}
                                placeholder="Ask about your resume..."
                                aria-label="Message the AI Career Assistant"
                                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </section>
            )}

            <button
                type="button"
                onClick={() => setIsAssistantOpen((isOpen) => !isOpen)}
                aria-label="Ask AI Career Assistant"
                title="Ask AI"
                className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl text-white shadow-xl shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-600 sm:bottom-7 sm:right-7"
            >
                ◌
            </button>

        </div>
    );
}


/* =====================================================
   Stat Card
===================================================== */

function StatCard({
    title,
    value,
    icon,
    accent,
}: {
    title: string;
    value: string;
    icon: string;
    accent: "cyan" | "amber" | "blue" | "emerald";
}) {

    const accentStyles = {
        cyan: "border-cyan-200/80 dark:border-cyan-900/70 bg-cyan-50/50 dark:bg-cyan-950/20",
        amber: "border-amber-200/80 dark:border-amber-900/70 bg-amber-50/50 dark:bg-amber-950/20",
        blue: "border-blue-200/80 dark:border-blue-900/70 bg-blue-50/50 dark:bg-blue-950/20",
        emerald: "border-emerald-200/80 dark:border-emerald-900/70 bg-emerald-50/50 dark:bg-emerald-950/20",
    };

    return (
        <div className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accentStyles[accent]}`}>

            <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                        {value}
                    </p>

                </div>


                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-2xl shadow-sm transition group-hover:scale-110 dark:bg-slate-900/70">
                    {icon}
                </div>

            </div>

        </div>
    );
}


/* =====================================================
   Resume Row
===================================================== */

function ResumeRow({
    resume,
}: {
    resume: Resume;
}) {

    const isCompleted =
        resume.status?.toLowerCase() === "completed";

    const getStatusColor = (status: string) => {

        switch (status?.toLowerCase()) {

            case "completed":
                return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";

            case "processing":
                return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400";

            case "pending":
                return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";

            case "failed":
                return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";

            default:
                return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };


    const getStatusIcon = (status: string) => {

        switch (status?.toLowerCase()) {

            case "completed":
                return "✓";

            case "processing":
                return "⧗";

            case "pending":
                return "⏳";

            case "failed":
                return "✕";

            default:
                return "•";
        }
    };


    return (
        <Link
            to={`/resume/${resume.id}`}
            className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 sm:flex-row sm:items-center sm:justify-between"
        >

            {/* Resume Information */}

            <div className="flex min-w-0 flex-1 items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-700">
                    📄
                </div>


                <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {resume.fileName}
                    </p>


                    <div className="mt-1.5 flex flex-wrap items-center gap-2">

                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                resume.status
                            )}`}
                        >
                            {getStatusIcon(resume.status)}{" "}
                            {resume.status}
                        </span>


                        <span className="text-xs text-slate-400">
                            {formatDate(resume.uploadedAt)}
                        </span>

                    </div>

                </div>

            </div>


            {/* Score */}

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-6">

                {isCompleted && resume.resumeScore !== null ? (

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                                {resume.resumeScore}/100
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Resume score
                            </p>
                        </div>

                        <div className="hidden h-9 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                        <div className="flex flex-col items-end">
                            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                                {resume.atsScore ?? "--"}/100
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                ATS score
                            </p>
                        </div>
                    </div>

                ) : (

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        In progress...
                    </div>

                )}

                <span className="inline-flex items-center text-sm font-semibold text-cyan-600 transition group-hover:translate-x-0.5 dark:text-cyan-400">
                    View Analysis →
                </span>

            </div>

        </Link>
    );
}


/* =====================================================
   Loading Skeleton
===================================================== */

function ResumeSkeleton() {

    return (
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">

            <div className="flex items-center gap-3">

                <div className="h-11 w-11 rounded-lg bg-slate-200 dark:bg-slate-700" />

                <div className="flex-1">

                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />

                    <div className="mt-3 h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />

                </div>

            </div>

        </div>
    );
}


/* =====================================================
   Date Formatter
===================================================== */

function formatDate(dateString: string) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function InsightMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
    );
}