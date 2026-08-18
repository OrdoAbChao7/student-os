import { Metric, PageHeader, Surface } from "@/components/growth-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BrainCircuit, Clock3, FolderKanban, Sparkles, Timer, WandSparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

function formatMinutes(minutes: number) {
  if (!minutes) return "0 分钟";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} 小时 ${rest ? `${rest} 分` : ""}` : `${rest} 分钟`;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.growth.dashboard.useQuery(undefined, { refetchInterval: 60_000 });
  const updateTask = trpc.growth.tasks.update.useMutation({ onSuccess: () => utils.growth.dashboard.invalidate() });
  if (isLoading || !data) return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

  return <div className="space-y-7">
    <PageHeader eyebrow="今天的成长轨迹" title="每一个完成，都在构建更好的你。" description="Student OS 会把真实发生的任务、学习与项目行动，沉淀为可回溯的成长记录。" action={<div className="flex gap-2"><Button variant="outline" className="rounded-xl" onClick={() => setLocation("/time")}><Timer className="mr-2 h-4 w-4" />开始专注</Button><Button className="rounded-xl" onClick={() => setLocation("/review")}><Sparkles className="mr-2 h-4 w-4" />写下复盘</Button></div>} />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="今日任务" value={`${data.completedToday} / ${data.taskTotal}`} hint="完成的任务会进入复盘轨迹" />
      <Metric label="深度投入" value={formatMinutes(data.timeMinutes)} hint="来自真实的手动记录与计时" accent="violet" />
      <Metric label="成长指数" value={`${data.growthIndex}%`} hint="根据技能经验自动汇总" accent="mint" />
      <Metric label="进行中项目" value={`${data.projects.filter(p => p.status === "active").length}`} hint="以里程碑推进长期目标" accent="amber" />
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Surface>
        <div className="flex items-center justify-between gap-4"><div><p className="text-base font-semibold">今天的计划</p><p className="mt-1 text-sm text-muted-foreground">专注于最有价值的下一步。</p></div><Link href="/tasks" className="text-sm font-medium text-primary hover:underline">任务管理</Link></div>
        <div className="mt-5 divide-y divide-border/70">
          {data.tasks.length ? data.tasks.slice(0, 6).map(task => <div className="flex items-center gap-3 py-3.5" key={task.id}>
            <Checkbox checked={task.status === "done"} onCheckedChange={() => updateTask.mutate({ id: task.id, status: task.status === "done" ? "todo" : "done" })} aria-label={`完成 ${task.title}`} />
            <div className="min-w-0 flex-1"><p className={task.status === "done" ? "text-sm text-muted-foreground line-through" : "text-sm font-medium"}>{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.category}{task.dueAt ? ` · 截止 ${new Date(task.dueAt).toLocaleDateString()}` : ""}</p></div>
            <Badge variant="secondary" className="rounded-full text-[10px]">{task.priority === "urgent" ? "紧急" : task.priority === "high" ? "高优先" : "待推进"}</Badge>
          </div>) : <div className="py-12 text-center"><p className="font-medium">今天还没有任务</p><p className="mt-2 text-sm text-muted-foreground">从一件足够小、能够马上开始的事出发。</p><Button size="sm" className="mt-4 rounded-xl" onClick={() => setLocation("/tasks")}>创建任务</Button></div>}
        </div>
      </Surface>
      <Surface className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-[0_22px_55px_-26px_rgba(79,70,229,.7)]">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" /><div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-200/15 blur-3xl" />
        <div className="relative"><div className="flex items-center gap-2 text-indigo-100"><WandSparkles className="h-4 w-4" /><span className="text-sm font-medium">AI 成长助手</span></div>
          {data.report ? <><p className="mt-6 text-xl font-semibold tracking-[-0.035em]">{data.report.summary}</p><p className="mt-3 text-sm leading-6 text-indigo-100">{data.report.insight}</p><Button variant="secondary" className="mt-6 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => setLocation("/review")}>查看明日计划<ArrowUpRight className="ml-2 h-4 w-4" /></Button></> : <><p className="mt-6 text-xl font-semibold tracking-[-0.035em]">让今天真实发生的数据，成为明天更清晰的方向。</p><p className="mt-3 text-sm leading-6 text-indigo-100">完成任务、记录专注时间或写下复盘后，即可生成仅基于你当日真实行为的 AI 总结。</p><Button variant="secondary" className="mt-6 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => setLocation("/review")}>去生成报告<ArrowUpRight className="ml-2 h-4 w-4" /></Button></>}
        </div>
      </Surface>
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      <Surface><div className="flex items-center justify-between"><div className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-primary" /><p className="font-semibold">能力成长</p></div><Link href="/skills" className="text-sm font-medium text-primary hover:underline">能力图谱</Link></div><div className="mt-5 space-y-4">{data.skills.length ? data.skills.slice(0, 4).map(skill => <div key={skill.id}><div className="mb-2 flex justify-between text-sm"><span>{skill.name}<span className="ml-2 text-xs text-muted-foreground">Lv.{skill.level}</span></span><span className="text-muted-foreground">{skill.progress}%</span></div><Progress value={skill.progress} className="h-2" /></div>) : <p className="py-8 text-center text-sm text-muted-foreground">添加一项技能，开始构建属于你的能力坐标。</p>}</div></Surface>
      <Surface><div className="flex items-center justify-between"><div className="flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" /><p className="font-semibold">项目脉搏</p></div><Link href="/projects" className="text-sm font-medium text-primary hover:underline">项目空间</Link></div><div className="mt-5 space-y-3">{data.projects.length ? data.projects.slice(0, 3).map(project => <div key={project.id} className="rounded-xl bg-muted/45 p-3.5"><div className="flex items-center justify-between"><p className="text-sm font-medium">{project.title}</p><span className="text-xs text-muted-foreground">{project.progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div><div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{project.status === "active" ? "正在推进" : project.status === "idea" ? "灵感阶段" : "持续迭代"}</div></div>) : <p className="py-8 text-center text-sm text-muted-foreground">一个长期项目，会把零散投入连接成成果。</p>}</div></Surface>
    </div>
  </div>;
}
