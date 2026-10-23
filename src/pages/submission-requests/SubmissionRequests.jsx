import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
    Loader,
    DatabaseX,
    Search,
    Eye,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GetSubmissionRequests } from "@/services/submissionRequestService";

const statusVariant = {
    "Needs Revision": "secondary",
    "Awaiting Approval": "secondary",
    Approved: "default",
    Requested: "secondary",
    Acknowledged: "default",
    Overdue: "destructive",
    Cancelled: "outline",
};

const statusClassName = {
    "Needs Revision": "bg-amber-100 text-amber-900 hover:bg-amber-100",
    "Awaiting Approval": "bg-sky-100 text-sky-900 hover:bg-sky-100",
    Approved: "bg-green-100 text-green-800 hover:bg-green-100",
    Requested: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Acknowledged: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Overdue: "bg-red-100 text-red-800 hover:bg-red-100",
    Cancelled: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

const getDisplayStatus = (request) => {
    const submissionStatus = request.submission?.status;
    if (submissionStatus === "Revision Required") return "Needs Revision";
    if (["Submitted", "Under Review", "Resubmitted"].includes(submissionStatus)) {
        return "Awaiting Approval";
    }
    if (submissionStatus === "Approved") return "Approved";
    return request.status;
};

const formatDate = (value) => {
    if (!value) return "—";
    try {
        return format(new Date(value), "MMM d, yyyy");
    } catch {
        return value;
    }
};

const SubmissionRequests = () => {
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["teacher-submission-requests", status, page, search],
        queryFn: () => GetSubmissionRequests({ page, status, search }),
        placeholderData: keepPreviousData,
    });

    const requests = data?.data ?? [];
    const lastPage = data?.last_page ?? 1;
    const currentPage = data?.current_page ?? 1;

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

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
                <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <Tabs value={status} onValueChange={handleStatusChange}>
                            <TabsList className="h-auto flex-wrap justify-start">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Needs Revision">Needs Revision</TabsTrigger>
                                <TabsTrigger value="Awaiting Approval">Awaiting Approval</TabsTrigger>
                                <TabsTrigger value="Requested">Requested</TabsTrigger>
                                <TabsTrigger value="Acknowledged">Acknowledged</TabsTrigger>
                                <TabsTrigger value="Overdue">Overdue</TabsTrigger>
                                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Field className="w-full max-w-sm">
                            <InputGroup>
                                <InputGroupInput
                                    id="search"
                                    placeholder="Search submission requests"
                                    value={search}
                                    onChange={(event) =>
                                        handleSearchChange(event.target.value)
                                    }
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader className="bg-[#4386c2]">
                                <TableRow className="hover:bg-[#4386c2]">
                                    <TableHead className="text-white">Request ID</TableHead>
                                    <TableHead className="text-white">Requested by</TableHead>
                                    <TableHead className="text-white">Document</TableHead>
                                    <TableHead className="text-white">Request Date</TableHead>
                                    <TableHead className="text-white">Due Date</TableHead>
                                    <TableHead className="text-white">Status</TableHead>
                                    <TableHead className="text-right text-white">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground"
                                        >
                                            <Loader className="mx-auto animate-spin" />
                                            Loading submission requests...
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-destructive"
                                        >
                                            <DatabaseX className="mx-auto" />
                                            Failed to load submission requests.
                                        </TableCell>
                                    </TableRow>
                                ) : requests.length > 0 ? (
                                    requests.map((r) => {
                                        const displayStatus = getDisplayStatus(r);
                                        return (
                                            <TableRow key={r.id}>
                                                <TableCell className="font-medium">
                                                    {r.request_code}
                                                </TableCell>
                                                <TableCell>{r.requested_by}</TableCell>
                                                <TableCell>{r.document_name}</TableCell>
                                                <TableCell>
                                                    {formatDate(r.request_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(r.due_date)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            statusVariant[displayStatus] ||
                                                            "secondary"
                                                        }
                                                        className={
                                                            statusClassName[displayStatus] ||
                                                            ""
                                                        }
                                                    >
                                                        {displayStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="View Request"
                                                        asChild
                                                    >
                                                        <Link
                                                            to={`/submission-requests/${r.id}`}
                                                        >
                                                            <Eye />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground"
                                        >
                                            No submission requests found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Separator />

                        <div className="flex items-center justify-end px-2 py-2">
                            <div className="flex-1 text-sm text-muted-foreground">
                                Page {currentPage} of {lastPage}
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setPage((p) => Math.max(1, p - 1))
                                            }
                                            className={
                                                currentPage <= 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                    {Array.from(
                                        { length: lastPage },
                                        (_, i) => i + 1
                                    )
                                        .filter(
                                            (p) =>
                                                p === 1 ||
                                                p === lastPage ||
                                                Math.abs(p - currentPage) <= 1
                                        )
                                        .map((p, idx, arr) => {
                                            const prev = arr[idx - 1];
                                            const showEllipsis =
                                                prev != null && p - prev > 1;
                                            return (
                                                <span
                                                    key={p}
                                                    className="contents"
                                                >
                                                    {showEllipsis && (
                                                        <PaginationItem>
                                                            <span className="px-2 text-muted-foreground">
                                                                …
                                                            </span>
                                                        </PaginationItem>
                                                    )}
                                                    <PaginationItem>
                                                        <PaginationLink
                                                            isActive={
                                                                p === currentPage
                                                            }
                                                            onClick={() =>
                                                                setPage(p)
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            {p}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                </span>
                                            );
                                        })}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.min(lastPage, p + 1)
                                                )
                                            }
                                            className={
                                                currentPage >= lastPage
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubmissionRequests;