import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import CreateLesson from "./Forms/CreateLesson.tsx";
import AddLesson from "./Actions/AddLesson.tsx";
import EditLesson from "./Forms/EditLesson.tsx";
import DeleteLesson from "./Actions/DeleteLesson.tsx";
import UpdateLesson from "./Actions/UpdateLesson.tsx";
import {Outlet} from "react-router-dom";
import {ClientRole} from "../../../models/enums/ClientRole.ts";

const LESSON_EDIT_ROLES = [ClientRole.ADMIN, ClientRole.HEADMAN, ClientRole.SCHEDULE_MANAGER];

export const lessonRoutes = [
    {
        path: "lesson",
        element: <ProtectedRoute roles={LESSON_EDIT_ROLES}><Outlet /></ProtectedRoute>,
        children: [
            { path: "create", element: <CreateLesson /> },
            { path: ":lessonUuid/add", element: <AddLesson /> },
            { path: ":lessonUuid/edit", element: <EditLesson /> },
            { path: ":lessonUuid/delete", element: <DeleteLesson /> },
            { path: ":oldLessonUuid/update/:newLessonUuid", element: <UpdateLesson /> },
        ],
    },
];