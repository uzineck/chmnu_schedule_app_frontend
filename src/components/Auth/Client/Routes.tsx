import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import Profile from "./Profile.tsx";


export const clientRoutes = [
    {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
];
