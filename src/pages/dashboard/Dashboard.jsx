import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, AlertCircle, CheckCircle2, Clock3, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetSubmissionRequests } from "@/services/submissionRequestService";

const RequestQueue = ({ title, description, icon: Icon, kind, query }) => {
    const requests = query.data?.data ?? [];

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className={`h-5 w-5 ${kind === "revision" ? "text-amber-700" : "text-sky-700"}`} />
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <span className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-sm font-semibold ${kind === "revision" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"}`}>
                    {query.isLoading ? "—" : query.data?.total ?? 0}
                </span>
            </CardHeader>
            <CardContent>
                {query.isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {query.isError && (
                    <p className="py-8 text-center text-sm text-destructive">Could not load this queue.</p>
                )}
                {!query.isLoading && !query.isError && requests.length === 0 && (
                    <div className="flex flex-col items-center py-10 text-center">
                        <CheckCircle2 className="mb-2 h-6 w-6 text-emerald-600" />
                        <p className="font-medium">You&apos;re all caught up</p>
                        <p className="mt-1 text-sm text-muted-foreground">There are no documents in this queue.</p>
                    </div>
                )}
                {!query.isLoading && !query.isError && requests.length > 0 && (
                    <div className="divide-y">
                        {requests.map((request) => (
                            <Link
                                key={request.id}
                                to={`/submission-requests/${request.id}`}
                                className="group block py-4 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium group-hover:underline">
                                            {request.document_name}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {request.request_code}
                                            {request.due_date && ` · Due ${format(new Date(request.due_date), "MMM d, yyyy")}`}
                                        </p>
                                    </div>
                                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                </div>
                                {kind === "revision" && (
                                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-amber-950">
                                        {request.submission?.revision_note || "Open this request to review the administrator's feedback."}
                                    </p>
                                )}
                                {kind === "approval" && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {request.submission?.status === "Resubmitted" ? "Revised document resubmitted" : "Document submitted"}
                                        {request.submission?.submitted_at && ` · ${format(new Date(request.submission.submitted_at), "MMM d, yyyy")}`}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    const needsRevision = useQuery({
        queryKey: ["teacher-submission-requests", "Needs Revision", 1],
        queryFn: () => GetSubmissionRequests({ page: 1, status: "Needs Revision" }),
    });
    const awaitingApproval = useQuery({
        queryKey: ["teacher-submission-requests", "Awaiting Approval", 1],
        queryFn: () => GetSubmissionRequests({ page: 1, status: "Awaiting Approval" }),
    });

    return (
        <div className="space-y-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Teacher workspace</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Document activity</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Review requested changes and track documents awaiting approval.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/submission-requests">
                        <FileText className="mr-2 h-4 w-4" />
                        All requests
                    </Link>
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <RequestQueue
                    title="Needs Revision"
                    description="Read the administrator's note and resubmit an updated document."
                    icon={AlertCircle}
                    kind="revision"
                    query={needsRevision}
                />
                <RequestQueue
                    title="Awaiting Approval"
                    description="Documents submitted and currently with the administrator for review."
                    icon={Clock3}
                    kind="approval"
                    query={awaitingApproval}
                />
            </div>
        </div>
    );
};

export default Dashboard