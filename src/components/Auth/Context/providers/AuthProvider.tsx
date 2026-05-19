import React, {useCallback, useEffect, useState} from "react";
import {ClientPrivate} from "../../../../models/client/ClientPrivate.ts";
import {getClientInfo} from "../../../../api/client/client.ts";
import {AuthContext} from "../AuthContext.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [client, setClient] = useState<ClientPrivate | null>(null);
    const [loading, setLoading] = useState(true);

    const logoutProp = useCallback(() => {
        setIsLoggedIn(false);
        setClient(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("lastPath");
        localStorage.removeItem("lastGroupUuid");
        localStorage.removeItem("lastSubgroup");
        localStorage.removeItem("lastTeacherUuid");
        localStorage.removeItem("lastWeekType");
    }, []);

    const fetchClientInfo = useCallback(async () => {
        try {
            const response = await getClientInfo();
            setClient(response.data);
            setIsLoggedIn(true);
        } catch {
            logoutProp();
        } finally {
            setLoading(false);
        }
    }, [logoutProp]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            fetchClientInfo();
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, [fetchClientInfo]);

    const loginProp = useCallback(async (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        await fetchClientInfo();
    }, [fetchClientInfo]);

    const updateClient = useCallback(() => {
        fetchClientInfo();
    }, [fetchClientInfo]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, client, loginProp, logoutProp, updateClient }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};


