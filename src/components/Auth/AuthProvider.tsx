import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
    isLoggedIn: boolean;
    loginProp: ( accessToken: string, refreshToken: string) => void;
    logoutProp: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    const loginProp = (accessToken: string, refreshToken: string) => {
        setIsLoggedIn(true);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

    };

    const logoutProp = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loginProp, logoutProp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
