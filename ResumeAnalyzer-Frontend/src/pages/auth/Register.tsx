import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
    registerSchema,
    type RegisterFormData,
} from "../../validations/registerSchema";
import { Userregister } from "../../services/authService";

function Register() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

const navigate = useNavigate();

const onSubmit = async (data: RegisterFormData) => {

    try {

        const response = await Userregister(data);

        alert(response.message);

        navigate("/");

    } catch (error) {

        console.error(error);

        alert("Registration failed");

    }

};
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid w-full gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
                    <div className="rounded-[1.5rem] bg-slate-800/90 p-6 text-white sm:p-8 lg:p-9">
                        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Resume Analyzer</p>
                        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Create your account</h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Join Resume Analyzer to start reviewing resumes, tracking applicants, and managing your hiring process from one dashboard.
                        </p>

                        <div className="mt-6 grid gap-3 text-slate-300 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                                <p className="text-sm font-semibold text-cyan-300">Fast setup</p>
                                <p className="mt-1 text-sm text-slate-400">Register quickly with a clean sign up experience.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
                                <p className="text-sm font-semibold text-cyan-300">Secure access</p>
                                <p className="mt-1 text-sm text-slate-400">Your account stays protected with secure authentication.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] bg-slate-800/90 p-6 shadow-slate-950/10 sm:p-8 lg:p-9">
                        <div className="mb-5">
                            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Welcome</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Register your team</h2>
                            <p className="mt-2 text-sm text-slate-400">Create an account and start analyzing resumes right away.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                                <input
                                    {...register("fullName")}
                                    placeholder="Jane Doe"
                                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                />
                                {errors.fullName?.message && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                                <input
                                    {...register("email")}
                                    placeholder="name@company.com"
                                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                />
                                {errors.email?.message && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                                <input
                                    type="password"
                                    {...register("password")}
                                    placeholder="Create a password"
                                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                />
                                {errors.password?.message && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Register
                            </button>
                        </form>
                        <p className="mt-5 text-center text-sm text-slate-400">
                            Already have an account? <span className="font-semibold text-cyan-300">Login now</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;