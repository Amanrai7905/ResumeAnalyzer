import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

interface ResumeDetails {
  id: string;
  fileName: string;
  status: string;
  resumeScore: number;
  atsScore: number;
  summary: string;
  skills: string[];
  missingSkills: string[];
  suggestions: string[];
}

const getStatusClasses = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || "processing";

  switch (normalizedStatus) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900";
    case "processing":
      return "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900";
    case "failed":
      return "bg-red-100 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900";
    default:
      return "bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:ring-cyan-900";
  }
};

const getScoreTone = (score: number) => {
  if (score >= 85) return "from-emerald-500 to-teal-500";
  if (score >= 70) return "from-cyan-500 to-blue-500";
  if (score >= 50) return "from-amber-500 to-orange-500";
  return "from-rose-500 to-red-500";
};

export default function ResumeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<ResumeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/Resume/GetResumeById/${id}`);
        setResume(response.data);
      } catch (err) {
        console.error("Failed to load resume details:", err);
        setError("Unable to load resume details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-950/80">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading resume analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        Resume not found.
      </div>
    );
  }

  const scoreCards = [
    {
      label: "Resume Score",
      value: resume.resumeScore ?? 0,
      color: getScoreTone(resume.resumeScore ?? 0),
    },
    {
      label: "ATS Score",
      value: resume.atsScore ?? 0,
      color: getScoreTone(resume.atsScore ?? 0),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => navigate("/resumes")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                ← Back to resumes
              </button>

              <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {resume.fileName}
              </h1>
            </div>

            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ${getStatusClasses(resume.status)}`}>
              {resume.status || "Processing"}
            </span>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {scoreCards.map((score) => (
            <div
              key={score.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {score.label}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {score.value}/100
                </span>
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {score.value}
                </span>
                <span className="mb-1 text-sm text-slate-400">points</span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${score.color}`}
                  style={{ width: `${Math.min(score.value, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-lg dark:bg-cyan-950/60">
              ✨
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI Summary
            </h2>
          </div>

          <p className="leading-7 text-slate-600 dark:text-slate-300">
            {resume.summary || "No summary has been generated yet."}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-950/60">
                ✅
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Skills
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume.skills?.length ? (
                resume.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No skills identified.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-lg dark:bg-rose-950/60">
                ⚠️
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Missing Skills
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume.missingSkills?.length ? (
                resume.missingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No major skill gaps detected.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-lg dark:bg-violet-950/60">
              💡
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI Suggestions
            </h2>
          </div>

          <div className="space-y-3">
            {resume.suggestions?.length ? (
              resume.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                    {index + 1}
                  </span>
                  <p>{suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No suggestions available right now.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}