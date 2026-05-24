import TeacherManagePage from "./TeacherManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const teacherFormRoutes = [
    {
        path: "teacher",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.TEACHER_MANAGER]}>
                <TeacherManagePage />
            </ProtectedRoute>
        ),
    },
];
