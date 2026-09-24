import api from "@/lib/axios";

export const GetNotifications = async ({ page = 1, filter = "all" } = {}) => {
    const response = await api.get("/teacher/notifications", {
        params: { page, filter },
    });
    return response.data;
};

export const GetUnreadCount = async () => {
    const response = await api.get("/teacher/notifications/unread-count");
    return response.data;
};

export const MarkAsRead = async (id) => {
    const response = await api.post(`/teacher/notifications/${id}/read`);
    return response.data;
};

export const MarkAllAsRead = async () => {
    const response = await api.post("/teacher/notifications/mark-all-read");
    return response.data;
};