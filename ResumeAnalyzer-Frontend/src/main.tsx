import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { UploadProvider } from "./context/UploadContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
         <ThemeProvider>  
                <AuthProvider>
                    <UploadProvider>
                    <App />
                    </UploadProvider>
                </AuthProvider>
         </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);