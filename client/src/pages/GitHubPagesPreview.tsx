import "./GitHubPagesPreview.css";

const repositoryUrl = "https://github.com/OrdoAbChao7/student-os";

export default function GitHubPagesPreview() {
  return <main className="pages-preview">
    <nav className="pages-shell pages-nav" aria-label="主导航">
      <a className="pages-brand" href="./" aria-label="Student OS 首页"><span className="pages-brand-mark">✦</span><span><strong>Student OS</strong><small>GROWTH WORKSPACE</small></span></a>
      <a className="pages-source" href={repositoryUrl}>查看源码 <span aria-hidden="true">↗</span></a>
    </nav>
    <section className="pages-shell pages-hero"><p className="pages-eyebrow">PERSONAL GROWTH, MADE AUDITABLE</p><h1>让每一次投入，<br /><em>都有可回看的证据。</em></h1><p className="pages-lede">Student OS 为个人开发者与学习者整合任务、时间、课程、项目、能力与复盘。成长结论只来自你自己保存的真实行动。</p><div className="pages-actions"><a className="pages-button pages-primary" href={repositoryUrl}>在 GitHub 查看项目</a><a className="pages-button pages-secondary" href="#modules">浏览能力模块</a></div></section>
    <section className="pages-shell pages-metrics" aria-label="产品能力摘要"><article><span>01</span><strong>行动闭环</strong><p>从任务到完成记录，让下一步清晰可见。</p></article><article><span>02</span><strong>投入可见</strong><p>以手动打卡与计时器沉淀真实专注时间。</p></article><article><span>03</span><strong>能力累积</strong><p>将任务、学习与项目沉淀为可追溯经验。</p></article></section>
    <section className="pages-shell pages-workspace" id="modules"><div className="pages-copy"><p className="pages-eyebrow">THE WORKSPACE</p><h2>不是更多工具，<br />而是更连贯的成长系统。</h2><p>每个模块服务于同一条链路：投入、完成、复盘、理解下一步。数据不再分散，进度也不再依赖主观印象。</p></div><div className="pages-module-grid"><article className="pages-module pages-featured"><span className="pages-module-icon">◎</span><h3>成长工作台</h3><p>在今天的任务、投入、项目与成长指数之间建立连接。</p><b>今天的轨迹</b></article><article className="pages-module"><span className="pages-module-icon">✓</span><h3>任务与项目</h3><p>把长期意图拆解为里程碑和可完成的子任务。</p></article><article className="pages-module"><span className="pages-module-icon">◷</span><h3>时间与学习</h3><p>为课程、笔记、资源与每次专注留下记录。</p></article><article className="pages-module"><span className="pages-module-icon">✦</span><h3>能力与复盘</h3><p>以经验事件、能力雷达与每日复盘观察真正的变化。</p></article></div></section>
    <section className="pages-shell pages-principle"><p className="pages-eyebrow">DATA PRINCIPLE</p><blockquote>“AI 建议不能替代行动，<br />但可以帮助你读懂行动。”</blockquote><p>每日 AI 报告仅在存在真实任务、学习、时间、项目或复盘记录时生成；没有事实依据，就不会制造进度或结论。</p></section>
    <section className="pages-shell pages-note"><span className="pages-note-icon" aria-hidden="true">i</span><div><strong>这是由 Student OS 客户端构建的 GitHub Pages 静态预览。</strong><p>完整 Student OS 需要 OAuth、tRPC 服务端、数据库和 AI 网关，因此应部署到支持 Node 服务端的运行环境。请查看仓库 README 了解本地运行与完整部署方式。</p></div><a href={`${repositoryUrl}#readme`}>阅读 README</a></section>
    <footer className="pages-shell pages-footer"><span>Student OS · 真实数据驱动的个人成长工作台</span><a href={repositoryUrl}>OrdoAbChao7/student-os</a></footer>
  </main>;
}
