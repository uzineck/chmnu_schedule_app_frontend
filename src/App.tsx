import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {ConfigProvider} from "antd";
import { AuthProvider } from "./components/Auth/Context/providers/AuthProvider.tsx";
import { RoleProvider } from "./components/Auth/Context/providers/RoleProvider.tsx";
import {Header} from "./components/Header/Header.tsx";
import {ScheduleProvider} from "./components/Schedule/Context/providers/ScheduleProvider.tsx";
import {TimeProvider} from "./components/Schedule/Context/providers/TimeProvider.tsx";
import {lessonRoutes} from "./components/Schedule/Lesson/Routes.tsx";
import {adminRoutes} from "./components/Schedule/Admin/Routes.tsx";
import {clientRoutes} from "./components/Auth/Client/Routes.tsx";
import {authRoutes} from "./components/Auth/Routes.tsx";
import {groupRoutes} from "./components/Schedule/Group/Routes.tsx";
import {teacherRoutes} from "./components/Schedule/Teacher/Routes.tsx";
import {GlobalStyle} from "./styles/GlobalStyle.ts";
import {theme} from "./styles/theme.ts";

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
            ...authRoutes,
            ...groupRoutes,
            ...teacherRoutes,
            ...clientRoutes,
            ...adminRoutes,
            ...lessonRoutes
        ],
    },
]);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <ConfigProvider theme={{token: {colorPrimary: theme.colors.primary}}}>
                <GlobalStyle />
                <RouterProvider router={router} />
            </ConfigProvider>
        </ThemeProvider>
    );
}

export default App;
