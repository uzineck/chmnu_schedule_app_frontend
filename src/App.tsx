import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import { AuthProvider } from "./components/Auth/Context/AuthProvider.tsx";
import { RoleProvider } from "./components/Auth/Context/RoleProvider.tsx";
import { TimeProvider } from "./components/Schedule/Time/Context/TimeContext.tsx";
import ProtectedRoute from "./components/Routers/ProtectedRouter.tsx";

import Profile from "./components/Auth/Client/Profile.tsx";
import Login from "./components/Auth/Login/Login.tsx";
import Logout from "./components/Auth/Logout/Logout.tsx";
import GroupScreen from "./components/Schedule/Group/GroupScreen.tsx";
import TeacherScreen from "./components/Schedule/Teacher/TeacherScreen.tsx";
import ChangeEmailForm from "./components/Auth/Client/Forms/ChangeEmailForm.tsx";
import ChangePasswordForm from "./components/Auth/Client/Forms/ChangePasswordForm.tsx";
import ChangeCredentialsForm from "./components/Auth/Client/Forms/ChangeCredentialsForm.tsx";
import {Header} from "./components/Header/Header.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <RoleProvider>
                    <TimeProvider>
                        <Header />
                        <Outlet />
                    </TimeProvider>
                </RoleProvider>
            </AuthProvider>
        ),
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "logout",
                element: <ProtectedRoute><Logout /></ProtectedRoute>,
            },
            {
                path: "group",
                children: [
                    { index: true, element: <GroupScreen /> },
                    { path: ":groupUuid", element: <GroupScreen /> },
                ],
            },
            {
                path: "teacher",
                children: [
                    { index: true, element: <TeacherScreen /> },
                    { path: ":teacherUuid", element: <TeacherScreen /> },
                ],
            },
            {
                path: "profile",
                element: <ProtectedRoute><Profile /></ProtectedRoute>,
                children: [
                    { path: "change_email", element: <ChangeEmailForm /> },
                    { path: "change_password", element: <ChangePasswordForm /> },
                    { path: "change_credentials", element: <ChangeCredentialsForm /> },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
