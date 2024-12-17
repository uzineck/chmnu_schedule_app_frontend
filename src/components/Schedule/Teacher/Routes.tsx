import TeacherScreen from "./TeacherScreen.tsx";


export const teacherRoutes = [
    {
        path: "teacher",
        children: [
            { index: true, element: <TeacherScreen /> },
            { path: ":teacherUuid/lessons", element: <TeacherScreen /> },
        ],
    },
];