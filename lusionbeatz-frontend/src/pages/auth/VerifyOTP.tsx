import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function VerifyOTP() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setLocation("/auth/login");
    }
  }, [search, setLocation]);

  const verifyMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      apiRequest("POST", "/api/auth/verify-otp", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Email verified!",
        description: "Your account has been verified successfully.",
      });
      setLocation("/auth/login");
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      setOtp("");
    },
  });

  const handleComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      verifyMutation.mutate({ email, otp: value });
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-otp", { email });
      toast({
        title: "OTP sent!",
        description: "Check your email for a new verification code.",
      });
      setOtp("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Music className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-heading">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              disabled={verifyMutation.isPending}
              data-testid="input-otp"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the code? Check your spam folder.</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleResendOTP}
              disabled={resending || verifyMutation.isPending}
              data-testid="button-resend-otp"
            >
              {resending ? "Sending OTP..." : "Resend OTP"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation("/auth/login")}
              data-testid="button-back-login"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
