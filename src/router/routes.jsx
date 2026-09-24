import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import AuthProtector from "@/router/guard/AuthProtector";
import Sidebar from "@/components/layout/sidebar/Sidebar";

import Login from "@/pages/auth/Login";
import ActivateAccount from "@/pages/auth/ActivateAccount";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateRequest from "@/pages/request/CreateRequest";
import Notifications from "@/pages/notifications/Notifications";
import SubmissionRequests from "@/pages/submission-requests/SubmissionRequests";
import SubmissionRequestDetail from "@/pages/submission-requests/SubmissionRequestDetail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Login /> },
            { path: "activate-account", element: <ActivateAccount /> },
        ],
    },
    {
        element: <AuthProtector />,
        children: [
            {
                element: <Sidebar />,
                children: [
                    { path: "dashboard", element: <Dashboard />, handle: { crumb: () => "Dashboard" } },
                    { path: "create-request", element: <CreateRequest />, handle: { crumb: () => "Create Request" } },
                    { path: "notifications", element: <Notifications />, handle: { crumb: () => "Notifications" } },
                    { path: "submission-requests", element: <SubmissionRequests />, handle: { crumb: () => "Submission Requests" } },
                    { path: "submission-requests/:id", element: <SubmissionRequestDetail />, handle: { crumb: () => "Request Details" } },
                ],
            },
        ],
    },
]);