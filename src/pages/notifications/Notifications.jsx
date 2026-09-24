import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GetNotifications,
    MarkAsRead,
    MarkAllAsRead,
} from "@/services/notificationService";

const Notifications = () => {
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notifications", filter, page],
        queryFn: () => GetNotifications({ page, filter }),
    });

    const markReadMutation = useMutation({
        mutationFn: MarkAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        },
    });

    const markAllMutation = useMutation({
        mutationFn: MarkAllAsRead,
        onSuccess: () => {
            toast.success("All notifications marked as read.");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        },
        onError: () => toast.error("Failed to mark all as read."),
    });

    const notifications = data?.data ?? [];
    const meta = data?.meta ?? data;

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Stay updated with your submission requests, document revisions, and other important activities.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAllMutation.mutate()}
                        disabled={markAllMutation.isPending}
                    >
                        {markAllMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CheckCheck className="h-4 w-4 mr-2" />
                        )}
                        Mark all as read
                    </Button>
                </CardHeader>
                <CardContent>
                    <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }} className="mb-4">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                            <TabsTrigger value="read">Read</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {isError && (
                        <p className="text-center text-destructive py-8">Failed to load notifications.</p>
                    )}

                    {!isLoading && !isError && notifications.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">No notifications found.</p>
                    )}

                    <div className="space-y-2">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`flex items-start gap-3 rounded-lg border p-4 transition ${
                                    n.is_unread ? "bg-primary/5 border-primary/20" : "bg-background"
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-medium ${n.is_unread ? "text-foreground" : "text-muted-foreground"}`}>
                                            {n.title}
                                        </h4>
                                        {n.is_unread && (
                                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                                    {n.data?.revision_note && (
                                        <p className="text-sm mt-1 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900">
                                            <strong>Note:</strong> {n.data.revision_note}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                            {n.created_at ? format(new Date(n.created_at), "MMM d, yyyy h:mm a") : ""}
                                        </span>
                                        {n.data?.link && (
                                            <Link
                                                to={n.data.link}
                                                className="text-xs text-primary hover:underline"
                                                onClick={() => n.is_unread && markReadMutation.mutate(n.id)}
                                            >
                                                View details
                                            </Link>
                                        )}
                                        {n.is_unread && (
                                            <button
                                                className="text-xs text-muted-foreground hover:text-foreground"
                                                onClick={() => markReadMutation.mutate(n.id)}
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Notifications;