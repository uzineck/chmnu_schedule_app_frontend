import FacultyManagePage from "./FacultyManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const facultyFormRoutes = [
    {
        path: "faculty",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.FACULTY_MANAGER]}>
                <FacultyManagePage />
            </ProtectedRoute>
        ),
    },
];
