import { useCallback, useEffect, useState } from "react";
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

interface ChatMessage {
    id: number;
    sender: "assistant" | "user";
    text: string;
}

async function requestResumes(): Promise<Resume[]> {
    const response = await api.get("/Resume/GetAllResume");
    return response.data;
}

export default function DashboardHome() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
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

    const fetchResumes = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setResumes(await requestResumes());
        } catch (err) {
            console.error("Failed to load resumes:", err);
            setError("We couldn't load your resumes. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isActive = true;

        requestResumes()
            .then((data) => {
                if (isActive) {
                    setResumes(data);
                }
            })
            .catch((err: unknown) => {
                console.error("Failed to load resumes:", err);
                if (isActive) {
                    setError("We couldn't load your resumes. Please try again.");
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
    }, []);

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

        setChatMessages((currentMessages) => [
            ...currentMessages,
            { id: Date.now(), sender: "user", text: message },
            {
                id: Date.now() + 1,
                sender: "assistant",
                text: generateAssistantReply(message),
            },
        ]);
        setChatInput("");
    };

    const totalResumes = resumes.length;
    const completedResumes = resumes.filter(
        (resume) => resume.status?.toLowerCase() === "completed"
    );
    const completedCount = completedResumes.length;
    const averageScore =
        completedCount > 0
            ? Math.round(
                  completedResumes.reduce(
                      (sum, resume) => sum + (resume.resumeScore ?? 0),
                      0
                  ) / completedCount
              )
            : 0;
    const averageAtsScore =
        completedCount > 0
            ? Math.round(
                  completedResumes.reduce(
                      (sum, resume) => sum + (resume.atsScore ?? 0),
                      0
                  ) / completedCount
              )
            : 0;
    const completionRate =
        totalResumes > 0
            ? Math.round((completedCount / totalResumes) * 100)
            : 0;
    const insightMessage =
        completedCount > 0
            ? averageAtsScore >= averageScore
                ? "Your resumes are showing strong ATS compatibility. Keep tailoring keywords to each role for an even sharper match."
                : "Your resume content is performing well. Add measurable achievements and role-specific keywords to lift ATS compatibility."
            : "Upload your first resume to unlock personalized recommendations for your score, keywords, and ATS compatibility.";

    const recentResumes = [...resumes]
        .sort(
            (a, b) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
        )
        .slice(0, 3);

    return (
        <div className="mx-auto min-w-0 max-w-[1440px] space-y-6 pb-10 sm:space-y-8">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                        CAREER WORKSPACE
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Your dashboard
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                        A clear view of your resumes, analysis progress, and next steps.
                    </p>
                </div>
                
            </header>

            {error && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={fetchResumes}
                        className="self-start font-semibold underline underline-offset-2 sm:self-auto"
                    >
                        Try again
                    </button>
                </div>
            )}

            <section aria-label="Resume overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total resumes"
                    value={loading ? "..." : totalResumes.toString()}
                    detail="Uploaded to your workspace"
                    icon="R"
                    accent="cyan"
                />
                <StatCard
                    title="Average resume score"
                    value={loading ? "..." : `${averageScore}/100`}
                    detail="Across completed analyses"
                    icon="S"
                    accent="violet"
                />
                <StatCard
                    title="Average ATS score"
                    value={loading ? "..." : `${averageAtsScore}/100`}
                    detail="Applicant tracking compatibility"
                    icon="A"
                    accent="blue"
                />
                <StatCard
                    title="Completed analyses"
                    value={loading ? "..." : completedCount.toString()}
                    detail={`${completionRate}% of your resumes`}
                    icon="✓"
                    accent="green"
                />
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
                <section
                    id="analysis"
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                Recent resumes
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Your latest uploads and analysis results
                            </p>
                        </div>
                        <Link
                            to="/resumes"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                            View all resumes <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {loading &&
                            [0, 1, 2].map((item) => <ResumeSkeleton key={item} />)}

                        {!loading && recentResumes.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-lg font-bold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                                    CV
                                </span>
                                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                                    Your workspace is ready
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Upload a resume to get your first score and personalized feedback.
                                </p>
                                <Link
                                    to="/upload"
                                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                >
                                    Upload your first resume
                                </Link>
                            </div>
                        )}

                        {!loading &&
                            recentResumes.map((resume) => (
                                <ResumeRow key={resume.id} resume={resume} />
                            ))}
                    </div>
                </section>

                <section
                    id="analytics"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                    <div>
                        <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                            YOUR PROGRESS
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                            Score overview
                        </h2>
                    </div>

                    <div className="mt-6 space-y-6">
                        <ScoreProgress
                            label="Resume score"
                            value={averageScore}
                            color="bg-violet-500"
                            loading={loading}
                        />
                        <ScoreProgress
                            label="ATS compatibility"
                            value={averageAtsScore}
                            color="bg-cyan-500"
                            loading={loading}
                        />
                        <ScoreProgress
                            label="Analysis completion"
                            value={completionRate}
                            color="bg-emerald-500"
                            loading={loading}
                        />
                    </div>

                    <div className="mt-7 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            A good next step
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {completedCount > 0
                                ? insightMessage
                                : "Start with one resume. We will show your analysis and practical recommendations here."}
                        </p>
                    </div>
                </section>
            </div>

            <section
                id="assistant"
                className="flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
            >
                <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-cyan-700 shadow-sm dark:bg-slate-800 dark:text-cyan-300">
                        AI
                    </span>
                    <div>
                        <h2 className="font-bold text-slate-950 dark:text-white">
                            Need help with your next move?
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Ask the AI Career Assistant for resume and interview guidance.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAssistantOpen(true)}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                    Open assistant <span className="ml-2" aria-hidden="true">→</span>
                </button>
            </section>

            {isAssistantOpen && (
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="assistant-title"
                    className="fixed bottom-20 right-4 z-40 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:bottom-24 sm:right-7 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-sm font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                                AI
                            </span>
                            <div>
                                <h2 id="assistant-title" className="font-bold">
                                    AI Career Assistant
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Here to help with your career
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsAssistantOpen(false)}
                            aria-label="Close AI Career Assistant"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-4">
                        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                                        message.sender === "assistant"
                                            ? "bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                                            : "ml-auto bg-cyan-600 text-white"
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
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
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
                aria-label={isAssistantOpen ? "Close AI Career Assistant" : "Ask AI Career Assistant"}
                title="Ask AI"
                className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:bottom-7 sm:right-7"
            >
                AI
            </button>
        </div>
    );
}

function StatCard({
    title,
    value,
    detail,
    icon,
    accent,
}: {
    title: string;
    value: string;
    detail: string;
    icon: string;
    accent: "cyan" | "violet" | "blue" | "green";
}) {
    const accentStyles = {
        cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
        violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
        green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {value}
                    </p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${accentStyles[accent]}`}>
                    {icon}
                </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </article>
    );
}

function ScoreProgress({
    label,
    value,
    color,
    loading,
}: {
    label: string;
    value: number;
    color: string;
    loading: boolean;
}) {
    const safeValue = Math.min(100, Math.max(0, value));

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </span>
                <span className="text-sm font-semibold text-slate-950 dark:text-white">
                    {loading ? "..." : `${safeValue}%`}
                </span>
            </div>
            <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safeValue}
                className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
                <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`}
                    style={{ width: `${loading ? 0 : safeValue}%` }}
                />
            </div>
        </div>
    );
}

function ResumeRow({ resume }: { resume: Resume }) {
    const status = resume.status || "Unknown";
    const isCompleted = status.toLowerCase() === "completed";
    const statusStyles: Record<string, string> = {
        completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        processing: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
        pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
        failed: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    };

    return (
        <Link
            to={`/resume/${resume.id}`}
            className="group flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 p-4 transition duration-200 hover:border-cyan-300 hover:bg-slate-50/70 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:hover:border-cyan-800 dark:hover:bg-slate-800/50"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-sm font-bold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    PDF
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {resume.fileName}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                statusStyles[status.toLowerCase()] ??
                                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                        >
                            {status}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(resume.uploadedAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                {isCompleted ? (
                    <div className="flex items-center gap-4">
                        <ScoreValue label="Resume" value={resume.resumeScore} />
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                        <ScoreValue label="ATS" value={resume.atsScore ?? null} />
                    </div>
                ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Analysis in progress
                    </span>
                )}
                <span className="text-lg text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300" aria-hidden="true">
                    →
                </span>
            </div>
        </Link>
    );
}

function ScoreValue({ label, value }: { label: string; value: number | null }) {
    return (
        <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
                {value == null ? "--" : `${value}/100`}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
}

function ResumeSkeleton() {
    return (
        <div className="animate-pulse rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1">
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-3 h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
            </div>
        </div>
    );
}

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
