import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBarChart2,
  FiCheck,
  FiFileText,
  FiMenu,
  FiShield,
  FiTarget,
  FiUploadCloud,
  FiX,
  FiZap,
} from "react-icons/fi";
import ResumeUpload from "../components/ResumeUpload";

const features = [
  {
    icon: FiBarChart2,
    title: "Understand your score",
    description:
      "See how your resume performs at a glance and understand what is helping or holding it back.",
    tone: "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-950/60",
  },
  {
    icon: FiTarget,
    title: "Improve ATS readiness",
    description:
      "Find formatting and keyword opportunities that can make your experience easier to scan.",
    tone: "text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-950/60",
  },
  {
    icon: FiZap,
    title: "Get clear next steps",
    description:
      "Turn feedback into practical improvements, so you know what to work on next.",
    tone: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60",
  },
];

const steps = [
  {
    number: "01",
    icon: FiUploadCloud,
    title: "Upload",
    description: "Add your resume securely as a PDF.",
  },
  {
    number: "02",
    icon: FiBarChart2,
    title: "Review",
    description: "See your scores and focused feedback in one place.",
  },
  {
    number: "03",
    icon: FiCheck,
    title: "Improve",
    description: "Make the changes that bring your experience forward.",
  },
];

export default function Home() {
  const [, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return;
    }

    const revealItems = page.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-sm font-bold text-white shadow-md shadow-cyan-900/20">
              R
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Resume<span className="text-cyan-600 dark:text-cyan-400">Analyzer</span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
            >
              How it works
            </a>
            <a
              href="/login"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Log in
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Get started <FiArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls={isMobileMenuOpen ? "mobile-navigation" : undefined}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/30 sm:hidden"
            />
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white px-5 pb-5 pt-3 shadow-xl sm:hidden dark:border-slate-800 dark:bg-slate-950"
            >
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center border-b border-slate-100 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center border-b border-slate-100 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                How it works
              </a>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Log in
                </a>
                <a
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-cyan-400 dark:text-slate-950"
                >
                  Get started <FiArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </nav>
          </>
        )}
      </header>

      <main className="pt-16">
        <section className="landing-hero relative isolate overflow-hidden">
          <div className="landing-orb landing-orb-cyan" aria-hidden="true" />
          <div className="landing-orb landing-orb-violet" aria-hidden="true" />
          <div className="landing-grid absolute inset-0 -z-10 opacity-30" aria-hidden="true" />

          <div className="mx-auto grid min-h-[660px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="relative z-10">
              <div className="landing-enter inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-1.5 text-sm font-medium text-cyan-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-cyan-300 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                </span>
                AI-powered resume feedback
              </div>

              <h1 className="landing-enter landing-delay-1 mt-7 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Your experience deserves{" "}
                <span className="landing-heading-gradient">a stronger first impression.</span>
              </h1>

              <p className="landing-enter landing-delay-2 mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Get a clearer picture of your resume, find ways to improve ATS
                compatibility, and take your next career step with confidence.
              </p>

              <div className="landing-enter landing-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#upload"
                  className="landing-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Analyze my resume <FiArrowRight size={18} aria-hidden="true" />
                </a>
                <a
                  href="#features"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Explore features
                </a>
              </div>

              <div className="landing-enter landing-delay-4 mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <FiShield className="text-emerald-300" aria-hidden="true" />
                  Private and secure
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiFileText className="text-cyan-300" aria-hidden="true" />
                  PDF resume support
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:mr-2">
              <div className="landing-float absolute -left-7 top-16 hidden h-20 w-20 rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-xl sm:block" aria-hidden="true" />
              <div className="landing-float landing-float-delayed absolute -right-4 bottom-12 hidden h-16 w-16 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 backdrop-blur-xl sm:block" aria-hidden="true" />

              <div className="landing-enter landing-delay-2 relative rounded-[28px] border border-white/15 bg-white/[0.08] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="rounded-[21px] bg-white p-5 text-slate-900 shadow-xl sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                        <FiFileText size={21} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold">Resume report</p>
                        <p className="text-xs text-slate-500">A sample of your results</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                      PREVIEW
                    </span>
                  </div>

                  <div className="mt-7 grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl bg-slate-50 p-4 sm:p-5">
                    <div className="landing-score-ring flex h-24 w-24 items-center justify-center rounded-full p-2">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-2xl font-bold tracking-tight">86</span>
                        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Score</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Strong foundation</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        A sample score preview. Your results come from your own resume.
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <FiCheck size={14} aria-hidden="true" />
                        Review key improvements
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-medium text-slate-700">ATS compatibility</span>
                        <span className="font-semibold text-slate-900">92%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="landing-progress h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-medium text-slate-700">Content clarity</span>
                        <span className="font-semibold text-slate-900">78%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="landing-progress landing-progress-delayed h-full w-[78%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                      <FiTarget size={17} aria-hidden="true" />
                    </span>
                    <p className="text-xs leading-5 text-slate-600">
                      Get focused recommendations based on your resume analysis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 left-5 hidden items-center gap-2 rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                  <FiCheck size={15} aria-hidden="true" />
                </span>
                Clear feedback. Practical next steps.
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
        </section>

        <section id="upload" className="scroll-mt-24 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <div data-reveal className="reveal-on-scroll mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                START WITH YOUR RESUME
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Your next step starts here
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Upload your PDF to get personalized analysis and actionable feedback.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <ResumeUpload
                onUploadSuccess={() =>
                  setRefreshTrigger((current: number) => current + 1)
                }
              />
            </div>
            <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><FiShield aria-hidden="true" /> Secure upload</span>
              <span className="inline-flex items-center gap-1.5"><FiFileText aria-hidden="true" /> PDF supported</span>
              <span className="inline-flex items-center gap-1.5"><FiZap aria-hidden="true" /> Clear feedback</span>
            </p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/80 py-8 dark:border-slate-800 dark:bg-slate-900/50">
          <div data-reveal className="reveal-on-scroll mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-3 sm:px-8">
            {[
              "Built for readable resumes",
              "Understand your ATS score",
              "Improve with clear feedback",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${index === 0 ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" : index === 1 ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                  <FiCheck size={15} aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 bg-white py-20 sm:py-28 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div data-reveal className="reveal-on-scroll mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                Make every detail count
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Everything you need to move forward
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                Understand what is working, what can improve, and where to focus next.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    data-reveal
                    style={{ transitionDelay: `${index * 100}ms` }}
                    className="reveal-on-scroll group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/70 dark:hover:border-cyan-900 dark:hover:shadow-black/20"
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-110 ${feature.tone}`}>
                      <FeatureIcon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-20 sm:py-28 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div data-reveal className="reveal-on-scroll mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
                A simple process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                From upload to improvement
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Get useful feedback in three straightforward steps.
              </p>
            </div>

            <div className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-5">
              <div className="absolute left-[17%] right-[17%] top-8 hidden h-px bg-gradient-to-r from-violet-200 via-cyan-300 to-emerald-200 md:block dark:from-violet-900 dark:via-cyan-800 dark:to-emerald-900" />
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <article
                    key={step.number}
                    data-reveal
                    style={{ transitionDelay: `${index * 120}ms` }}
                    className="reveal-on-scroll relative text-center"
                  >
                    <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white text-cyan-700 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:text-cyan-300">
                      <StepIcon size={23} aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-xs font-bold tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                      STEP {step.number}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div data-reveal className="reveal-on-scroll mt-14 text-center">
              <a
                href="#upload"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                Get started <FiArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Resume<span className="text-cyan-600 dark:text-cyan-400">Analyzer</span>
            </a>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Clear feedback for your next career move.
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="transition-colors hover:text-cyan-700 dark:hover:text-cyan-300">Features</a>
            <a href="/login" className="transition-colors hover:text-cyan-700 dark:hover:text-cyan-300">Log in</a>
            <span>© {new Date().getFullYear()} ResumeAnalyzer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
