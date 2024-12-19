import ClientCard from "../Client/ClientCard.tsx";
import SignUp from "./Forms/SignUp.tsx";

export const clientFormRoutes = [
    {
        path: "client",
        element: <ClientCard />,
        children: [
            { path: "create_client", element: <SignUp />},
        ],
    },
]