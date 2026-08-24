import { useState } from "react";
import Header from "../../components/Header";
import ResumeList from "../../components/ResumeList";
import ResumeUpload from "../../components/ResumeUpload";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
   
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 space-y-6 p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to Resume Analyzer
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Upload your resume and let AI analyze it for you.
            </p>
          </div>

          <ResumeUpload  onUploadSuccess={() =>
             setRefreshTrigger((current: number) => current + 1)
          }
          />
          <ResumeList 
           refreshTrigger={refreshTrigger}
          />
        </main>
      </div>
    </div>
  );
}
