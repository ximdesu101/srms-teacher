import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Loader2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetSubmissionRequests } from "@/services/submissionRequestService";

const statusColor = {
    Requested: "bg-blue-100 text-blue-800",
    Acknowledged: "bg-yellow-100 text-yellow-800",
    Submitted: "bg-green-100 text-green-800",
    Overdue: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
};

const SubmissionRequests = () => {
    const [status, setStatus] = useState("All");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["teacher-submission-requests", status, page],
        queryFn: () => GetSubmissionRequests({ page, status }),
    });

    const requests = data?.data ?? [];

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Submission Requests
                    </CardTitle>
                    <CardDescription>
                        View and respond to document submission requests assigned to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }} className="mb-4">
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Requested">Requested</TabsTrigger>
                            <TabsTrigger value="Acknowledged">Acknowledged</TabsTrigger>
                            <TabsTrigger value="Submitted">Submitted</TabsTrigger>
                            <TabsTrigger value="Overdue">Overdue</TabsTrigger>
                            <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {isError && (
                        <p className="text-center text-destructive py-8">Failed to load requests.</p>
                    )}

                    {!isLoading && !isError && requests.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">No submission requests found.</p>
                    )}

                    {!isLoading && requests.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Request ID</TableHead>
                                        <TableHead>Requested by</TableHead>
                                        <TableHead>Document</TableHead>
                                        <TableHead>Request Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.request_code}</TableCell>
                                            <TableCell>{r.requested_by}</TableCell>
                                            <TableCell>{r.document_name}</TableCell>
                                            <TableCell>
                                                {r.request_date ? format(new Date(r.request_date), "MMM d, yyyy") : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {r.due_date ? format(new Date(r.due_date), "MMM d, yyyy") : "—"}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[r.status] || "bg-gray-100"}`}>
                                                    {r.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link to={`/submission-requests/${r.id}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmissionRequests;