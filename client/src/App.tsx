import { Toaster } from "@/components/ui/sonner";
import DashboardLayout from "@/components/DashboardLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import Learning from "@/pages/Learning";
import NotFound from "@/pages/NotFound";
import Projects from "@/pages/Projects";
import Review from "@/pages/Review";
import Skills from "@/pages/Skills";
import Tasks from "@/pages/Tasks";
import Time from "@/pages/Time";
import { Route, Switch } from "wouter";

function Router() {
  return <DashboardLayout><Switch><Route path="/" component={Home} /><Route path="/tasks" component={Tasks} /><Route path="/time" component={Time} /><Route path="/learning" component={Learning} /><Route path="/projects" component={Projects} /><Route path="/skills" component={Skills} /><Route path="/review" component={Review} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></DashboardLayout>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
