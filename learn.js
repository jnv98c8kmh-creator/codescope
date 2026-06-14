const lessons = window.lessonData;
const completedKey = "codescope-completed-lessons";
localStorage.removeItem(completedKey);

const state = {
  currentId: new URLSearchParams(location.search).get("lesson") || lessons[0].id,
  filter: "all",
  search: "",
  completed: new Set()
};

const elements = {
  list: document.querySelector("#lesson-list"),
  search: document.querySelector("#lesson-search"),
  number: document.querySelector("#lesson-number"),
  language: document.querySelector("#lesson-language"),
  level: document.querySelector("#lesson-level"),
  title: document.querySelector("#lesson-title"),
  summary: document.querySelector("#lesson-summary"),
  editor: document.querySelector("#code-editor"),
  highlight: document.querySelector("#code-highlight"),
  lineNumbers: document.querySelector("#line-numbers"),
  preview: document.querySelector("#preview"),
  editorFile: document.querySelector("#editor-file"),
  tryText: document.querySelector("#try-text"),
  impact: document.querySelector("#impact-text"),
  syntax: document.querySelector("#syntax-explanation"),
  terms: document.querySelector("#term-list"),
  point: document.querySelector("#point-text"),
  caution: document.querySelector("#caution-text"),
  complete: document.querySelector("#complete-lesson"),
  previous: document.querySelector("#previous-lesson"),
  next: document.querySelector("#next-lesson"),
  progressText: document.querySelector("#progress-text"),
  progressBar: document.querySelector("#progress-bar"),
  courseMap: document.querySelector("#course-map"),
  sidebar: document.querySelector("#sidebar"),
  toast: document.querySelector("#toast")
};

let renderTimer;
let fullExplanationActive = false;
let codeBeforeExplanation = "";

function currentLesson() {
  return lessons.find((item) => item.id === state.currentId) || lessons[0];
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function isCommentLine(line, language) {
  const trimmed = line.trim();
  if (language === "html") return trimmed.startsWith("<!--");
  if (language === "css") return trimmed.startsWith("/*");
  return trimmed.startsWith("//");
}

function updateCodeHighlight() {
  const language = currentLesson().language;
  elements.highlight.innerHTML = elements.editor.value
    .split("\n")
    .map((line) => {
      const className = isCommentLine(line, language) ? ' class="comment-line"' : "";
      return `<span${className}>${escapeHtml(line) || " "}</span>`;
    })
    .join("\n");
}

function describeCodeLine(line, language) {
  const text = line.trim();
  if (!text) return "";

  if (language === "html") {
    if (/^<!DOCTYPE/i.test(text)) return "この文書がHTML5で書かれていることをブラウザへ宣言します。";
    if (/^<\/[\w-]+>/.test(text)) return `${text.match(/^<\/([\w-]+)/)[1]}要素をここで閉じます。`;
    if (/^<meta/.test(text)) return "ページの文字コードや表示方法など、文書の設定情報を指定します。";
    if (/^<img/.test(text)) return "画像を表示します。srcは画像の場所、altは画像の説明です。";
    if (/^<a\b/.test(text)) return "a要素でリンクを作り、href属性で移動先を指定します。";
    if (/^<input/.test(text)) return "ユーザーが値を入力または選択できる入力欄を作ります。";
    if (/^<button/.test(text)) return "クリックや送信に使う操作ボタンを作ります。";
    if (/^<h[1-6]\b/.test(text)) return "見出しを作り、ページ内の情報階層をブラウザへ伝えます。";
    if (/^<p\b/.test(text)) return "ひとまとまりの文章を段落として表示します。";
    if (/^<li\b/.test(text)) return "リスト内の一つの項目を表します。";
    if (/^<([\w-]+)/.test(text)) return `${text.match(/^<([\w-]+)/)[1]}要素を開始し、内側の内容をひとまとまりにします。`;
    return "画面に表示する文字または要素の内容です。";
  }

  if (language === "css") {
    if (/^@media/.test(text)) return "画面幅などの条件を満たす場合だけ、内側のCSSを適用します。";
    if (/^@keyframes/.test(text)) return "アニメーション中の変化を定義するキーフレームを開始します。";
    if (/^[.#:\w*][^{]*\{$/.test(text)) return `このセレクタに一致する要素へ、内側のスタイルを適用します。`;
    if (text === "}") return "このCSSルールの指定範囲をここで閉じます。";
    const property = text.match(/^([\w-]+)\s*:\s*(.+);?$/);
    if (property) {
      const names = {
        display: "要素の表示形式とレイアウト方式",
        color: "文字の色",
        background: "背景",
        "background-color": "背景色",
        width: "横幅",
        height: "高さ",
        padding: "枠線の内側の余白",
        margin: "枠線の外側の余白",
        border: "枠線",
        "font-size": "文字の大きさ",
        "line-height": "行の高さ",
        "grid-template-columns": "Gridの列構成",
        "justify-content": "主軸方向の配置",
        "align-items": "交差軸方向の配置",
        transform: "要素の移動・回転・拡大縮小",
        animation: "アニメーションの動作"
      };
      return `${names[property[1]] || property[1]}を「${property[2].replace(/;$/, "")}」に設定します。`;
    }
    return "この行はスタイルの条件または値を指定しています。";
  }

  if (/^(const|let)\s+/.test(text)) {
    const name = text.match(/^(?:const|let)\s+([\w$]+)/)?.[1];
    return `変数${name ? `「${name}」` : ""}を宣言し、右辺の値を保存します。`;
  }
  if (/^function\s+/.test(text)) return "再利用できる処理を関数として定義します。";
  if (/^async function/.test(text)) return "非同期処理をawaitできるasync関数を定義します。";
  if (/addEventListener/.test(text)) return "指定したイベントが発生したときに、内側の関数を実行します。";
  if (/querySelectorAll/.test(text)) return "CSSセレクタに一致するすべてのHTML要素を取得します。";
  if (/querySelector/.test(text)) return "CSSセレクタに最初に一致するHTML要素を取得します。";
  if (/textContent\s*=/.test(text)) return "取得したHTML要素の文字内容を書き換えます。";
  if (/innerHTML\s*=/.test(text)) return "取得した要素の内側へHTML文字列を設定します。";
  if (/classList\./.test(text)) return "要素のclassを追加・削除・切り替えして見た目や状態を変更します。";
  if (/^if\s*\(/.test(text)) return "丸括弧内の条件がtrueの場合に、波括弧内の処理を実行します。";
  if (/^}\s*else/.test(text)) return "直前の条件がfalseだった場合の処理へ切り替えます。";
  if (/^for\s*\(/.test(text)) return "条件を満たしている間、波括弧内の処理を繰り返します。";
  if (/\.forEach\(/.test(text)) return "配列や要素の集まりを一つずつ順番に処理します。";
  if (/\.map\(/.test(text)) return "各要素を変換し、その結果から新しい配列を作ります。";
  if (/^return\b/.test(text)) return "関数の処理を終了し、呼び出し元へ値を返します。";
  if (/^await\b|=\s*await\b/.test(text)) return "非同期処理が完了するまで待ってから次の行へ進みます。";
  if (/^}/.test(text) || /^\}\);?/.test(text)) return "ここまでで処理ブロックまたは関数を閉じます。";
  return "このJavaScript命令を上から順番に実行します。";
}

function commentForLine(description, language, indent) {
  if (language === "html") return `${indent}<!-- 解説: ${description} -->`;
  if (language === "css") return `${indent}/* 解説: ${description} */`;
  return `${indent}// 解説: ${description}`;
}

function buildFullyExplainedCode(code, language) {
  return code.split("\n").flatMap((line) => {
    if (!line.trim() || isCommentLine(line, language)) return [line];
    const indent = line.match(/^\s*/)[0];
    const comment = commentForLine(describeCodeLine(line, language), language, indent);
    if (language === "html" && /^<!DOCTYPE/i.test(line.trim())) return [line, comment];
    return [comment, line];
  }).join("\n");
}

function buildPreview(item, code) {
  if (item.language === "html") {
    if (/<!doctype|<html/i.test(code)) return code;
    return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><style>${window.sharedPreviewStyle}</style></head><body>${code}</body></html>`;
  }

  if (item.language === "css") {
    return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><style>${window.sharedPreviewStyle}\n${code}</style></head><body>${item.fixture}</body></html>`;
  }

  return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><style>${window.sharedPreviewStyle}</style></head><body>${item.fixture}<script>
window.addEventListener("error", (event) => {
  const output = document.querySelector("#output") || document.body.appendChild(document.createElement("pre"));
  output.className = "output";
  output.textContent = "Error: " + event.message;
});
<\/script><script type="module">${code}<\/script></body></html>`;
}

function updatePreview() {
  elements.preview.srcdoc = buildPreview(currentLesson(), elements.editor.value);
}

function updateLineNumbers() {
  const count = elements.editor.value.split("\n").length;
  elements.lineNumbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join("\n");
}

function renderList() {
  const query = state.search.trim().toLowerCase();
  const grouped = {};
  lessons
    .filter((item) => state.filter === "all" || item.language === state.filter)
    .filter((item) => `${item.title} ${item.summary} ${item.category} ${item.terms.flat().join(" ")}`.toLowerCase().includes(query))
    .forEach((item) => {
      const key = `${item.language}:${item.category}`;
      (grouped[key] ||= []).push(item);
    });

  elements.list.innerHTML = Object.entries(grouped).map(([key, items]) => {
    const [language, category] = key.split(":");
    return `<section>
      <h2><span class="lang-dot ${language}"></span>${language.toUpperCase()} / ${category}</h2>
      ${items.map((item) => {
        const number = String(lessons.indexOf(item) + 1).padStart(2, "0");
        return `<button class="lesson-link ${item.id === state.currentId ? "active" : ""}" data-id="${item.id}" type="button">
          <i class="${state.completed.has(item.id) ? "done" : ""}">${state.completed.has(item.id) ? "✓" : number}</i>
          <span>${escapeHtml(item.title)}<small>${item.level}</small></span>
        </button>`;
      }).join("")}
    </section>`;
  }).join("") || `<p class="empty">該当する講座がありません。</p>`;
}

function renderLesson() {
  const item = currentLesson();
  const index = lessons.indexOf(item);
  const languageLabel = item.language === "js" ? "JavaScript" : item.language.toUpperCase();
  elements.number.textContent = `LESSON ${String(index + 1).padStart(2, "0")} / ${lessons.length}`;
  elements.language.textContent = languageLabel;
  elements.language.dataset.lang = item.language;
  elements.level.textContent = item.level;
  elements.title.textContent = item.title;
  document.querySelector("#article-link").href = `lessons/${item.id}.html`;
  elements.summary.textContent = item.summary;
  elements.editor.value = item.code;
  fullExplanationActive = false;
  codeBeforeExplanation = "";
  document.querySelector("#full-explanation").classList.remove("active");
  document.querySelector("#full-explanation").textContent = "完全解説";
  elements.editorFile.textContent = item.language === "html" ? "index.html" : item.language === "css" ? "style.css" : "script.js";
  elements.tryText.textContent = item.tryText;
  elements.impact.textContent = item.impact;
  elements.point.textContent = item.point;
  elements.caution.textContent = item.caution;
  elements.syntax.innerHTML = item.syntax.map((entry) => `<div><code>${escapeHtml(entry.token)}</code><p>${escapeHtml(entry.text)}</p></div>`).join("");
  elements.terms.innerHTML = item.terms.map(([term, description]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd></div>`).join("");
  elements.complete.classList.toggle("completed", state.completed.has(item.id));
  elements.complete.textContent = state.completed.has(item.id) ? "✓ 完了済み" : "✓ 完了にする";
  elements.previous.disabled = index === 0;
  elements.next.disabled = index === lessons.length - 1;
  history.replaceState(null, "", `?lesson=${item.id}`);
  updateLineNumbers();
  updateCodeHighlight();
  updatePreview();
  renderList();
  renderCourseMap();
  elements.sidebar.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProgress() {
  const count = state.completed.size;
  elements.progressText.textContent = `${count} / ${lessons.length} 完了`;
  elements.progressBar.style.width = `${(count / lessons.length) * 100}%`;
}

function renderCourseMap() {
  const groups = [
    ["HTML", lessons.filter((item) => item.language === "html")],
    ["CSS", lessons.filter((item) => item.language === "css")],
    ["JavaScript", lessons.filter((item) => item.language === "js")]
  ];
  elements.courseMap.innerHTML = groups.map(([label, items]) => {
    const done = items.filter((item) => state.completed.has(item.id)).length;
    return `<div class="map-row"><strong>${label}</strong><div>${items.map((item) => `<button class="${state.completed.has(item.id) ? "done" : ""} ${item.id === state.currentId ? "current" : ""}" data-id="${item.id}" title="${escapeHtml(item.title)}" type="button"></button>`).join("")}</div><span>${done}/${items.length}</span></div>`;
  }).join("");
}

function selectLesson(id) {
  if (!lessons.some((item) => item.id === id)) return;
  state.currentId = id;
  renderLesson();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

elements.editor.addEventListener("input", () => {
  updateLineNumbers();
  updateCodeHighlight();
  clearTimeout(renderTimer);
  renderTimer = setTimeout(updatePreview, 250);
});
elements.editor.addEventListener("scroll", () => {
  elements.lineNumbers.scrollTop = elements.editor.scrollTop;
  elements.highlight.scrollTop = elements.editor.scrollTop;
  elements.highlight.scrollLeft = elements.editor.scrollLeft;
});
elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (button) selectLesson(button.dataset.id);
});
elements.courseMap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (button) selectLesson(button.dataset.id);
});
elements.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderList();
});
document.querySelector(".language-filter").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderList();
});
document.querySelector("#reset-code").addEventListener("click", () => {
  elements.editor.value = currentLesson().code;
  fullExplanationActive = false;
  codeBeforeExplanation = "";
  document.querySelector("#full-explanation").classList.remove("active");
  document.querySelector("#full-explanation").textContent = "完全解説";
  updateLineNumbers();
  updateCodeHighlight();
  updatePreview();
  showToast("コードを元に戻しました");
});
document.querySelector("#full-explanation").addEventListener("click", (event) => {
  if (fullExplanationActive) {
    elements.editor.value = codeBeforeExplanation;
    fullExplanationActive = false;
    event.currentTarget.classList.remove("active");
    event.currentTarget.textContent = "完全解説";
    showToast("完全解説を閉じました");
  } else {
    codeBeforeExplanation = elements.editor.value;
    elements.editor.value = buildFullyExplainedCode(codeBeforeExplanation, currentLesson().language);
    fullExplanationActive = true;
    event.currentTarget.classList.add("active");
    event.currentTarget.textContent = "解説を閉じる";
    showToast("全コード行へ解説を追加しました");
  }
  elements.editor.scrollTop = 0;
  elements.editor.scrollLeft = 0;
  updateLineNumbers();
  updateCodeHighlight();
  updatePreview();
});
elements.complete.addEventListener("click", () => {
  const id = currentLesson().id;
  state.completed.has(id) ? state.completed.delete(id) : state.completed.add(id);
  localStorage.setItem(completedKey, JSON.stringify([...state.completed]));
  renderProgress();
  renderList();
  renderCourseMap();
  elements.complete.classList.toggle("completed", state.completed.has(id));
  elements.complete.textContent = state.completed.has(id) ? "✓ 完了済み" : "✓ 完了にする";
  showToast(state.completed.has(id) ? "講座を完了しました" : "完了を取り消しました");
});
elements.previous.addEventListener("click", () => {
  const index = lessons.indexOf(currentLesson());
  if (index > 0) selectLesson(lessons[index - 1].id);
});
elements.next.addEventListener("click", () => {
  const index = lessons.indexOf(currentLesson());
  if (index < lessons.length - 1) selectLesson(lessons[index + 1].id);
});
document.querySelector(".viewport-buttons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-width]");
  if (!button) return;
  document.querySelectorAll("[data-width]").forEach((item) => item.classList.toggle("active", item === button));
  elements.preview.style.width = button.dataset.width;
});
document.querySelector("#mobile-menu").addEventListener("click", () => elements.sidebar.classList.add("open"));
document.querySelector("#close-menu").addEventListener("click", () => elements.sidebar.classList.remove("open"));
document.querySelector("#reset-progress").addEventListener("click", () => {
  state.completed.clear();
  localStorage.removeItem(completedKey);
  renderProgress();
  renderList();
  renderCourseMap();
  showToast("進捗をリセットしました");
});

renderProgress();
renderLesson();
