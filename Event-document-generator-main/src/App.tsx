import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = lazy(() => import("./pages/Index.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const ProposalGenerator = lazy(() => import("./pages/ProposalGenerator.tsx"));
const FlyerGenerator = lazy(() => import("./pages/FlyerGenerator.tsx"));
const AttendancePage = lazy(() => import("./pages/AttendancePage.tsx"));
const ReportGenerator = lazy(() => import("./pages/ReportGenerator.tsx"));
const EventsPage = lazy(() => import("./pages/EventsPage.tsx"));
const BudgetPlannerPage = lazy(() => import("./pages/BudgetPlannerPage.tsx"));
const TimelinePlannerPage = lazy(() => import("./pages/TimelinePlannerPage.tsx"));
const PostEventSummaryPage = lazy(() => import("./pages/PostEventSummaryPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-mono text-sm text-muted-foreground">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate/proposal" element={<ProposalGenerator />} />
            <Route path="/generate/flyer" element={<FlyerGenerator />} />
            <Route path="/generate/attendance" element={<AttendancePage />} />
            <Route path="/generate/report" element={<ReportGenerator />} />
            <Route path="/generate/budget" element={<BudgetPlannerPage />} />
            <Route path="/generate/timeline" element={<TimelinePlannerPage />} />
            <Route path="/generate/summary" element={<PostEventSummaryPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
