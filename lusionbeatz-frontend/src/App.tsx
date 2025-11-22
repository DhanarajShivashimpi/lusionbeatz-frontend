import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Loops from "@/pages/Loops";
import OneShots from "@/pages/OneShots";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/loops" component={Loops} />
      <Route path="/oneshots" component={OneShots} />
      
      {/* Auth Pages */}
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/verify" component={VerifyOTP} />
      
      {/* Protected Pages */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
