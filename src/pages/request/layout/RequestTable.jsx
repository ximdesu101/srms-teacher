import React, { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { Field } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import AddRequestForm from "./AddRequestForm";

const initialRequests = [
    {
        id: "REQ-2026-001",
        requestedBy: "Juan Dela Cruz",
        document: "Certificate of Employment",
        requestedDate: "09/02/26",
        status: "Pending Review",
    },
    {
        id: "REQ-2026-002",
        requestedBy: "Maria Clara Mendoza",
        document: "Service Record",
        requestedDate: "09/01/26",
        status: "Accepted",
    },
    {
        id: "REQ-2026-003",
        requestedBy: "Angela Grace Bautista",
        document: "Payslip (Q2 2026)",
        requestedDate: "08/30/26",
        status: "Needs Revision",
    },
    {
        id: "REQ-2026-004",
        requestedBy: "Juan Dela Cruz",
        document: "Form 137 / Official Transcript",
        requestedDate: "08/29/26",
        status: "Rejected",
    },
];

const RequestTable = () => {
    const [search, setSearch] = useState("");

    const filteredRequests = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        return initialRequests.filter((request) => {
            return (
                !keyword ||
                [
                    request.id,
                    request.requestedBy,
                    request.document,
                    request.status,
                ].some((value) =>
                    value.toLowerCase().includes(keyword)
                )
            );
        });
    }, [search]);

    return (
        <div className="grid gap-2">
            {/* Search Input Bar */}
            <div className="flex items-center justify-end gap-4">
                <Field className="w-full max-w-sm">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            placeholder="Search requests"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <AddRequestForm />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-[#4386c2]">
                        <TableRow className="hover:bg-[#4386c2]">
                            <TableHead className="text-white">
                                Request ID
                            </TableHead>

                            <TableHead className="text-white">
                                Requested By
                            </TableHead>

                            <TableHead className="text-white">
                                Document
                            </TableHead>

                            <TableHead className="text-white">
                                Date Requested
                            </TableHead>

                            <TableHead className="text-white">
                                Status
                            </TableHead>

                            <TableHead className="text-right text-white">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>
                                        {request.id}
                                    </TableCell>

                                    <TableCell>
                                        {request.requestedBy}
                                    </TableCell>

                                    <TableCell>
                                        {request.document}
                                    </TableCell>

                                    <TableCell>
                                        {request.requestedDate}
                                    </TableCell>

                                    <TableCell>
                                        {request.status}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="View Request Details"
                                        >
                                            <Eye />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground"
                                >
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                {/* Pagination */}
                <div className="flex items-center justify-end px-2 py-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page 1 of 3
                    </div>

                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        className="pointer-events-none opacity-50"
                                    />
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink isActive>
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink>
                                        2
                                    </PaginationLink>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink>
                                        3
                                    </PaginationLink>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext className="cursor-pointer" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestTable;