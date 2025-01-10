import SubjectCard from "./SubjectCard.tsx";
import CreateSubject from "./Forms/CreateSubject.tsx";
import UpdateSubjectTitle from "./Forms/UpdateSubjectTitle.tsx";
import DeleteSubject from "./Forms/DeleteSubject.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const subjectFormRoutes = [
    {
        path: "subject",
        element:  <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.SUBJECT_MANAGER]}><SubjectCard /></ProtectedRoute>,
        children: [
            { path: "create_subject", element: <CreateSubject /> },
            { path: "update_subject_title", element: <UpdateSubjectTitle /> },
            { path: "delete_subject", element: <DeleteSubject /> },
        ],
    },
]