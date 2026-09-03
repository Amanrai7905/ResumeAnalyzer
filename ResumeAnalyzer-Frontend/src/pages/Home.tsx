import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";

export default function Dashboard() {
  const [, setRefreshTrigger] = useState(0);
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Fixed Navbar */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="text-xl font-bold">
            Resume<span className="text-cyan-400">Analyzer</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              How it works
            </a>

            <a
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-600 hover:to-blue-700 transition shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              Get Started
            </a>         
          </nav>

        </div>
      </header>


      {/* Hero - Added padding-top for fixed header */}
      <main className="pt-20">

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-5 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              AI-Powered Resume Analysis
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Make Your Resume
              <span className="block text-cyan-400">
                Interview Ready
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Analyze your resume with AI-powered scoring, ATS analysis,
              skill gap detection and actionable recommendations.
            </p>

          </div>


          {/* Upload */}
          <div className="mx-auto mt-12 max-w-3xl">
           <ResumeUpload  onUploadSuccess={() =>
             setRefreshTrigger((current: number) => current + 1)
            }
            />


          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Your resume is analyzed securely. PDF files only.
          </p>

        </section>


        {/* Features */}
        <section
          id="features"
          className="border-y border-slate-800 bg-slate-900/40"
        >

          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Powerful Analysis
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Everything you need to improve your resume
              </h2>

              <p className="mt-4 text-slate-400">
                Get more than just a number. Understand exactly what
                is working and what needs improvement.
              </p>

            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {/* Resume Score */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">

                <div className="text-3xl">
                  📊
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Resume Score
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Get an overall score that shows how strong your
                  resume is and where you can improve.
                </p>

              </div>


              {/* ATS */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">

                <div className="text-3xl">
                  🎯
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  ATS Analysis
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Check whether your resume contains the right
                  structure and information for applicant tracking
                  systems.
                </p>

              </div>


              {/* AI */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7">

                <div className="text-3xl">
                  🤖
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  AI Feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Get personalized suggestions, missing skills and
                  improvements generated from your resume.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-20"
        >

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Improve your resume in three steps
            </h2>

          </div>


          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-xl font-bold text-cyan-400">
                01
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Upload
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                Upload your resume in PDF format.
              </p>

            </div>


            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-xl font-bold text-cyan-400">
                02
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Analyze
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                Our AI analyzes your resume and evaluates its
                strengths and weaknesses.
              </p>

            </div>


            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-xl font-bold text-cyan-400">
                03
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Improve
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                Review your score, ATS results, missing skills and
                AI recommendations.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} ResumeAnalyzer
          </p>

          <p>
            AI-powered resume analysis
          </p>

        </div>

      </footer>

    </div>
  );
}
