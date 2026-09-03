import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardHome from "../pages/dashboard/DashboardHome";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import ResumeList from "../components/ResumeList";
import ResumeDetails from "../pages/ResumeDetails";
import ResumeUpload from "../components/ResumeUpload";

function AppRoutes() {

    return (
        <Routes>

            {/* ====================== */}
            {/* PUBLIC */}
            {/* ====================== */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ====================== */}
            {/* AUTHENTICATED */}
            {/* ====================== */}

            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardHome />}
                    />

                    <Route
                        path="/resumes"
                        element={
                            <ResumeList refreshTrigger={0} />
                        }
                    />

                     <Route
                        path="/upload"
                        element={
                            <ResumeUpload onUploadSuccess={function (): void {
                                throw new Error("Function not implemented.");
                            } }/>
                        }
                    />

                    <Route
                        path="/resume/:id"
                        element={<ResumeDetails />}
                    />

                </Route>

            </Route>

        </Routes>
    );
}

export default AppRoutes;