import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User, CreditCard, Upload, List, ShoppingBag, Activity, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { User as UserType, Sample, Order } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<UserType>({ queryKey: ["/api/auth/me"] });
  const { data: myUploads } = useQuery<Sample[]>({ queryKey: ["/api/samples/my-uploads"] });
  const { data: myPurchases } = useQuery<Order[]>({ queryKey: ["/api/orders/my-purchases"] });

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
    }
  }, [user, isLoading, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 md:px-8 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-heading text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {user.name}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="profile" data-testid="tab-profile">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="bank" data-testid="tab-bank">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Bank</span>
              </TabsTrigger>
              <TabsTrigger value="upload" data-testid="tab-upload">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="my-uploads" data-testid="tab-my-uploads">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">My Uploads</span>
              </TabsTrigger>
              <TabsTrigger value="purchases" data-testid="tab-purchases">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Purchases</span>
              </TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab user={user} />
            </TabsContent>

            <TabsContent value="bank">
              <BankDetailsTab user={user} />
            </TabsContent>

            <TabsContent value="upload">
              <UploadSampleTab />
            </TabsContent>

            <TabsContent value="my-uploads">
              <MyUploadsTab uploads={myUploads || []} />
            </TabsContent>

            <TabsContent value="purchases">
              <PurchasesTab purchases={myPurchases || []} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfileTab({ user }: { user: UserType }) {
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      apiRequest("PATCH", "/api/users/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile updated successfully" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input defaultValue={user.name} data-testid="input-profile-name" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" defaultValue={user.email} disabled data-testid="input-profile-email" />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
        <div className="space-y-2">
          <Label>Account Status</Label>
          <div className="flex gap-2">
            {user.verified ? (
              <Badge variant="default">Verified</Badge>
            ) : (
              <Badge variant="destructive">Not Verified</Badge>
            )}
            {user.approvedCreator && <Badge variant="default">Approved Creator</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BankDetailsTab({ user }: { user: UserType }) {
  const { toast } = useToast();

  const updateBankMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/users/bank-details", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Bank details updated successfully" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
        <CardDescription>Required for receiving payments from your sales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input
              defaultValue={user.bankDetails?.holderName || ""}
              placeholder="John Doe"
              data-testid="input-bank-holder-name"
            />
          </div>
          <div className="space-y-2">
            <Label>UPI ID</Label>
            <Input
              defaultValue={user.bankDetails?.upiId || ""}
              placeholder="yourname@upi"
              data-testid="input-bank-upi"
            />
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              defaultValue={user.bankDetails?.accountNumber || ""}
              placeholder="1234567890"
              data-testid="input-bank-account"
            />
          </div>
          <div className="space-y-2">
            <Label>IFSC Code</Label>
            <Input
              defaultValue={user.bankDetails?.ifsc || ""}
              placeholder="ABCD0123456"
              data-testid="input-bank-ifsc"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              defaultValue={user.bankDetails?.phone || ""}
              placeholder="+91 9876543210"
              data-testid="input-bank-phone"
            />
          </div>
        </div>
        <Button data-testid="button-save-bank">Save Bank Details</Button>
      </CardContent>
    </Card>
  );
}

function UploadSampleTab() {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/samples/upload", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samples/my-uploads"] });
      toast({ title: "Sample uploaded successfully", description: "Pending approval" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Sample</CardTitle>
        <CardDescription>Share your music samples with the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Epic Trap Beat" data-testid="input-upload-title" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select>
              <SelectTrigger data-testid="select-upload-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loop">Loop</SelectItem>
                <SelectItem value="oneshot">One-Shot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Genre</Label>
            <Input placeholder="Hip Hop" data-testid="input-upload-genre" />
          </div>
          <div className="space-y-2">
            <Label>BPM</Label>
            <Input type="number" placeholder="140" data-testid="input-upload-bpm" />
          </div>
          <div className="space-y-2">
            <Label>Key</Label>
            <Input placeholder="C Minor" data-testid="input-upload-key" />
          </div>
          <div className="space-y-2">
            <Label>Price (INR)</Label>
            <Input type="number" placeholder="499" data-testid="input-upload-price" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Describe your sample..." data-testid="textarea-upload-description" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Audio File</Label>
            <Input type="file" accept="audio/*" data-testid="input-upload-audio" />
          </div>
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Input type="file" accept="image/*" data-testid="input-upload-cover" />
          </div>
        </div>
        <Button data-testid="button-submit-upload">Upload Sample</Button>
      </CardContent>
    </Card>
  );
}

function MyUploadsTab({ uploads }: { uploads: Sample[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Uploads</CardTitle>
        <CardDescription>Manage your uploaded samples</CardDescription>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No uploads yet</p>
        ) : (
          <div className="space-y-4">
            {uploads.map((sample) => (
              <div key={sample.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`upload-item-${sample.id}`}>
                <div>
                  <h4 className="font-semibold">{sample.title}</h4>
                  <p className="text-sm text-muted-foreground">{sample.type} • {sample.genre}</p>
                </div>
                <Badge variant={sample.status === "approved" ? "default" : "secondary"}>
                  {sample.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PurchasesTab({ purchases }: { purchases: Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>View your past purchases</CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No purchases yet</p>
        ) : (
          <div className="space-y-4">
            {purchases.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg space-y-2" data-testid={`purchase-item-${order.id}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-semibold">₹{parseFloat(order.amount).toFixed(2)}</p>
                  </div>
                  <Badge>Paid</Badge>
                </div>
                <div className="text-sm">
                  {order.samples.length} sample(s)
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityTab({ user }: { user: UserType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activity on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Account created</p>
              <p className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
