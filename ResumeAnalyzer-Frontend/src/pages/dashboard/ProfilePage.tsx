export default function ProfilePage() {
  const profile = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    role: "Product Designer",
    location: "New York, USA",
    bio: "I build user-centered product experiences and enjoy turning complex ideas into clear, measurable outcomes.",
  };

  const skills = ["UX Design", "Figma", "Research", "Product Strategy", "AI Tools"];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
              AJ
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {profile.role} • {profile.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Edit profile
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            About
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {profile.bio}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {profile.email}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Location
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {profile.location}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-medium text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
