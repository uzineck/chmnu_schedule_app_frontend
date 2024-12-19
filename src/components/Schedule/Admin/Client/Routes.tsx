import ClientCard from "../Client/ClientCard.tsx";
import SignUp from "./Forms/SignUp.tsx";
import GetClientInfo from "./Forms/GetClientInfo.tsx";

export const clientFormRoutes =[
    {
        path: "client",
        element: <ClientCard />,
        children: [
            { path: "get_client_info", element: <GetClientInfo />},
            { path: "create_client", element: <SignUp />},
        ],
    },
]