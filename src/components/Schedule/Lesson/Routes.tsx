import CreateLesson from "./Forms/CreateLesson.tsx";
import EditLesson from "./Forms/EditLesson.tsx";

/**
 * Lesson modal routes are nested children of the editable schedule screens
 * (Admin :groupUuid/lessons + Headman manage). Mounting them here keeps the
 * surrounding schedule screen rendered (via <Outlet />) while the modal is
 * open, and gives URLs the proper group context (e.g.
 * /admin/manage/schedule/group/:groupUuid/lessons/lesson/:lessonUuid/edit).
 *
 * Access control comes from the parent route's ProtectedRoute.
 */
export const lessonChildRoutes = [
    { path: "lesson/create", element: <CreateLesson /> },
    { path: "lesson/:lessonUuid/edit", element: <EditLesson /> },
];
