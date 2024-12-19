import TeacherCard from "./TeacherCard.tsx";
import CreateTeacher from "./Forms/CreateTeacher.tsx";
import UpdateTeacherName from "./Forms/UpdateTeacherName.tsx";
import UpdateTeacherRank from "./Forms/UpdateTeacherRank.tsx";
import DeactivateTeacher from "./Forms/DeactivateTeacher.tsx";

export const teacherFormRoutes = [
    {
        path: "teacher",
        element: <TeacherCard />,
        children: [
            { path: "create_teacher", element: <CreateTeacher /> },
            { path: "update_teacher_name", element: <UpdateTeacherName /> },
            { path: "update_teacher_rank", element: <UpdateTeacherRank /> },
            { path: "deactivate_teacher", element: <DeactivateTeacher /> },

        ],
    },
]