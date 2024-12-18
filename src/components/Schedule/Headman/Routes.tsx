import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import HeadmanGroupScreen from "./HeadmanGroupScreen.tsx";

export const headmanRoutes = [
    {
        path: "manage",
        element: <ProtectedRoute role={ClientRole.HEADMAN}><HeadmanGroupScreen /></ProtectedRoute>
    }
];