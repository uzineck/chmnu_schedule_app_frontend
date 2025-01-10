import TeacherCard from "./TeacherCard.tsx";
import CreateTeacher from "./Forms/CreateTeacher.tsx";
import UpdateTeacherName from "./Forms/UpdateTeacherName.tsx";
import UpdateTeacherRank from "./Forms/UpdateTeacherRank.tsx";
import DeactivateTeacher from "./Forms/DeactivateTeacher.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const teacherFormRoutes = [
    {
        path: "teacher",
        element:  <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.TEACHER_MANAGER]}><TeacherCard /></ProtectedRoute>,
        children: [
            { path: "create_teacher", element: <CreateTeacher /> },
            { path: "update_teacher_name", element: <UpdateTeacherName /> },
            { path: "update_teacher_rank", element: <UpdateTeacherRank /> },
            { path: "deactivate_teacher", element: <DeactivateTeacher /> },

        ],
    },
]