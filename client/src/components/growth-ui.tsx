import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Inbox } from "lucide-react";
import { useLocation } from "wouter";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>;
}

export function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-[1.4rem] border border-white/60 bg-card/80 p-5 shadow-[0_16px_45px_-28px_rgba(48,62,140,0.32)] backdrop-blur-sm dark:border-white/8", className)}>{children}</section>;
}

export function Metric({ label, value, hint, accent = "indigo" }: { label: string; value: string; hint: string; accent?: "indigo" | "violet" | "mint" | "amber" }) {
  const accents = { indigo: "from-indigo-500/18 to-blue-400/8 text-indigo-600", violet: "from-violet-500/18 to-fuchsia-400/8 text-violet-600", mint: "from-emerald-500/18 to-cyan-400/8 text-emerald-600", amber: "from-amber-500/20 to-orange-400/8 text-amber-600" };
  return <div className={cn("relative overflow-hidden rounded-[1.25rem] border border-white/70 bg-gradient-to-br p-5 dark:border-white/10", accents[accent])}>
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-current/10 blur-2xl" />
    <p className="text-sm font-medium text-foreground/70">{label}</p>
    <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">{value}</p>
    <p className="mt-2 text-xs font-medium text-muted-foreground">{hint}</p>
  </div>;
}

export function EmptyState({ title, body, actionLabel, actionPath }: { title: string; body: string; actionLabel?: string; actionPath?: string }) {
  const [, setLocation] = useLocation();
  return <div className="flex min-h-52 flex-col items-center justify-center rounded-[1.1rem] border border-dashed border-border bg-muted/35 px-6 py-10 text-center">
    <div className="mb-4 rounded-2xl bg-background p-3 shadow-sm"><Inbox className="h-5 w-5 text-primary" /></div>
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{body}</p>
    {actionLabel && actionPath ? <Button variant="outline" className="mt-5 rounded-xl" onClick={() => setLocation(actionPath)}>{actionLabel}<ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></Button> : null}
  </div>;
}

export function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" | "urgent" }) {
  const labels = { low: "低优先", medium: "普通", high: "高优先", urgent: "紧急" };
  const styles = { low: "bg-slate-100 text-slate-600", medium: "bg-blue-50 text-blue-700", high: "bg-amber-50 text-amber-700", urgent: "bg-rose-50 text-rose-700" };
  return <Badge className={cn("border-0 px-2 py-0.5 text-[11px] font-medium", styles[priority])}>{labels[priority]}</Badge>;
}
