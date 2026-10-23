import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Clock3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    const [isDragging, setIsDragging] = useState(false);

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
            if (fileInputRef.current) fileInputRef.current.value = "";
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
            if (fileInputRef.current) fileInputRef.current.value = "";
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-request", id] });
            queryClient.invalidateQueries({ queryKey: ["teacher-submission-requests"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to resubmit document.");
        },
    });

    const handleSelectedFile = (file) => {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Choose a file smaller than 10 MB.");
            return;
        }
        setSelectedFile(file);
    };

    const handleFileChange = (e) => {
        handleSelectedFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleSelectedFile(e.dataTransfer.files?.[0]);
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
                            <Badge
                                variant="secondary"
                                className={
                                    request.status === "Overdue"
                                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                                        : request.status === "Acknowledged"
                                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                          : request.status === "Submitted"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                }
                            >
                                {request.status}
                            </Badge>
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
                <Card className="overflow-hidden border-amber-300 bg-amber-50/70">
                    <div className="h-1 bg-amber-500" />
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-amber-950">
                            <AlertCircle className="h-5 w-5" />
                            Needs Revision
                        </CardTitle>
                        <CardDescription className="text-amber-900/80">
                            Update the document using the administrator&apos;s feedback below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-amber-200 bg-white/80 p-4">
                            <p className="mb-1 text-xs font-semibold uppercase text-amber-800">Administrator&apos;s note</p>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-amber-950">
                                {request.submission.revision_note}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Current submission info */}
            {request.submission && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between gap-3 text-base">
                            <span className="flex items-center gap-2">
                            {request.submission.status === "Approved" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : request.submission.status === "Revision Required" ? (
                                    <AlertCircle className="h-5 w-5 text-amber-700" />
                            ) : (
                                            <Clock3 className="h-5 w-5 text-sky-700" />
                            )}
                                Current document
                            </span>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${request.submission.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-900"
                                    : request.submission.status === "Revision Required"
                                        ? "bg-amber-100 text-amber-900"
                                        : "bg-sky-100 text-sky-900"
                                }`}>
                                {request.submission.status === "Revision Required"
                                    ? "Needs Revision"
                                    : ["Submitted", "Under Review", "Resubmitted"].includes(request.submission.status)
                                        ? "Awaiting Approval"
                                        : request.submission.status}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 rounded-md border p-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                            {request.submission.file_url ? (
                                <a
                                    href={request.submission.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                            className="underline underline-offset-2 hover:text-primary"
                                >
                                    {request.submission.original_name}
                                </a>
                            ) : (
                                request.submission.original_name
                            )}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {request.submission.formatted_size}
                                    {request.submission.submitted_at && ` · Updated ${format(new Date(request.submission.submitted_at), "MMM d, yyyy h:mm a")}`}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Revision requests: {request.submission.revision_count}
                        </p>
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
                            {canResubmit
                                ? "Your new file will replace the current submission."
                                : "Choose a file to attach to this request."} Excel, PDF, Word, or image · up to 10 MB.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            disabled={isUploading}
                            className={`flex w-full flex-col items-center justify-center rounded-md border border-dashed px-5 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${isDragging ? "border-primary bg-accent" : "hover:border-muted-foreground/50 hover:bg-muted/40"}`}
                        >
                            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                            </span>
                            <span className="font-medium">Drop a file here or choose a file</span>
                            <span className="mt-1 text-xs text-muted-foreground">Excel, PDF, Word, or image · max 10 MB</span>
                        </button>
                        {selectedFile && (
                            <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Remove selected file"
                                    title="Remove selected file"
                                    disabled={isUploading}
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
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