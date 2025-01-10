import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import HeadmanGroupScreen from "./HeadmanGroupScreen.tsx";

export const headmanRoutes = [
    {
        path: "manage",
        element: <ProtectedRoute roles={[ClientRole.HEADMAN]}><HeadmanGroupScreen /></ProtectedRoute>
    }
];