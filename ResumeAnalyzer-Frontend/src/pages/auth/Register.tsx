import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import {
    registerSchema,
    type RegisterFormData,
} from "../../validations/registerSchema";
import { Userregister } from "../../services/authService";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await Userregister(data);
            alert(response.message);
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* Header with Logo */}
                <div className="border-b border-slate-200 p-6 text-center">
                    <div className="text-2xl font-bold">
                        Resume<span className="text-cyan-400">Analyzer</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <Link
                        to="/login"
                        className="flex-1 px-4 py-3 text-center font-semibold text-slate-500 transition hover:text-slate-700"
                    >
                        Login
                    </Link>
                    <button className="flex-1 border-b-2 border-blue-600 px-4 py-3 text-center font-semibold text-blue-600 transition">
                        Register
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Google Signup Button */}
                    <button className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <image
                                href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext x='0' y='16' font-size='20' font-weight='bold'%3EG%3C/text%3E%3C/svg%3E"
                                width="20"
                                height="20"
                            />
                        </svg>
                        Sign up With Google
                    </button>

                    {/* Divider */}
                    <div className="my-4 flex items-center gap-4">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <span className="text-sm text-slate-500">OR</span>
                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Full Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("fullName")}
                                placeholder="Jane Doe"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.fullName?.message && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="example@email.com"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.email?.message && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Create a password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.password?.message && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-600">
                                I agree to the{" "}
                                <Link to="#" className="font-semibold text-blue-600 hover:text-blue-700">
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-4 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;