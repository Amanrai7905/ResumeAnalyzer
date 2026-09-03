import { useEffect, useState } from "react";
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
  const navigate = useNavigate();

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

      // Remove immediately from UI
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

    // ✅ Register handler BEFORE starting SignalR
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
      // ✅ Remove exactly this handler
      hubConnection.off(
        "ResumeAnalysisCompleted",
        handleResumeAnalysisCompleted,
      );
    };
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-400">Loading resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          My Resumes
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-4xl">📄</div>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            No resumes uploaded yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {resumes.map((resume) => (
                <tr
                  key={resume.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  {/* Resume Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950">
                        📄
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-xs truncate font-medium text-slate-900 dark:text-white">
                          {resume.fileName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        resume.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                      }`}
                    >
                      {resume.status || "Processing"}
                    </span>
                  </td>

                  {/* Resume Score */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {resume.resumeScore}
                    </span>
                    <span className="text-slate-400">/100</span>
                  </td>

                  {/* ATS Score */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                      {resume.atsScore}
                    </span>
                    <span className="text-slate-400">/100</span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4">
                    <a
                      href={`/resume/${resume.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/resume/${resume.id}`);
                      }}
                      className="text-cyan-600 hover:underline font-medium text-sm"
                    >
                      View Details
                    </a>
                  </td>

                  <td className="">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(resume.id);
                      }}
                      className="text-red-500 hover:text-red-600 hover:underline font-medium text-sm cursor-pointer"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
