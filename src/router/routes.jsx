import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Sidebar from "@/components/layout/sidebar/Sidebar";

import Login from "@/pages/auth/Login";
import ActivateAccount from "@/pages/auth/ActivateAccount";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateRequest from "@/pages/request/CreateRequest";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            { index:true, element: <Login/>},
            {path:"activate-account", element:<ActivateAccount/>}
        ],
    },
    {
        path: "/",
        element: <Sidebar />,
        children: [
            { path: "dahsboard", element: <Dashboard />, handle: { crumb: () => "Dashboard" }},
            { path:"create-request", element: <CreateRequest/>, handle: { crumb: () => "Create Request" }}
        ],
    },
]);