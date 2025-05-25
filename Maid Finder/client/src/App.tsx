import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import Search from "@/pages/search";
import NannyProfile from "@/pages/nanny-profile";
import ParentDashboard from "@/pages/parent-dashboard";
import NannyDashboard from "@/pages/nanny-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import HowItWorks from "@/pages/how-it-works";
import Safety from "@/pages/safety";
import BecomeNanny from "@/pages/become-nanny";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/safety" component={Safety} />
          <Route path="/become-nanny" component={BecomeNanny} />
          <Route path="/search" component={Search} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/nanny/:userId" component={NannyProfile} />
          <Route path="/dashboard/parent" component={ParentDashboard} />
          <Route path="/dashboard/nanny" component={NannyDashboard} />
          <Route path="/dashboard/admin" component={AdminDashboard} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/safety" component={Safety} />
          <Route path="/become-nanny" component={BecomeNanny} />
        </>
      )}
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
