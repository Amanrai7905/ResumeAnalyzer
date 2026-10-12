import { useEffect,useMemo, useState } from "react";
import api from "../api/axios";
import hubConnection from "../services/resumeHub";
import { useNavigate } from "react-router-dom";

interface Resume {
  id: number;
  fileName: string;
  status: string;
  resumeScore: number;
  atsScore?: number;
  uploadedAt: string;
}

interface ResumeListProps {
  refreshTrigger: number;
}

export default function ResumeList({ refreshTrigger }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const filteredResumes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return resumes.filter((resume) => {
        const matchesSearch =
            !search ||
            resume.fileName.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            resume.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });
}, [resumes, searchTerm, statusFilter]);

  const totalResumes = resumes.length;
  const completedCount = resumes.filter(
    (resume) => (resume.status || "Processing").toLowerCase() === "completed",
  ).length;
  const averageScore =
    totalResumes > 0
      ? Math.round(
          resumes.reduce((sum, resume) => sum + (resume.resumeScore || 0), 0) /
            totalResumes,
        )
      : 0;

  const getStatusClasses = (status?: string) => {
    const normalized = (status || "Processing").toLowerCase();

    if (normalized === "completed") {
      return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-800";
    }

    return "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-800";
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Resume/GetAllResume");

      console.log("Resume list response:", response.data);

      setResumes(response.data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
      setError("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/Resume/Delete/${id}`);

      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume.id !== id),
      );

      console.log("Resume deleted successfully.");
    } catch (error) {
      console.error("Failed to delete resume:", error);

      alert("Failed to delete resume. Please try again.");
    }
  };

  useEffect(() => {
    const loadResumes = async () => {
      await fetchResumes();
    };

    void loadResumes();

    const handleResumeAnalysisCompleted = (updatedResume: Resume) => {
      console.log("🔥 Resume analysis completed:", updatedResume);

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
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-900/60" />
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/30">
        <p className="text-base font-medium text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300">
            Resume Dashboard
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Resumes
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-[340px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {totalResumes}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Completed
            </p>
            <p className="mt-2 text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950/30">
            <p className="text-xs uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              Avg Score
            </p>
            <p className="mt-2 text-xl font-bold text-cyan-700 dark:text-cyan-300">
              {averageScore}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/30 sm:flex-row">
        <label className="relative block flex-1">
          <span className="sr-only">Search resumes</span>
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20L16.65 16.65" />
          </svg>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search resumes..."
            className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-950/60"
          />
        </label>

        <div className="sm:w-52">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950/60"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredResumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <div className="text-5xl">📄</div>
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
            {searchTerm
              ? "No resumes match your search or status filter."
              : "No resumes uploaded yet."}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload your first resume to start tracking the analysis.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filteredResumes.map((resume) => (
              <article
                key={resume.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-xl shadow-sm dark:from-cyan-900/70 dark:to-cyan-950">
                    📄
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                      {resume.fileName}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(resume.status)}`}
                    >
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

                <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                  <a
                    href={`/resume/${resume.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(`/resume/${resume.id}`);
                    }}
                    className="text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    View Details
                  </a>

                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDelete(resume.id);
                    }}
                    className="cursor-pointer text-red-500 transition hover:text-red-600"
                  >
                    Delete
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Resume
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Resume Score
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    ATS Score
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredResumes.map((resume) => (
                  <tr
                    key={resume.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-lg shadow-sm dark:from-cyan-900/70 dark:to-cyan-950">
                          📄
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-md truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {resume.fileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(resume.status)}`}
                      >
                        {resume.status || "Processing"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {resume.resumeScore}
                      </span>
                      <span className="ml-1 text-sm text-slate-400">/100</span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                        {resume.atsScore}
                      </span>
                      <span className="ml-1 text-sm text-slate-400">/100</span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <a
                          href={`/resume/${resume.id}`}
                          onClick={(event) => {
                            event.preventDefault();
                            navigate(`/resume/${resume.id}`);
                          }}
                          className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          View Details
                        </a>

                        <a
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            void handleDelete(resume.id);
                          }}
                          className="cursor-pointer text-sm font-semibold text-red-500 transition hover:text-red-600"
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
