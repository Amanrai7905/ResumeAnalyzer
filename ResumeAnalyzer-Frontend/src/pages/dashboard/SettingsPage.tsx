export default function SettingsPage() {
  const preferences = [
    { label: "Email notifications", value: "Enabled" },
    { label: "Resume analysis alerts", value: "On" },
    { label: "AI recommendations", value: "Personalized" },
    { label: "Dark mode", value: "System default" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Preferences
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Settings
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
          >
            Save changes
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Account preferences
          </h2>

          <div className="mt-5 space-y-4">
            {preferences.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Security
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Last changed 3 months ago
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Two-factor authentication
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Recommended for better account protection
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
