import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
//import NotFound from "../pages/error/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import ResumeDetails from "../pages/ResumeDetails";

function AppRoutes() {
    return (
        <Routes>
            {/* <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} /> */}

             {/* Public Routes */}

            <Route path="/" element={<Login />} />

            <Route path="/login"  element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
           </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/resume/:id" element={<ResumeDetails />}/>
           </Route>
           

        </Routes>
    );
}

export default AppRoutes;