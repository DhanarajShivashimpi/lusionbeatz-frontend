import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Trash2, Users, FileMusic, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { User, Sample, Order } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<User>({ queryKey: ["/api/auth/me"] });
  const { data: users } = useQuery<User[]>({ queryKey: ["/api/admin/users"] });
  const { data: samples } = useQuery<Sample[]>({ queryKey: ["/api/admin/samples"] });
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/admin/orders"] });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const approveUserMutation = useMutation({
    mutationFn: (userId: string) => apiRequest("POST", "/api/admin/approve-user", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User approved" });
    },
  });

  const approveSampleMutation = useMutation({
    mutationFn: (sampleId: string) => apiRequest("POST", "/api/admin/approve-sample", { sampleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/samples"] });
      toast({ title: "Sample approved" });
    },
  });

  const rejectSampleMutation = useMutation({
    mutationFn: (sampleId: string) => apiRequest("POST", "/api/admin/reject-sample", { sampleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/samples"] });
      toast({ title: "Sample rejected" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiRequest("DELETE", `/api/admin/users/${userId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted" });
    },
  });

  const deleteSampleMutation = useMutation({
    mutationFn: (sampleId: string) => apiRequest("DELETE", `/api/admin/samples/${sampleId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/samples"] });
      toast({ title: "Sample deleted" });
    },
  });

  if (isLoading || !user || user.role !== "admin") return null;

  const pendingCreators = users?.filter(u => !u.approvedCreator && u.verified) || [];
  const pendingSamples = samples?.filter(s => s.status === "pending") || [];
  const totalEarnings = orders?.reduce((sum, o) => sum + parseFloat(o.platformEarning), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-heading text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
                <FileMusic className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{samples?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="approve-creators" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
              <TabsTrigger value="approve-creators">Approve Creators</TabsTrigger>
              <TabsTrigger value="approve-samples">Approve Samples</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
              <TabsTrigger value="samples">Manage Samples</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="approve-creators">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Creator Approvals</CardTitle>
                  <CardDescription>Review and approve new creators</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingCreators.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending approvals</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingCreators.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => approveUserMutation.mutate(u.id)}
                                disabled={approveUserMutation.isPending}
                                data-testid={`button-approve-user-${u.id}`}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approve-samples">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Sample Approvals</CardTitle>
                  <CardDescription>Review and approve new samples</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingSamples.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending samples</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingSamples.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.title}</TableCell>
                            <TableCell>{s.type}</TableCell>
                            <TableCell>{s.genre}</TableCell>
                            <TableCell>₹{parseFloat(s.price).toFixed(2)}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveSampleMutation.mutate(s.id)}
                                disabled={approveSampleMutation.isPending}
                                data-testid={`button-approve-sample-${s.id}`}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectSampleMutation.mutate(s.id)}
                                disabled={rejectSampleMutation.isPending}
                                data-testid={`button-reject-sample-${s.id}`}
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell><Badge>{u.role}</Badge></TableCell>
                          <TableCell>
                            {u.verified ? (
                              <Badge variant="default">Verified</Badge>
                            ) : (
                              <Badge variant="secondary">Not Verified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {u.id !== user.id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteUserMutation.mutate(u.id)}
                                disabled={deleteUserMutation.isPending}
                                data-testid={`button-delete-user-${u.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="samples">
              <Card>
                <CardHeader>
                  <CardTitle>All Samples</CardTitle>
                  <CardDescription>Manage all samples</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {samples?.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.title}</TableCell>
                          <TableCell>{s.type}</TableCell>
                          <TableCell>
                            <Badge variant={s.status === "approved" ? "default" : "secondary"}>
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{parseFloat(s.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSampleMutation.mutate(s.id)}
                              disabled={deleteSampleMutation.isPending}
                              data-testid={`button-delete-sample-${s.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>View all platform orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>UTR</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Creator Earning</TableHead>
                        <TableHead>Platform Earning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-mono text-xs">{o.utr}</TableCell>
                          <TableCell>₹{parseFloat(o.amount).toFixed(2)}</TableCell>
                          <TableCell>₹{parseFloat(o.creatorEarning).toFixed(2)}</TableCell>
                          <TableCell>₹{parseFloat(o.platformEarning).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
