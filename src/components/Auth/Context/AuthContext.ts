import {ClientPrivate} from "../../../models/client/ClientPrivate.ts";
import {createContext} from "react";

interface AuthContextProps {
    isLoggedIn: boolean;
    loading: boolean;
    client: ClientPrivate | null;
    loginProp: (accessToken: string) => Promise<void>;
    logoutProp: () => Promise<void>;
    updateClient: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
