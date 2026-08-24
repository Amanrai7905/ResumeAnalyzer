import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import {loginSchema,type LoginFormData,} from "../../validations/authValidation";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setAuthError(null);

        try {
            const response = await loginUser(data);
            login(
            response.accessToken,
            response.refreshToken
            );
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setAuthError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-6 lg:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
                        <div className="rounded-[1.5rem] bg-slate-800/90 p-6 sm:p-8 lg:p-9">
                            <div className="mb-6 sm:mb-8">
                                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                                    Resume Analyzer
                                </p>
                                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                                    Welcome back
                                </h1>
                                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                                    Log in to track candidates, review resumes, and speed up your hiring workflow.
                                </p>
                            </div>

                            <div className="space-y-3 text-slate-300">
                                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                                    <p className="text-sm font-semibold text-cyan-300">Fast onboarding</p>
                                    <p className="mt-1 text-sm text-slate-400">Get access to your recruiter dashboard immediately.</p>
                                </div>
                                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                                    <p className="text-sm font-semibold text-cyan-300">Secure sessions</p>
                                    <p className="mt-1 text-sm text-slate-400">Your credentials are protected with safe token storage.</p>
                                </div>
                                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                                    <p className="text-sm font-semibold text-cyan-300">Clear insights</p>
                                    <p className="mt-1 text-sm text-slate-400">Easily access candidate analytics and resume summaries.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] bg-slate-800/90 p-6 shadow-slate-950/10 sm:p-8 lg:p-9">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                                        Sign in
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                                        Welcome back
                                    </h2>
                                </div>
                                <Link
                                    to="/register"
                                    className="rounded-2xl border border-cyan-400/20 bg-slate-900/80 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/10"
                                >
                                    Create account
                                </Link>
                            </div>

                            {authError && (
                                <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                                    {authError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="mb-2.5 block text-sm font-medium text-slate-300">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="name@company.com"
                                    />
                                    {errors.email?.message && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2.5 block text-sm font-medium text-slate-300">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="Enter your password"
                                    />
                                    {errors.password?.message && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                                        <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400" />
                                        Remember me
                                    </label>
                                    <Link to="#" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
                                        Forgot password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Signing in..." : "Sign In"}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                By signing in, you agree to our{' '}
                                <Link to="#" className="text-slate-200 underline decoration-dashed decoration-cyan-300/50">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link to="#" className="text-slate-200 underline decoration-dashed decoration-cyan-300/50">
                                    Privacy
                                </Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
