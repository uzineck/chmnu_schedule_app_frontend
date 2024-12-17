import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import CreateLesson from "./Forms/CreateLesson.tsx";
import AddLesson from "./AddLesson.tsx";
import UpdateLesson from "./Forms/UpdateLesson.tsx";
import DeleteLesson from "./DeleteLesson.tsx";


export const lessonRoutes = [
    { path: "lesson/create", element: <ProtectedRoute><CreateLesson /></ProtectedRoute> },
    { path: "lesson/:lessonUuid/add", element: <ProtectedRoute><AddLesson /></ProtectedRoute> },
    { path: "lesson/:lessonUuid/edit", element: <ProtectedRoute><UpdateLesson /></ProtectedRoute> },
    { path: "lesson/:lessonUuid/delete", element: <ProtectedRoute><DeleteLesson /></ProtectedRoute> },
];