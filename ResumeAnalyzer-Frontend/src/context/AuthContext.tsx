import { createContext,useContext,useEffect,useState, type ReactNode} from "react";
import { storage } from "../utils/storage";

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
     const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = storage.getAccessToken();

        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAccessToken(token);
        }
        setLoading(false);
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        storage.setAccessToken(accessToken);
        storage.setRefreshToken(refreshToken);

        setAccessToken(accessToken);
    };

    const logout = () => {
        storage.clear();
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}