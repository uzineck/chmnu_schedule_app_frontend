import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import Profile from "./Profile.tsx";
import ChangeEmailForm from "./Forms/ChangeEmailForm.tsx";
import ChangePasswordForm from "./Forms/ChangePasswordForm.tsx";
import ChangeCredentialsForm from "./Forms/ChangeCredentialsForm.tsx";


export const clientRoutes = [
    {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
        children: [
            { path: "change_email", element: <ChangeEmailForm /> },
            { path: "change_password", element: <ChangePasswordForm /> },
            { path: "change_credentials", element: <ChangeCredentialsForm /> },
        ],
    },
];