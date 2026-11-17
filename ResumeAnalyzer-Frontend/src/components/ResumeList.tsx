import { useEffect, useState, type ReactNode } from "react";
import api from "../api/axios";
import hubConnection from "../services/resumeHub";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiSearch,
  FiTarget,
  FiTrash2,
  FiEye,
} from "react-icons/fi";

interface Resume {
  id: string;
  fileName: string;
  status: string;
  resumeScore: number;
  atsScore?: number;
  uploadedAt: string;
}

interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface ResumeListProps {
  refreshTrigger: number;
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  tone: "cyan" | "emerald" | "violet";
}

function formatUploadedAt(value: string, includeTime = true) {
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };

  return date.toLocaleString("en-GB", options);
}

function MetricCard({ icon, label, value, tone }: MetricCardProps) {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    violet:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  };

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          {value}
        </p>
      </div>
    </article>
  );
}

export default function ResumeList({ refreshTrigger }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const completedResumes = resumes.filter(
    (resume) => (resume.status || "Processing").toLowerCase() === "completed",
  );
  const completedCount = completedResumes.length;
  const averageScore = completedCount > 0
      ? Math.round(
          completedResumes.reduce(
            (sum, resume) => sum + (resume.resumeScore || 0),
            0,
          ) / completedCount,
        )
      : null;

  const getStatusClasses = (status?: string) => {
    const normalized = (status || "Processing").toLowerCase();

    if (normalized === "completed") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800";
    }

    if (normalized === "failed") {
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-800";
    }

    if (normalized === "pending" || normalized === "processing") {
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800";
    }

    return "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/Resume/Delete/${id}`);

      setReloadKey((current) => current + 1);
    } catch (error) {
      console.error("Failed to delete resume:", error);

      alert("Failed to delete resume. Please try again.");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    let isActive = true;

    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<PagedResponse<Resume>>(
          "/Resume/Paged",
          {
            params: {
              pageNumber,
              pageSize,
              search: debouncedSearch || undefined,
              status: statusFilter === "All" ? undefined : statusFilter,
              sortBy: "UploadedAt",
              sortOrder: "desc",
            },
          },
        );

        if (!isActive) {
          return;
        }

        const result = response.data;
        setResumes(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);

        if (result.totalPages > 0 && pageNumber > result.totalPages) {
          setPageNumber(result.totalPages);
        } else if (result.totalPages === 0 && pageNumber !== 1) {
          setPageNumber(1);
        }
      } catch (error) {
        console.error("Failed to load resumes:", error);
        if (isActive) {
          setError("Failed to load resumes.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchResumes();

    return () => {
      isActive = false;
    };
  }, [
    debouncedSearch,
    pageNumber,
    pageSize,
    refreshTrigger,
    reloadKey,
    statusFilter,
  ]);

  useEffect(() => {
    const handleResumeAnalysisCompleted = (updatedResume: Resume) => {
      setResumes((currentResumes) =>
        currentResumes.map((resume) =>
          resume.id === updatedResume.id
            ? {
                ...resume,
                status: updatedResume.status,
                resumeScore: updatedResume.resumeScore,
                atsScore: updatedResume.atsScore,
              }
            : resume,
        ),
      );
      setReloadKey((current) => current + 1);
    };

    hubConnection.on("ResumeAnalysisCompleted", handleResumeAnalysisCompleted);

    const startSignalR = async () => {
      try {
        if (hubConnection.state === "Disconnected") {
          await hubConnection.start();

          console.log("SignalR connected.");
        }
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    };

    void startSignalR();

    return () => {
      hubConnection.off(
        "ResumeAnalysisCompleted",
        handleResumeAnalysisCompleted,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] space-y-6 pb-10" aria-label="Loading resumes">
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4 p-6">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-rose-900 dark:bg-slate-900"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
            <FiAlertCircle size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Couldn’t load your resumes
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {error}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((current) => current + 1)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-[1440px] space-y-6 pb-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            <FiFileText size={16} aria-hidden="true" />
            YOUR LIBRARY
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Resume library
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Keep your resumes organized and track how each one is performing.
          </p>
        </div>
      </header>

      <section aria-label="Resume metrics" className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<FiFileText size={18} aria-hidden="true" />}
          label="Matching resumes"
          value={totalCount}
          tone="cyan"
        />
        <MetricCard
          icon={<FiCheckCircle size={18} aria-hidden="true" />}
          label="Completed on this page"
          value={completedCount}
          tone="emerald"
        />
        <MetricCard
          icon={<FiTarget size={18} aria-hidden="true" />}
          label="Average completed score"
          value={averageScore === null ? "—" : `${averageScore}/100`}
          tone="violet"
        />
      </section>

      <section
        aria-label="Search and filter resumes"
        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search resumes</span>
          <FiSearch
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
            aria-hidden="true"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search resumes..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-950/60"
          />
          </label>

          <label className="sm:w-52">
            <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPageNumber(1);
            }}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950/60"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Your resumes
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {debouncedSearch || statusFilter !== "All"
                ? "Filtered results"
                : "Recently uploaded resumes"}
            </p>
          </div>
          {totalCount > 0 && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {totalCount} {totalCount === 1 ? "result" : "results"}
            </span>
          )}
        </div>

        {resumes.length === 0 ? (
          <div className="px-5 py-14 text-center sm:px-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
              <FiFileText size={25} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              {debouncedSearch || statusFilter !== "All"
                ? "No matching resumes"
                : "Your library is empty"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {debouncedSearch || statusFilter !== "All"
                ? "Try a different search term or status filter."
                : "Upload a resume to see its score, ATS compatibility, and personalized feedback here."}
            </p>
          </div>
        ) : (
          <>
          <div className="space-y-3 md:hidden">
            {resumes.map((resume) => (
              <article
                key={resume.id}
                className="mx-4 my-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-900"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    <FiFileText size={20} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-semibold text-slate-900 dark:text-white">
                      {resume.fileName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Uploaded {formatUploadedAt(resume.uploadedAt, false)}
                    </p>

                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(resume.status)}`}
                    >
                      {resume.status?.toLowerCase() === "completed" ? (
                        <FiCheckCircle size={12} aria-hidden="true" />
                      ) : resume.status?.toLowerCase() === "failed" ? (
                        <FiAlertCircle size={12} aria-hidden="true" />
                      ) : (
                        <FiClock size={12} aria-hidden="true" />
                      )}
                      {resume.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Resume Score
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      {resume.resumeScore}
                      <span className="ml-1 text-sm font-medium text-slate-400">/100</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      ATS Score
                    </p>
                    <p className="mt-1 text-base font-bold text-cyan-600 dark:text-cyan-400">
                      {resume.atsScore}
                      <span className="ml-1 text-sm font-medium text-slate-400">/100</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-sm font-medium dark:border-slate-800">
                  <Link
                    to={`/resume/${resume.id}`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-cyan-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-950/60 dark:hover:text-cyan-200"
                  >
                    <FiEye size={15} aria-hidden="true" />
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(resume.id)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <FiTrash2 size={14} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                 
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Resume
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Resume Score
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    ATS Score
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Upload At
                  </th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((resume) => (
                  <tr
                    key={resume.id}
                    className="border-b border-slate-100 last:border-0 transition-colors hover:bg-cyan-50/30 dark:border-slate-800 dark:hover:bg-cyan-950/10"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                          <FiFileText size={18} aria-hidden="true" />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-md break-all text-sm font-semibold text-slate-900 dark:text-white">
                            {resume.fileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(resume.status)}`}>
                        {resume.status?.toLowerCase() === "completed" ? (
                          <FiCheckCircle size={12} aria-hidden="true" />
                        ) : resume.status?.toLowerCase() === "failed" ? (
                          <FiAlertCircle size={12} aria-hidden="true" />
                        ) : (
                          <FiClock size={12} aria-hidden="true" />
                        )}
                        {resume.status || "Processing"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {resume.resumeScore ?? "—"}
                      </span>
                      <span className="ml-1 text-sm text-slate-400">/100</span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                        {resume.atsScore ?? "—"}
                      </span>
                      <span className="ml-1 text-sm text-slate-400">/100</span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/resume/${resume.id}`}
                          aria-label={`View ${resume.fileName}`}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/60"
                        >
                          <FiEye size={17} aria-hidden="true" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => void handleDelete(resume.id)}
                          aria-label={`Delete ${resume.fileName}`}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        >
                          <FiTrash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {formatUploadedAt(resume.uploadedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>

      {totalCount > 0 && (
        <nav
          aria-label="Resume list pagination"
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {(pageNumber - 1) * pageSize + 1}–
              {Math.min(pageNumber * pageSize, totalCount)}
            </span>{" "}
            of {totalCount} resumes
          </p>

          <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <label className="col-span-2 flex min-h-11 items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 sm:col-span-1 sm:justify-start">
              Rows
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPageNumber(1);
                }}
                className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              per page
            </label>

            <span className="col-span-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-1 sm:min-w-24">
              Page {pageNumber} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPageNumber((current) => current - 1)}
              disabled={pageNumber <= 1 || loading}
              aria-label="Previous page"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              <FiChevronLeft size={17} aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPageNumber((current) => current + 1)}
              disabled={pageNumber >= totalPages || loading}
              aria-label="Next page"
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              Next
              <FiChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
