import api from "@/lib/axios";

export const GetSubmissionRequests = async ({ page = 1, status = "All" } = {}) => {
    const response = await api.get("/teacher/submission-requests", {
        params: { page, status },
    });
    return response.data;
};

export const GetSubmissionRequest = async (id) => {
    const response = await api.get(`/teacher/submission-requests/${id}`);
    return response.data;
};

export const AcknowledgeRequest = async (id) => {
    const response = await api.post(`/teacher/submission-requests/${id}/acknowledge`);
    return response.data;
};

export const SubmitDocument = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/teacher/submission-requests/${id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const ResubmitDocument = async (submissionId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/teacher/document-submissions/${submissionId}/resubmit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};