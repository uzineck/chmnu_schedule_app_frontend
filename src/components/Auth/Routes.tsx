import Login from "./Login/Login.tsx";
import ProtectedRoute from "../Routers/ProtectedRouter.tsx";
import Logout from "./Logout/Logout.tsx";


export const authRoutes = [
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "logout",
        element: <ProtectedRoute><Logout /></ProtectedRoute>,
    },
];