import React, {useCallback, useEffect, useRef, useState} from "react";
import {ClientPrivate} from "../../../../models/client/ClientPrivate.ts";
import {getClientInfo} from "../../../../api/client/client.ts";
import {logout as logoutApi} from "../../../../api/client/auth.ts";
import {AUTH_EXPIRED_EVENT} from "../../../../api/index.ts";
import {AuthContext} from "../AuthContext.ts";

const VOLATILE_AUTH_KEYS = [
    "accessToken",
    "lastPath",
    "lastWeekType",
    "weekTypeMemo",
    "phoneDayMemo",
    "tabletPageMemo",
];

const clearVolatileAuthState = () => {
    for (const key of VOLATILE_AUTH_KEYS) {
        localStorage.removeItem(key);
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [client, setClient] = useState<ClientPrivate | null>(null);
    const [loading, setLoading] = useState(true);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const applyLoggedOutState = useCallback(() => {
        clearVolatileAuthState();
        if (!mountedRef.current) return;
        setIsLoggedIn(false);
        setClient(null);
    }, []);

    /**
     * Fetch client info and update auth state. THROWS on failure so callers
     * (loginProp, initial bootstrap) can distinguish success from silent fail.
     */
    const refreshClient = useCallback(async (): Promise<ClientPrivate> => {
        const response = await getClientInfo();
        if (mountedRef.current) {
            setClient(response.data);
            setIsLoggedIn(true);
        }
        return response.data;
    }, []);

    // Initial bootstrap: if we have a stored access token, try to hydrate
    // client info. On failure, log out locally (no server hit — refresh
    // cookie may still be valid, just no working token).
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                await refreshClient();
            } catch {
                if (!cancelled) applyLoggedOutState();
            } finally {
                if (!cancelled && mountedRef.current) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshClient, applyLoggedOutState]);

    // Listen for the Http wrapper's "refresh failed, session is dead" signal.
    // Forced logout on a session that was previously alive — keep it quiet:
    // no toast here (the in-flight request's caller will surface a single
    // friendly "Сесія завершена" message), just sync the React state so
    // ProtectedRoute starts redirecting to /login.
    useEffect(() => {
        const handler = () => applyLoggedOutState();
        window.addEventListener(AUTH_EXPIRED_EVENT, handler);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
    }, [applyLoggedOutState]);

    const loginProp = useCallback(async (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        try {
            await refreshClient();
        } catch (err) {
            // Token was stored but the follow-up info fetch failed —
            // we are NOT actually logged in. Roll back local state and
            // re-throw so the caller can show a meaningful error.
            applyLoggedOutState();
            throw err;
        }
    }, [refreshClient, applyLoggedOutState]);

    const logoutProp = useCallback(async () => {
        // Best-effort server logout (invalidates refresh cookie). Swallow
        // network errors here — local state must always be cleared.
        try {
            await logoutApi();
        } catch {
            // ignore — local cleanup is what matters
        }
        applyLoggedOutState();
    }, [applyLoggedOutState]);

    const updateClient = useCallback(async () => {
        try {
            await refreshClient();
        } catch {
            applyLoggedOutState();
        }
    }, [refreshClient, applyLoggedOutState]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                loading,
                client,
                loginProp,
                logoutProp,
                updateClient,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
