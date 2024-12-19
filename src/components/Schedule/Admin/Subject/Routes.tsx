import SubjectCard from "./SubjectCard.tsx";
import CreateSubject from "./Forms/CreateSubject.tsx";
import UpdateSubjectTitle from "./Forms/UpdateSubjectTitle.tsx";
import DeleteSubject from "./Forms/DeleteSubject.tsx";

export const subjectFormRoutes = [
    {
        path: "subject",
        element: <SubjectCard />,
        children: [
            { path: "create_subject", element: <CreateSubject /> },
            { path: "update_subject_title", element: <UpdateSubjectTitle /> },
            { path: "delete_subject", element: <DeleteSubject /> },
        ],
    },
]