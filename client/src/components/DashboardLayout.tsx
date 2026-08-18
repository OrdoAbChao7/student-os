import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useMobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BrainCircuit, BookOpen, Clock3, FolderKanban, LayoutDashboard, LogOut, Moon, PanelLeft, Sparkles, Sun, Target, TimerReset } from "lucide-react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: LayoutDashboard, label: "工作台", path: "/" },
  { icon: Target, label: "任务", path: "/tasks" },
  { icon: TimerReset, label: "时间", path: "/time" },
  { icon: BookOpen, label: "学习", path: "/learning" },
  { icon: FolderKanban, label: "项目", path: "/projects" },
  { icon: BrainCircuit, label: "能力", path: "/skills" },
  { icon: Sparkles, label: "复盘", path: "/review" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <LoginScreen />;
  return <SidebarProvider defaultOpen><LayoutContent>{children}</LayoutContent></SidebarProvider>;
}

function LoginScreen() {
  return <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f6f7ff] px-5 dark:bg-[#0d1020]">
    <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/15" /><div className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/15" />
    <main className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-8 text-center shadow-[0_30px_80px_-38px_rgba(44,50,130,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 sm:p-10"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"><Sparkles className="h-6 w-6" /></div><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Student OS</p><h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">把每一份投入，变成你的能力资产。</h1><p className="mt-4 text-sm leading-7 text-muted-foreground">登录后，任务、学习、项目、时间和 AI 复盘都只属于你自己，并由同一个成长系统连接。</p><Button className="mt-8 w-full rounded-xl" size="lg" onClick={() => startLogin()}>使用 Manus 账号登录</Button><p className="mt-4 text-xs leading-5 text-muted-foreground">Student OS 不展示虚构进度；所有指标仅来自你的真实记录。</p></main>
  </div>;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const [location, setLocation] = useLocation(); const isMobile = useIsMobile();
  const active = menuItems.find(item => item.path === location) ?? menuItems[0];
  return <><Sidebar collapsible="icon" className="border-r border-sidebar-border/70 bg-sidebar/80 backdrop-blur-xl"><SidebarHeader className="h-20 px-3"><button className="flex w-full items-center gap-3 px-2 text-left" onClick={() => setLocation("/")}><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"><Sparkles className="h-4 w-4" /></div><div className="group-data-[collapsible=icon]:hidden"><p className="font-display text-base font-semibold tracking-[-0.04em]">Student OS</p><p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Growth workspace</p></div></button></SidebarHeader><SidebarContent className="px-2"><p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground group-data-[collapsible=icon]:hidden">个人系统</p><SidebarMenu>{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={item.path === location} tooltip={item.label} onClick={() => setLocation(item.path)} className="h-10 rounded-xl px-3 text-sm transition-all"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu><div className="mx-3 mt-7 rounded-2xl border border-primary/10 bg-primary/[0.055] p-3 group-data-[collapsible=icon]:hidden"><div className="flex items-center gap-2 text-primary"><Clock3 className="h-3.5 w-3.5" /><span className="text-xs font-semibold">今日提醒</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">记录一次投入，或者用一句反思为今天收尾。</p><button className="mt-3 text-xs font-semibold text-primary hover:underline" onClick={() => setLocation("/review")}>去写复盘</button></div></SidebarContent><SidebarFooter className="p-3"><div className="mb-2 flex gap-1 group-data-[collapsible=icon]:hidden"><Button variant="ghost" size="sm" className="h-8 flex-1 rounded-lg text-xs" onClick={toggleTheme}>{theme === "light" ? <Moon className="mr-1.5 h-3.5 w-3.5" /> : <Sun className="mr-1.5 h-3.5 w-3.5" />}{theme === "light" ? "暗色" : "亮色"}</Button></div><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"><Avatar className="h-8 w-8 border border-sidebar-border"><AvatarFallback className="bg-primary/10 text-xs text-primary">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-medium">{user?.name || "我的工作台"}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">个人成长空间</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />退出登录</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><SidebarInset className="min-h-screen bg-transparent"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/55 bg-background/75 px-4 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3">{isMobile ? <SidebarTrigger className="rounded-lg" /> : <SidebarTrigger className="rounded-lg" />}<div><p className="text-sm font-semibold">{active.label}</p><p className="text-[11px] text-muted-foreground">持续积累，持续进化</p></div></div><Button variant="ghost" size="icon" className="rounded-xl" onClick={toggleTheme} aria-label="切换颜色模式">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</Button></header><main className="min-h-[calc(100vh-4rem)] px-4 py-7 sm:px-6 lg:px-8 lg:py-9"><div className="mx-auto max-w-7xl">{children}</div></main></SidebarInset></>;
}
