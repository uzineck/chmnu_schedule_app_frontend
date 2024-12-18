import Login from "./Login/Login.tsx";
import ProtectedRoute from "../Routers/ProtectedRouter.tsx";
import Logout from "./Logout/Logout.tsx";
import Unauthorized from "./Unauthorized.tsx";


export const authRoutes = [
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "logout",
        element: <ProtectedRoute><Logout /></ProtectedRoute>,
    },
    {
        path: "unauthorized",
        element: <Unauthorized />
    }
];