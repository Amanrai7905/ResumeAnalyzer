interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}: LoginRequiredModalProps) {

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
            🔐
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Login required
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create a free account or login to analyze your resume
            and view your personalized resume score and AI feedback.
          </p>

        </div>


        <div className="mt-7 space-y-3">

          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Login
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Free Account
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-5 py-3 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}