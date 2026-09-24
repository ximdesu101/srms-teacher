import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GetSubmissionRequest,
    AcknowledgeRequest,
    SubmitDocument,
    ResubmitDocument,
} from "@/services/submissionRequestService";

const SubmissionRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["teacher-submission-request", id],
        queryFn: () => GetSubmissionRequest(id),
        enabled: !!id,
    });

    const request = data?.request;

    const acknowledgeMutation = useMutation({
        mutationFn: () => AcknowledgeRequest(id),
        onSuccess: (res) => {
            toast.success(res.message || "Request acknowledged.");
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-request", id] });
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-requests"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to acknowledge.");
        },
    });

    const submitMutation = useMutation({
        mutationFn: (file) => SubmitDocument(id, file),
        onSuccess: (res) => {
            toast.success(res.message || "Documents submitted successfully.");
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-request", id] });
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-requests"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to submit document.");
        },
    });

    const resubmitMutation = useMutation({
        mutationFn: (file) => ResubmitDocument(request?.submission?.id, file),
        onSuccess: (res) => {
            toast.success(res.message || "Revised document submitted successfully.");
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-request", id] });
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-requests"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to resubmit document.");
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            toast.error("Please select a file.");
            return;
        }
        if (request?.submission?.status === "Revision Required") {
            resubmitMutation.mutate(selectedFile);
        } else {
            submitMutation.mutate(selectedFile);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !request) {
        return (
            <div className="text-center py-20">
                <p className="text-destructive mb-4">Request not found or access denied.</p>
                <Button variant="outline" onClick={() => navigate("/submission-requests")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </div>
        );
    }

    const canSubmit = ["Requested", "Acknowledged", "Overdue"].includes(request.status) && !request.submission;
    const canResubmit = request.submission?.status === "Revision Required";
    const isUploading = submitMutation.isPending || resubmitMutation.isPending;

    return (
        <div className="grid grid-cols-1 gap-4">
            <Button variant="ghost" className="w-fit" onClick={() => navigate("/submission-requests")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Requests
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{request.request_code}</CardTitle>
                    <CardDescription>
                        {request.document_name} · Due {request.due_date ? format(new Date(request.due_date), "MMM d, yyyy") : "—"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Requested by</p>
                            <p className="font-medium">{request.requested_by}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Request Date</p>
                            <p className="font-medium">
                                {request.request_date ? format(new Date(request.request_date), "MMM d, yyyy") : "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium">{request.status}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Document</p>
                            <p className="font-medium">{request.document_name}</p>
                        </div>
                    </div>

                    {request.notes && (
                        <div className="p-3 bg-muted rounded-md text-sm">
                            <strong>Instructions:</strong> {request.notes}
                        </div>
                    )}

                    {request.status === "Requested" && (
                        <Button onClick={() => acknowledgeMutation.mutate()} disabled={acknowledgeMutation.isPending}>
                            {acknowledgeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Acknowledge Request
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Revision note */}
            {canResubmit && request.submission?.revision_note && (
                <Card className="border-amber-300 bg-amber-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                            <AlertCircle className="h-5 w-5" />
                            Revision Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-amber-900">
                            <strong>Admin&apos;s Note:</strong> {request.submission.revision_note}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Current submission info */}
            {request.submission && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            {request.submission.status === "Approved" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <FileText className="h-5 w-5" />
                            )}
                            Submitted Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p>
                            <strong>File:</strong>{" "}
                            {request.submission.file_url ? (
                                <a
                                    href={request.submission.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                >
                                    {request.submission.original_name}
                                </a>
                            ) : (
                                request.submission.original_name
                            )}
                        </p>
                        <p><strong>Size:</strong> {request.submission.formatted_size}</p>
                        <p><strong>Status:</strong> {request.submission.status}</p>
                        <p><strong>Revision count:</strong> {request.submission.revision_count}</p>
                        {request.submission.submitted_at && (
                            <p><strong>Submitted:</strong> {format(new Date(request.submission.submitted_at), "MMM d, yyyy h:mm a")}</p>
                        )}
                        {request.submission.versions?.length > 0 && (
                            <div className="mt-3 border-t pt-3">
                                <p className="mb-1 font-medium">Submission history</p>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    {request.submission.versions.map((version) => (
                                        <li key={version.version_number}>
                                            Version {version.version_number}: {" "}
                                            {version.file_url ? (
                                                <a
                                                    href={version.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                                >
                                                    {version.original_name}
                                                </a>
                                            ) : (
                                                version.original_name
                                            )}{" "}
                                            ({version.status})
                                            {version.revision_note ? ` - ${version.revision_note}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Upload area */}
            {(canSubmit || canResubmit) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {canResubmit ? "Upload Revised Document" : "Submit Document"}
                        </CardTitle>
                        <CardDescription>
                            Accepted: Excel, PDF, Word, or image files (max 10 MB).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                        />
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                            </Button>
                            {selectedFile && (
                                <span className="text-sm text-muted-foreground">
                                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                </span>
                            )}
                            {selectedFile && (
                                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                                    Remove
                                </Button>
                            )}
                        </div>
                        <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
                            {isUploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {canResubmit ? "Resubmit Document" : "Submit Document"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SubmissionRequestDetail;