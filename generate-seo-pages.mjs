import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
globalThis.window = {};
await import(pathToFileURL(path.join(root, "lessons-data.js")));

const lessons = globalThis.window.lessonData;
const outputDir = path.join(root, "lessons");
fs.mkdirSync(outputDir, { recursive: true });
const configPath = path.join(root, "publish-config.json");
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, "utf8"))
  : { siteUrl: "" };
const siteUrl = (config.siteUrl || "").replace(/\/$/, "");

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const languageName = (language) => language === "js" ? "JavaScript" : language.toUpperCase();

lessons.forEach((lesson, index) => {
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const terms = lesson.terms.map(([term, description]) =>
    `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd></div>`
  ).join("");
  const syntax = lesson.syntax.map((item) =>
    `<div><code>${escapeHtml(item.token)}</code><p>${escapeHtml(item.text)}</p></div>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(lesson.title)}｜${languageName(lesson.language)}初心者向け解説</title>
  <meta name="description" content="${escapeHtml(`${languageName(lesson.language)}初心者向けに「${lesson.title}」をサンプルコード、構文、重要語とともにわかりやすく解説します。`)}">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="CodeScope">
  <meta property="og:title" content="${escapeHtml(`${lesson.title}｜${languageName(lesson.language)}初心者向け解説`)}">
  <meta property="og:description" content="${escapeHtml(lesson.summary)}">
  ${siteUrl ? `<link rel="canonical" href="${siteUrl}/lessons/${lesson.id}.html">` : ""}
  <link rel="stylesheet" href="../lesson-article.css">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${lesson.title} - ${languageName(lesson.language)}入門`,
    description: lesson.summary,
    provider: { "@type": "Organization", name: "CodeScope" },
    educationalLevel: lesson.level,
    inLanguage: "ja"
  }, null, 2)}
  </script>
</head>
<body>
  <header class="article-header">
    <a class="brand" href="../index.html"><span>&lt;/&gt;</span> CodeScope</a>
    <nav><a href="../learn.html?lesson=${lesson.id}">ライブ教材を開く</a><a href="../about.html">このサイトについて</a></nav>
  </header>
  <main>
    <nav class="breadcrumb" aria-label="パンくず">
      <a href="../index.html">ホーム</a><span>›</span>
      <a href="../learn.html">${languageName(lesson.language)}講座</a><span>›</span>
      <span>${escapeHtml(lesson.title)}</span>
    </nav>
    <article>
      <header class="article-intro">
        <p class="eyebrow">LESSON ${String(index + 1).padStart(2, "0")} / ${languageName(lesson.language)} / ${lesson.level}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lead">${escapeHtml(lesson.summary)}</p>
        <a class="try-button" href="../learn.html?lesson=${lesson.id}">コードを編集して試す <span>→</span></a>
      </header>

      <section>
        <p class="section-label">SAMPLE CODE</p>
        <h2>サンプルコード</h2>
        <pre><code>${escapeHtml(lesson.code)}</code></pre>
        <p class="impact">${escapeHtml(lesson.impact)}</p>
      </section>

      <section class="two-column">
        <div>
          <p class="section-label">SYNTAX</p>
          <h2>構文の読み方</h2>
          <div class="syntax-list">${syntax}</div>
        </div>
        <div>
          <p class="section-label">WORDS</p>
          <h2>重要語</h2>
          <dl class="term-list">${terms}</dl>
        </div>
      </section>

      <aside class="learning-notes">
        <div><b>POINT</b><p>${escapeHtml(lesson.point)}</p></div>
        <div><b>CAUTION</b><p>${escapeHtml(lesson.caution)}</p></div>
      </aside>

      <div class="ad-slot" data-ad-status="inactive" aria-label="広告掲載エリア">
        <span>広告</span>
        <p>学習内容の区切りにのみ広告を掲載します</p>
        <!-- AdSense審査通過後、この内側へ広告ユニットを設置します。 -->
      </div>

      <nav class="article-pagination" aria-label="前後の講座">
        ${previous ? `<a href="${previous.id}.html"><small>PREVIOUS</small>← ${escapeHtml(previous.title)}</a>` : "<span></span>"}
        ${next ? `<a href="${next.id}.html"><small>NEXT</small>${escapeHtml(next.title)} →</a>` : "<span></span>"}
      </nav>
    </article>
  </main>
  <footer>
    <p>© CodeScope</p>
    <nav><a href="../privacy.html">プライバシーポリシー</a><a href="../about.html">サイトについて</a></nav>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${lesson.id}.html`), html);
});

const grouped = ["html", "css", "js"].map((language) => {
  const label = languageName(language);
  const links = lessons.filter((item) => item.language === language).map((item) =>
    `<li><a href="${item.id}.html"><span>${escapeHtml(item.category)} / ${item.level}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.summary)}</p></a></li>`
  ).join("");
  return `<section><p class="section-label">${label}</p><h2>${label}講座</h2><ol>${links}</ol></section>`;
}).join("");

fs.writeFileSync(path.join(outputDir, "index.html"), `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HTML・CSS・JavaScript初心者向け全61講座｜CodeScope</title>
  <meta name="description" content="HTML・CSS・JavaScript初心者向けの全61講座一覧。基本構文からレイアウト、DOM、非同期処理までサンプルコード付きで学べます。">
  <meta name="robots" content="index,follow">
  ${siteUrl ? `<link rel="canonical" href="${siteUrl}/lessons/">` : ""}
  <link rel="stylesheet" href="../lesson-index.css">
</head>
<body>
  <header><a href="../index.html">&lt;/&gt; CodeScope</a><a href="../learn.html">ライブ学習ページ</a></header>
  <main>
    <p class="eyebrow">ALL 61 LESSONS</p>
    <h1>初心者向け<br>Web制作講座一覧</h1>
    <p class="lead">HTML・CSS・JavaScriptを基礎から順番に学べます。各講座にはコード、構文解説、重要語、注意点があります。</p>
    ${grouped}
  </main>
  <footer><a href="../about.html">サイトについて</a><a href="../privacy.html">プライバシーポリシー</a></footer>
</body>
</html>`);

if (siteUrl) {
  const urls = [
    "",
    "/learn.html",
    "/lessons/",
    "/about.html",
    "/privacy.html",
    ...lessons.map((item) => `/lessons/${item.id}.html`)
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url || "/"}</loc></url>`).join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
} else {
  fs.writeFileSync(path.join(root, "robots.txt"), "User-agent: *\nAllow: /\n");
}

console.log(`Generated ${lessons.length} lesson pages.`);
