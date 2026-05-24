import SubjectManagePage from "./SubjectManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const subjectFormRoutes = [
    {
        path: "subject",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.SUBJECT_MANAGER]}>
                <SubjectManagePage />
            </ProtectedRoute>
        ),
    },
];
