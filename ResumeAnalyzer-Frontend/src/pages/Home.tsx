import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";

export default function Dashboard() {
  const [, setRefreshTrigger] = useState(0);
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* Fixed Navbar */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="text-xl font-bold">
            Resume<span className="text-cyan-400">Analyzer</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white"
            >
              How it works
            </a>

            <a
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-cyan-700 transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Get Started
            </a>         
          </nav>

        </div>
      </header>


      {/* Hero Section */}
      <main className="pt-20">

        <section className="bg-linear-to-br from-slate-100 via-purple-100 to-blue-100 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              
              {/* Left Content */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                  25+ Best Professional and{" "}
                  <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ATS Resume Templates
                  </span>
                  {" "}for 2026
                </h1>

                <p className="mt-6 text-lg text-slate-700 leading-relaxed">
                  Access our collection of professional and ATS resume templates that are designed to get you more interviews. From simple to modern, download over 25+ resume templates and customize.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    href="/upload"
                    className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-7 py-3.5 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                  >
                    Build Resume with AI
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border-2 border-slate-700 bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Check ATS Score
                  </a>
                </div>

                {/* Social Proof */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 ring-2 ring-white" />
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 ring-2 ring-white" />
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-pink-400 to-pink-600 ring-2 ring-white" />
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 ring-2 ring-white" />
                  </div>
                  <div>
                    <div className="flex gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">540,700+ resumes created</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Resume Templates Preview */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://framerusercontent.com/images/azTvl9sqD7qXgiE0lYjxIUD9sVw.png?width=835&height=747"
                    srcSet="https://framerusercontent.com/images/azTvl9sqD7qXgiE0lYjxIUD9sVw.png?scale-down-to=512&width=835&height=747 512w, https://framerusercontent.com/images/azTvl9sqD7qXgiE0lYjxIUD9sVw.png?width=835&height=747 835w"
                    sizes="(min-width: 1024px) 448px, 100vw"
                    alt="Resume template previews"
                    className="h-auto w-full"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Upload Component Section */}
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <ResumeUpload  onUploadSuccess={() =>
              setRefreshTrigger((current: number) => current + 1)
            }
            />
          </div>

          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400 sm:mt-5">
            ✓ Secure upload • ✓ PDF supported • ✓ Instant analysis
          </p>
        </section>


        {/* Partner Companies Section */}
        <section className="border-y border-slate-200 bg-linear-to-b from-white to-slate-50 py-12 sm:py-16 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Trusted by leading companies
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6 items-center justify-items-center">
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">OpenAI</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Stripe</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Figma</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Microsoft</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Google</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Notion</div>
            </div>
          </div>
        </section>


        {/* Features */}
        <section
          id="features"
          className="border-b border-slate-200 bg-white py-16 sm:py-20 dark:border-slate-800 dark:bg-slate-900"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Powerful Features
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                Everything you need to improve your resume
              </h2>

              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Get more than just a number. Understand exactly what is working and what needs improvement.
              </p>

            </div>


            <div className="mt-12 grid gap-8 md:grid-cols-3">

              {/* Resume Score */}
              <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 transition hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-blue-800">

                <div className="text-4xl">
                  📊
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Resume Score
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Get an overall score that shows how strong your resume is and where you can improve.
                </p>

              </div>


              {/* ATS */}
              <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 transition hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-blue-800">

                <div className="text-4xl">
                  🎯
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  ATS Analysis
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Check whether your resume contains the right structure and information for applicant tracking systems.
                </p>

              </div>


              {/* AI */}
              <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-8 transition hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-blue-800">

                <div className="text-4xl">
                  🤖
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  AI Feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Get personalized suggestions, missing skills and improvements generated from your resume.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-linear-to-b from-slate-50 to-white py-16 sm:py-20 dark:from-slate-950 dark:to-slate-900"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Simple Process
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                Improve your resume in three steps
              </h2>

            </div>


            <div className="mt-12 grid gap-8 md:grid-cols-3">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-cyan-100 text-2xl font-bold text-blue-600 dark:from-blue-950 dark:to-cyan-950 dark:text-blue-400">
                  01
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  Upload
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Upload your resume in PDF format.
                </p>

              </div>


              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-cyan-100 text-2xl font-bold text-blue-600 dark:from-blue-950 dark:to-cyan-950 dark:text-blue-400">
                  02
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  Analyze
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Our AI analyzes your resume and evaluates its strengths and weaknesses.
                </p>

              </div>


              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-cyan-100 text-2xl font-bold text-blue-600 dark:from-blue-950 dark:to-cyan-950 dark:text-blue-400">
                  03
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  Improve
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Review your score, ATS results, missing skills and AI recommendations.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 sm:py-12 dark:border-slate-800 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="text-lg font-bold">
                Resume<span className="text-cyan-400">Analyzer</span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">AI-powered resume analysis</p>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} ResumeAnalyzer. All rights reserved.
            </div>

          </div>
        </div>

      </footer>

    </div>
  );
}
