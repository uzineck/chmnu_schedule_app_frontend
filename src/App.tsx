import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import { AuthProvider } from "./components/Auth/Context/providers/AuthProvider.tsx";
import { RoleProvider } from "./components/Auth/Context/providers/RoleProvider.tsx";
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
import AdminPanel from "./components/Schedule/Admin/AdminPanel.tsx";
import {ClientRole} from "./models/enums/ClientRole.ts";
import HeadmanGroupScreen from "./components/Schedule/Group/Headman/HeadmanGroupScreen.tsx";
import AddLesson from "./components/Schedule/Lesson/AddLesson.tsx";
import DeleteLesson from "./components/Schedule/Lesson/DeleteLesson.tsx";
import CreateLesson from "./components/Schedule/Lesson/Forms/CreateLesson.tsx";
import UpdateLesson from "./components/Schedule/Lesson/Forms/UpdateLesson.tsx";
import {ScheduleProvider} from "./components/Schedule/Context/providers/ScheduleProvider.tsx";
import {TimeProvider} from "./components/Schedule/Context/providers/TimeProvider.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <RoleProvider>
                    <TimeProvider>
                        <ScheduleProvider>
                            <Header />
                            <Outlet />
                        </ScheduleProvider>
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
                    {  path: ":groupUuid/lessons", element: <GroupScreen /> },
                    {
                        path: "manage",
                        element: <ProtectedRoute role={ClientRole.HEADMAN}><HeadmanGroupScreen /></ProtectedRoute>,
                        children: [
                            { path: "lesson/create", element: <CreateLesson /> },
                            { path: "lesson/:lessonUuid/add", element: <AddLesson /> },
                            { path: "lesson/:lessonUuid/edit", element: <UpdateLesson /> },
                            { path: "lesson/:lessonUuid/delete", element: <DeleteLesson /> },
                        ]
                    }
                ],
            },
            {
                path: "teacher",
                children: [
                    { index: true, element: <TeacherScreen /> },
                    { path: ":teacherUuid/lessons", element: <TeacherScreen /> },
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
            {
                path: "admin",
                element: <ProtectedRoute role={ClientRole.ADMIN}><AdminPanel/></ProtectedRoute>,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
