import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";

function App() {
    const { loading } = useAuth();
    const [startupDelayElapsed, setStartupDelayElapsed] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setStartupDelayElapsed(true), 1000);
        return () => window.clearTimeout(timer);
    }, []);

    if (loading || !startupDelayElapsed) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <main>
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;