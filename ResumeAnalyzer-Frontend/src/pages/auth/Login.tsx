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
        <div className="min-h-screen bg-slate-800 text-slate-100">       
            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
                <div className="w-full border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-10">
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                        <div className="rounded-[1.75rem] bg-slate-800 p-8 lg:p-10">
                            <div className="mb-8">
                                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                                    Resume Analyzer
                                </p>
                                <h1 className="mt-4 text-4xl font-semibold text-white">
                                    Welcome back
                                </h1>
                                <p className="mt-4 max-w-md text-slate-400">
                                    Log in to track candidates, review resumes, and speed up your hiring workflow.
                                </p>
                            </div>

                            <div className="space-y-4 text-slate-300">
                                <div className="rounded-3xl border border-slate-200/70 bg-slate-100/80 p-5 text-slate-700 transition duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                                    <p className="text-sm font-semibold text-cyan-300">Fast onboarding</p>
                                    <p className="mt-2 text-sm">Get access to your recruiter dashboard immediately.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200/70 bg-slate-100/80 p-5 text-slate-700 transition duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                                    <p className="text-sm font-semibold text-cyan-300">Secure sessions</p>
                                    <p className="mt-2 text-sm">Your credentials are protected with safe token storage.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200/70 bg-slate-100/80 p-5 text-slate-700 transition duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                                    <p className="text-sm font-semibold text-cyan-300">Clear insights</p>
                                    <p className="mt-2 text-sm">Easily access candidate analytics and resume summaries.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] bg-slate-800 p-8 shadow-slate-950/10 lg:p-10">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                                        Sign in
                                    </p>
                                    <h2 className="mt-2 text-3xl font-semibold text-white">
                                        Clean login form
                                    </h2>
                                </div>
                                <Link
                                    to="/register"
                                    className="rounded-2xl border border-cyan-300/20 bg-slate-900/80 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/10"
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
                                    <label className="mb-3 block text-sm font-medium text-slate-300">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        placeholder="name@company.com"
                                    />
                                    {errors.email?.message && (
                                        <p className="mt-2 text-sm text-rose-400">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-slate-300">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
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
                                    className="flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
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
