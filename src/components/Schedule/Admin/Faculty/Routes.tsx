import FacultyCard from "./FacultyCard.tsx";
import CreateFaculty from "./Forms/CreateFaculty.tsx";
import UpdateFacultyName from "./Forms/UpdateFacultyName.tsx";
import UpdateFacultyCodeName from "./Forms/UpdateFacultyCodeName.tsx";
import DeleteFaculty from "./Forms/DeleteFaculty.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";


export const facultyFormRoutes = [
    {
        path: "faculty",
        element:  <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.FACULTY_MANAGER]}><FacultyCard /></ProtectedRoute>,
        children: [
            { path: "create_faculty", element: <CreateFaculty /> },
            { path: "update_faculty_name", element: <UpdateFacultyName /> },
            { path: "update_faculty_code_name", element: <UpdateFacultyCodeName /> },
            { path: "delete_faculty", element: <DeleteFaculty /> },
        ],
    }
]