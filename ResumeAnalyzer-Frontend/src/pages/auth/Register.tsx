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
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
                <div className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                    <div className="rounded-[1.75rem] bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-slate-950/30 p-8 text-white shadow-inner shadow-cyan-500/5 lg:p-10">
                        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Resume Analyzer</p>
                        <h1 className="mt-5 text-4xl font-semibold text-white">Create your account</h1>
                        <p className="mt-4 max-w-xl text-slate-300">Join Resume Analyzer to start reviewing resumes, tracking applicants, and managing your hiring process from one dashboard.</p>

                        <div className="mt-8 grid gap-4 text-slate-300 sm:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                                <p className="text-sm font-semibold text-cyan-300">Fast setup</p>
                                <p className="mt-2 text-sm text-slate-300">Register quickly with a clean sign up experience.</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                                <p className="text-sm font-semibold text-cyan-300">Secure access</p>
                                <p className="mt-2 text-sm text-slate-300">Your account stays protected with secure authentication.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-slate-950/95 p-8 shadow-slate-950/10 lg:p-10">
                        <div className="mb-6">
                            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Welcome</p>
                            <h2 className="mt-2 text-3xl font-semibold text-white">Register your team</h2>
                            <p className="mt-3 text-sm text-slate-400">Create an account and start analyzing resumes right away.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                                <input
                                    {...register("fullName")}
                                    placeholder="Jane Doe"
                                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
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
                                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
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
                                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                />
                                {errors.password?.message && (
                                    <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Register
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Already have an account? <span className="font-semibold text-cyan-300">Login now</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;