const sharedPreviewStyle = `
  *{box-sizing:border-box}body{margin:0;padding:28px;color:#17202a;background:#f8f6ef;font-family:Arial,sans-serif}
  button,input,select,textarea{font:inherit}.demo-box{padding:24px;border:2px solid #4057f2;border-radius:12px;background:white}
  .card{max-width:320px;padding:22px;border-radius:14px;background:white;box-shadow:0 12px 35px #17202a1c}
  .accent{color:#4057f2}.row{display:flex;gap:12px;flex-wrap:wrap}.item{padding:16px;background:#94eee7;border-radius:8px}
  button{padding:10px 16px;border:0;border-radius:6px;color:white;background:#4057f2;cursor:pointer}
  code{font-family:monospace}.output{margin-top:16px;padding:14px;border-radius:8px;background:#e9e7df;white-space:pre-wrap}
`;

function lesson(id, language, level, category, title, summary, code, options = {}) {
  return {
    id, language, level, category, title, summary, code,
    fixture: options.fixture || "",
    syntax: options.syntax || [
      { token: language === "html" ? "<要素>" : language === "css" ? "selector { property: value; }" : "命令(引数)", text: "記号と単語の組み合わせには、それぞれ決まった役割があります。" }
    ],
    terms: options.terms || [],
    tryText: options.tryText || "文字、数値、色などを変更し、右側の変化を確認しましょう。",
    impact: options.impact || "編集したコードが、このプレビュー領域の表示や動作へ反映されます。",
    point: options.point || "まずは完全に暗記せず、何を指定すると何が変化するかを結び付けましょう。",
    caution: options.caution || "記号の閉じ忘れやスペルミスは、表示されない原因になります。"
  };
}

const htmlLessons = [
  lesson("html-document", "html", "入門", "文書構造", "HTML文書の基本構造", "Webページを成立させる宣言、html、head、bodyの役割を学びます。",
`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>はじめてのページ</title>
</head>
<body>
  <h1>Hello, Web!</h1>
  <p>ここが画面に表示されます。</p>
</body>
</html>`, {
    syntax: [{token:"<!DOCTYPE html>",text:"HTML5で書かれた文書であることを宣言します。"},{token:"<head> / <body>",text:"設定情報と画面に見える内容を分けます。"}],
    terms:[["要素","開始タグから終了タグまでのひとまとまり。"],["属性","lang=\"ja\"のように要素へ追加情報を与えるもの。"]]
  }),
  lesson("html-heading", "html", "入門", "テキスト", "見出しと段落", "h1〜h6で文章の階層を作り、pで段落を表します。",
`<h1>Web制作入門</h1>
<h2>HTMLとは</h2>
<p>HTMLは文章の構造を表す言語です。</p>
<h2>次に学ぶこと</h2>
<p>CSSで見た目を整えます。</p>`, {
    terms:[["見出し","章や節のタイトル。h1が最上位です。"],["段落","ひとまとまりの文章を表すp要素。"]],
    impact:"見出しは大きさだけでなく、文書内の情報階層として認識されます。"
  }),
  lesson("html-text", "html", "入門", "テキスト", "強調・改行・引用", "strong、em、br、blockquoteなど文章へ意味を追加する要素を学びます。",
`<p><strong>重要:</strong> 毎日少しずつ続けましょう。</p>
<p>コードを読み、<br>自分で変更します。</p>
<blockquote>
  <em>作ること</em>が一番の近道です。
</blockquote>`, {
    terms:[["strong","重要性を表す要素。"],["em","文脈上の強調を表す要素。"],["blockquote","まとまった引用を表す要素。"]]
  }),
  lesson("html-links", "html", "入門", "リンク", "リンクとURL", "a要素とhref属性で、別ページやページ内の場所を結びます。",
`<h2 id="top">リンクの例</h2>
<p><a href="https://developer.mozilla.org/">MDNを開く</a></p>
<p><a href="#note">ページ内の説明へ</a></p>
<div style="height:120px"></div>
<p id="note">リンク先の場所です。 <a href="#top">上へ戻る</a></p>`, {
    terms:[["href","リンク先のURLを指定する属性。"],["URL","Web上の場所を表す住所。"],["フラグメント","#idで同じページ内の場所を示す部分。"]],
    caution:"新しいタブを開くtarget=\"_blank\"では、必要に応じてrel=\"noopener\"も指定します。"
  }),
  lesson("html-images", "html", "入門", "メディア", "画像と代替テキスト", "img要素で画像を表示し、alt属性で画像の意味を文章として伝えます。",
`<figure>
  <img
    src="https://picsum.photos/360/180"
    alt="教材用のランダムな風景写真"
    width="360"
    height="180">
  <figcaption>画像と説明文の組み合わせ</figcaption>
</figure>`, {
    terms:[["alt","画像を見られない場合に内容を伝える代替テキスト。"],["figure","画像や図表など自己完結した内容。"],["figcaption","figureの説明文。"]],
    caution:"装飾だけの画像はalt=\"\"にし、重要な画像は内容が伝わる説明を付けます。"
  }),
  lesson("html-lists", "html", "入門", "文書構造", "箇条書きと番号付きリスト", "ul、ol、liを使い、並列項目や手順を正しく表現します。",
`<h2>買うもの</h2>
<ul>
  <li>ノート</li>
  <li>ペン</li>
</ul>
<h2>学習手順</h2>
<ol>
  <li>コードを読む</li>
  <li>変更する</li>
  <li>結果を見る</li>
</ol>`, {
    terms:[["ul","順序に意味がないリスト。"],["ol","順番に意味があるリスト。"],["li","リスト内の各項目。"]]
  }),
  lesson("html-semantics", "html", "基礎", "セマンティクス", "意味のあるページ構造", "header、nav、main、section、article、footerで領域の役割を示します。",
`<header><strong>My Magazine</strong></header>
<nav><a href="#article">記事へ</a></nav>
<main>
  <article id="article">
    <h1>意味のあるHTML</h1>
    <section>
      <h2>なぜ使う？</h2>
      <p>構造が人と機械の両方に伝わります。</p>
    </section>
  </article>
</main>
<footer>© My Magazine</footer>`, {
    terms:[["セマンティクス","コードへ意味や役割を持たせる考え方。"],["main","ページ固有の主要内容。"],["article","単独でも成立する記事や投稿。"]]
  }),
  lesson("html-div-span", "html", "基礎", "グループ化", "divとspanの使い分け", "意味を持つ専用タグがないときに、範囲をまとめる汎用要素です。",
`<div class="card">
  <h2>プロフィール</h2>
  <p>名前: <span class="accent">CodeScope</span></p>
  <p>役割: 学習サポート</p>
</div>`, {
    terms:[["div","ブロック範囲をまとめる汎用要素。"],["span","文章中の小さな範囲をまとめる汎用要素。"],["class","複数要素へ共通の名前を付ける属性。"]]
  }),
  lesson("html-table", "html", "基礎", "データ", "表形式のデータ", "table、tr、th、tdで行と列の関係を持つデータを表します。",
`<table border="1" cellpadding="10">
  <caption>学習時間</caption>
  <thead>
    <tr><th>言語</th><th>時間</th></tr>
  </thead>
  <tbody>
    <tr><td>HTML</td><td>5時間</td></tr>
    <tr><td>CSS</td><td>10時間</td></tr>
  </tbody>
</table>`, {
    terms:[["th","見出しセル。"],["td","データセル。"],["caption","表の題名。"]],
    caution:"表はレイアウト目的ではなく、行と列に関係があるデータへ使います。"
  }),
  lesson("html-form", "html", "基礎", "フォーム", "フォームの基本", "form、label、input、buttonでユーザー入力を受け取る画面を作ります。",
`<form>
  <p>
    <label for="name">名前</label><br>
    <input id="name" name="name" type="text" required>
  </p>
  <button type="submit">送信する</button>
</form>`, {
    terms:[["form","入力内容をまとめて送信する領域。"],["label","入力欄の目的を示すラベル。"],["required","入力を必須にする属性。"]],
    caution:"labelのforと入力欄のidを同じ値にすると、ラベルと入力欄が関連付きます。"
  }),
  lesson("html-input-types", "html", "基礎", "フォーム", "入力欄の種類", "type属性を変えると、メール、数値、日付、色などに適した入力UIになります。",
`<label>メール <input type="email"></label><br><br>
<label>人数 <input type="number" min="1" max="10"></label><br><br>
<label>日付 <input type="date"></label><br><br>
<label>色 <input type="color" value="#4057f2"></label><br><br>
<label><input type="checkbox"> 利用規約に同意</label>`, {
    terms:[["type","入力するデータの種類。"],["min / max","入力可能な最小値と最大値。"],["checkbox","オン・オフを選ぶ入力欄。"]]
  }),
  lesson("html-select", "html", "基礎", "フォーム", "選択肢と複数行入力", "selectとoptionで選択欄、textareaで複数行の文章入力を作ります。",
`<label for="course">コース</label>
<select id="course">
  <option>HTML</option>
  <option>CSS</option>
  <option>JavaScript</option>
</select>
<p><label for="message">質問</label></p>
<textarea id="message" rows="4" cols="30"
  placeholder="質問を書いてください"></textarea>`, {
    terms:[["select","選択肢から一つを選ぶ部品。"],["option","select内の各選択肢。"],["textarea","複数行の入力欄。"]]
  }),
  lesson("html-details", "html", "基礎", "インタラクション", "開閉できる詳細情報", "detailsとsummaryだけで、JavaScriptなしの開閉UIを作れます。",
`<details open>
  <summary>HTMLとは？</summary>
  <p>Webページの意味と構造を記述する言語です。</p>
</details>
<details>
  <summary>CSSとは？</summary>
  <p>見た目とレイアウトを指定する言語です。</p>
</details>`, {
    terms:[["details","開いたり閉じたりできる詳細領域。"],["summary","常に表示される見出し部分。"],["open","最初から開いた状態にする属性。"]]
  }),
  lesson("html-audio-video", "html", "基礎", "メディア", "音声と動画", "audioとvideoでメディアを埋め込み、controls属性で操作UIを表示します。",
`<video width="360" controls muted
  poster="https://picsum.photos/360/200">
  <source src="sample.mp4" type="video/mp4">
  動画を再生できないブラウザです。
</video>
<p>controls、muted、posterなどを試せます。</p>`, {
    terms:[["controls","再生・停止などの操作UIを表示。"],["source","複数形式のメディア候補を指定。"],["poster","再生前に表示する画像。"]]
  }),
  lesson("html-picture", "html", "応用", "メディア", "レスポンシブ画像", "picture、source、srcsetで画面条件に応じた画像を選択します。",
`<picture>
  <source media="(max-width: 500px)"
    srcset="https://picsum.photos/300/300">
  <img src="https://picsum.photos/600/260"
    alt="画面幅で比率が変わるサンプル画像"
    style="max-width:100%;height:auto">
</picture>`, {
    terms:[["picture","画像候補をまとめる要素。"],["srcset","表示候補となる画像の一覧。"],["media","候補を使う画面条件。"]]
  }),
  lesson("html-meta", "html", "応用", "head", "meta情報とSEO", "文字コード、画面幅、説明文など、ページ自体の情報をhead内へ記述します。",
`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1">
  <meta name="description"
    content="HTMLを視覚的に学べるページ">
  <title>ページタイトル</title>
</head>
<body><h1>検索結果にも伝わる情報</h1></body>
</html>`, {
    terms:[["viewport","スマートフォンでの表示領域設定。"],["description","ページ内容の要約。"],["SEO","検索エンジンから見つけやすくする取り組み。"]]
  }),
  lesson("html-accessibility", "html", "応用", "アクセシビリティ", "アクセシブルなHTML", "キーボード操作、ラベル、代替テキスト、自然な要素選択を意識します。",
`<main>
  <h1>設定</h1>
  <label for="volume">音量</label>
  <input id="volume" type="range" min="0" max="100">
  <button type="button" aria-describedby="help">保存</button>
  <p id="help">現在の設定を保存します。</p>
</main>`, {
    terms:[["アクセシビリティ","障害や環境によらず利用できる度合い。"],["aria-describedby","要素と詳しい説明を関連付ける属性。"],["フォーカス","キーボード操作の対象になっている状態。"]],
    point:"まずはbuttonやinputなど、標準で意味と操作性を持つHTML要素を優先します。"
  }),
  lesson("html-data", "html", "応用", "属性", "data属性", "data-*属性に、JavaScriptから使う独自データを安全に保存できます。",
`<button data-product-id="A-101" data-price="1200">
  商品Aを選ぶ
</button>
<button data-product-id="B-205" data-price="1800">
  商品Bを選ぶ
</button>
<p>data属性は画面に見えない追加情報です。</p>`, {
    terms:[["data-*","独自データを格納するための属性。"],["dataset","JavaScriptからdata属性へアクセスする仕組み。"]]
  }),
  lesson("html-entities", "html", "応用", "テキスト", "特殊文字と文字参照", "タグと解釈される記号や、直接書きにくい文字を文字参照で表します。",
`<h2>HTMLコードを文章として表示</h2>
<p>&lt;h1&gt;見出し&lt;/h1&gt;</p>
<p>Tom &amp; Jerry</p>
<p>&copy; 2026 CodeScope</p>
<p>連続しない&nbsp;スペース</p>`, {
    terms:[["文字参照","&lt;のように特殊文字を表す記法。"],["&amp;lt;","小なり記号 < を表す。"],["&amp;amp;","アンパサンド & を表す。"]]
  }),
  lesson("html-validation", "html", "応用", "品質", "正しい構造と検証", "タグの入れ子、重複しないid、適切な親子関係を守ることが安定したページにつながります。",
`<main>
  <section aria-labelledby="lesson-title">
    <h1 id="lesson-title">正しい構造</h1>
    <ul>
      <li>タグを正しく閉じる</li>
      <li>idはページ内で一意にする</li>
      <li>要素の親子関係を守る</li>
    </ul>
  </section>
</main>`, {
    terms:[["バリデーション","文法や構造が規則に合うか確認すること。"],["入れ子","要素の中へ別の要素を配置する構造。"],["一意","同じ範囲に一つしかないこと。"]]
  })
];

const cssLessons = [
  lesson("css-syntax","css","入門","基本","CSSの基本構文","セレクタ、プロパティ、値で「どの要素をどう変えるか」を指定します.",
`h1 {
  color: #4057f2;
  font-size: 42px;
}

p {
  color: #555555;
  line-height: 1.8;
}`,{fixture:"<h1>CSSを学ぼう</h1><p>色や大きさ、余白を指定できます。</p>",terms:[["セレクタ","装飾する要素を選ぶ部分。"],["プロパティ","変更する項目。"],["値","具体的な設定内容。"]]}),
  lesson("css-selectors","css","入門","基本","さまざまなセレクタ","タグ、class、id、子孫関係を使って適用先を絞ります。",
`.card { padding: 20px; background: white; }
.card h2 { color: #4057f2; }
#special { border: 3px solid #ff7358; }
.card > p { line-height: 1.8; }`,{fixture:'<article class="card" id="special"><h2>カード見出し</h2><p>直接の子要素です。</p><div><p>内側の段落です。</p></div></article>',terms:[["classセレクタ",".名前でclassを選択。"],["idセレクタ","#名前でidを選択。"],["子セレクタ",">で直接の子だけを選択。"]]}),
  lesson("css-colors","css","入門","見た目","色と背景","HEX、rgb、hslなどの色指定と背景色を学びます。",
`body { background: #f1efe7; }
.card {
  color: rgb(24, 30, 42);
  background-color: hsl(177 72% 76%);
  border: 3px solid #4057f2;
}`,{fixture:'<div class="card"><h2>Color</h2><p>色の指定方法は複数あります。</p></div>',terms:[["HEX","#と16進数で表す色。"],["RGB","赤・緑・青の強さで表す色。"],["HSL","色相・彩度・明度で表す色。"]]}),
  lesson("css-units","css","入門","サイズ","CSSの単位","px、%、em、rem、vw、vhなど、用途に応じた単位を使います。",
`.box {
  width: 70%;
  min-height: 20vh;
  padding: 2rem;
  font-size: 1.1em;
  background: #94eee7;
}`,{fixture:'<div class="box"><h2>70% width</h2><p>画面幅を変えて確認してください。</p></div>',terms:[["px","画面上の基準となる固定的な単位。"],["rem","ルート要素の文字サイズを基準にする単位。"],["vw / vh","画面幅・画面高さを基準にする単位。"]]}),
  lesson("css-box-model","css","入門","レイアウト","ボックスモデル","content、padding、border、marginが要素の大きさと間隔を作ります。",
`.box {
  width: 240px;
  padding: 24px;
  border: 8px solid #4057f2;
  margin: 30px;
  background: #94eee7;
}`,{fixture:'<div class="box">内容 content<br>内側余白 padding<br>枠線 border<br>外側余白 margin</div>',terms:[["padding","枠線の内側の余白。"],["border","要素を囲む枠線。"],["margin","枠線の外側の余白。"]]}),
  lesson("css-sizing","css","基礎","レイアウト","box-sizingと幅","border-boxを使うとpaddingとborderをwidthの内側に含められます。",
`* { box-sizing: border-box; }
.box {
  width: 280px;
  padding: 40px;
  border: 10px solid #ff7358;
  background: #f4d85e;
}`,{fixture:'<div class="box">全体の幅は280pxのままです。</div>',terms:[["content-box","widthを内容部分だけに適用する初期値。"],["border-box","widthにpaddingとborderを含める指定。"]]}),
  lesson("css-display","css","基礎","レイアウト","displayの種類","block、inline、inline-block、noneによる配置と表示の違いを学びます。",
`.block { display: block; background: #94eee7; }
.inline { display: inline; background: #f4d85e; }
.inline-block {
  display: inline-block;
  width: 140px;
  padding: 12px;
  background: #ffb39f;
}`,{fixture:'<div class="block">block</div><span class="inline">inline</span> <span class="inline">inline</span><br><div class="inline-block">inline-block</div><div class="inline-block">inline-block</div>',terms:[["block","前後で改行され、横幅いっぱいに広がる表示。"],["inline","文章の流れの中に並ぶ表示。"],["none","要素をレイアウトから消す指定。"]]}),
  lesson("css-position","css","基礎","レイアウト","positionと配置","relative、absolute、fixed、stickyで通常の流れとは異なる配置を行います。",
`.stage {
  position: relative;
  height: 220px;
  background: #e9e7df;
}
.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 10px;
  background: #ff7358;
}`,{fixture:'<div class="stage"><h2>基準となる要素</h2><span class="badge">右上に配置</span></div>',terms:[["relative","自身を基準位置として設定。"],["absolute","基準要素に対して座標配置。"],["z-index","重なり順を指定。"]]}),
  lesson("css-flex","css","基礎","Flexbox","Flexboxの基本","一次元方向の並び、整列、間隔を柔軟に制御します。",
`.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.item { flex: 1; text-align: center; }`,{fixture:'<div class="row"><div class="item">A</div><div class="item">B<br>tall</div><div class="item">C</div></div>',terms:[["主軸","flex-directionに沿った並び方向。"],["justify-content","主軸方向の配置。"],["align-items","交差軸方向の配置。"]]}),
  lesson("css-flex-wrap","css","基礎","Flexbox","折り返しとflex値","flex-wrapとflexプロパティで、画面幅に応じて項目を折り返します。",
`.row { display: flex; flex-wrap: wrap; gap: 12px; }
.item {
  flex: 1 1 140px;
  padding: 24px;
  text-align: center;
}`,{fixture:'<div class="row"><div class="item">HTML</div><div class="item">CSS</div><div class="item">JavaScript</div><div class="item">Web API</div></div>',terms:[["flex-wrap","項目の折り返しを許可。"],["flex-basis","項目の基準サイズ。"],["flex-grow","余白を広げる割合。"]]}),
  lesson("css-grid","css","基礎","Grid","CSS Gridの基本","行と列を持つ二次元レイアウトを作ります。",
`.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.item:first-child { grid-column: span 2; }`,{fixture:'<div class="grid"><div class="item">2列分</div><div class="item">B</div><div class="item">C</div><div class="item">D</div><div class="item">E</div></div>',terms:[["grid-template-columns","列の数と幅を定義。"],["fr","利用可能な余白の割合。"],["grid-column","項目が占める列を指定。"]]}),
  lesson("css-grid-auto","css","応用","Grid","自動配置とminmax","auto-fitとminmaxで、画面幅に応じて列数が変わるカード一覧を作ります。",
`.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}
.item { min-height: 100px; }`,{fixture:'<div class="grid"><div class="item">01</div><div class="item">02</div><div class="item">03</div><div class="item">04</div></div>',terms:[["minmax()","最小値と最大値をまとめて指定。"],["auto-fit","入るだけ列を作り、空列を縮める。"],["repeat()","同じ列定義を繰り返す関数。"]]}),
  lesson("css-typography","css","基礎","文字","文字と読みやすさ","font-family、font-size、line-height、letter-spacingで文章の印象と可読性を整えます。",
`.text {
  max-width: 34em;
  font-family: Georgia, serif;
  font-size: 18px;
  line-height: 1.9;
  letter-spacing: 0.02em;
}`,{fixture:'<article class="text"><h2>読みやすい文章</h2><p>文字の大きさだけではなく、一行の長さや行間も読みやすさへ大きく影響します。</p></article>',terms:[["font-family","使用する書体と代替候補。"],["line-height","行の高さ。"],["letter-spacing","文字同士の間隔。"]]}),
  lesson("css-pseudo","css","基礎","セレクタ","疑似クラスと疑似要素","hoverやfocusで状態を、beforeやafterで仮想的な要素を選びます。",
`.link { color: #4057f2; }
.link:hover { color: #ff7358; }
.link:focus-visible { outline: 3px solid #94eee7; }
.link::after { content: " ↗"; }`,{fixture:'<p><a class="link" href="#">カーソルを合わせる</a></p><p>Tabキーによるフォーカスも試してください。</p>',terms:[["疑似クラス",":hoverのように状態を選ぶ記法。"],["疑似要素","::beforeのように要素の一部分を選ぶ記法。"],["focus-visible","キーボード操作などで必要なフォーカス表示。"]]}),
  lesson("css-responsive","css","応用","レスポンシブ","メディアクエリ","画面幅などの条件に応じてCSSを切り替えます。",
`.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 500px) {
  .layout { grid-template-columns: 1fr; }
}`,{fixture:'<div class="layout"><div class="item">左カラム</div><div class="item">右カラム</div></div>',terms:[["@media","表示環境の条件によってCSSを適用。"],["ブレークポイント","レイアウトを切り替える境界。"],["レスポンシブ","異なる画面サイズへ適応する設計。"]],tryText:"右上のMOBILEボタンでもレイアウト変化を確認できます。"}),
  lesson("css-functions","css","応用","サイズ","clamp・min・max","CSS関数で、最小値と最大値を持つ流動的なサイズを作ります。",
`h1 {
  font-size: clamp(32px, 8vw, 80px);
}
.box {
  width: min(100%, 600px);
  padding: max(20px, 4vw);
  background: #94eee7;
}`,{fixture:'<div class="box"><h1>Fluid Type</h1><p>画面幅に合わせて滑らかに変化します。</p></div>',terms:[["clamp()","最小・推奨・最大の3値を指定。"],["min()","候補の中から小さい値を採用。"],["max()","候補の中から大きい値を採用。"]]}),
  lesson("css-variables","css","応用","設計","カスタムプロパティ","色や余白を変数として定義し、再利用と一括変更をしやすくします。",
`:root {
  --brand: #4057f2;
  --space: 20px;
  --radius: 12px;
}
.card {
  padding: var(--space);
  border: 3px solid var(--brand);
  border-radius: var(--radius);
}`,{fixture:'<div class="card"><h2>CSS Variables</h2><p>上の3つの値を変更してください。</p></div>',terms:[["カスタムプロパティ","--名前で定義するCSS変数。"],["var()","カスタムプロパティの値を参照する関数。"],[":root","文書全体で使う変数の定義によく使う場所。"]]}),
  lesson("css-transform","css","応用","動き","transformとtransition","要素を移動・拡大・回転し、状態変化を滑らかにつなぎます。",
`.card {
  transition: transform .3s, box-shadow .3s;
}
.card:hover {
  transform: translateY(-10px) rotate(2deg);
  box-shadow: 0 18px 35px #17202a33;
}`,{fixture:'<div class="card"><h2>Hover me</h2><p>カーソルを合わせてください。</p></div>',terms:[["transform","移動・回転・拡大縮小などの変形。"],["transition","状態間の変化を補間。"],["translate","要素を現在位置から移動。"]]}),
  lesson("css-animation","css","応用","動き","キーフレームアニメーション","@keyframesで時間経過に沿った複数段階の変化を定義します。",
`.dot {
  width: 70px; height: 70px;
  border-radius: 50%;
  background: #4057f2;
  animation: bounce 1.5s ease-in-out infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(130px) scale(.8); }
}`,{fixture:'<div class="dot"></div>',terms:[["@keyframes","アニメーションの各時点を定義。"],["animation","名前・時間・速度・回数などをまとめて指定。"],["infinite","無限に繰り返す値。"]]}),
  lesson("css-modern","css","応用","現代CSS","aspect-ratio・object-fit・container","現代的なレイアウトで便利な比率、画像の収まり方、コンテナクエリの入口を学びます。",
`.media {
  width: min(100%, 500px);
  aspect-ratio: 16 / 9;
}
.media img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 16px;
}`,{fixture:'<div class="media"><img src="https://picsum.photos/600/500" alt=""></div>',terms:[["aspect-ratio","要素の縦横比を指定。"],["object-fit","画像や動画を枠へどう収めるか指定。"],["コンテナクエリ","親要素の幅を基準にスタイルを切り替える機能。"]],point:"Flexbox、Grid、clamp、カスタムプロパティは現在のWeb制作で特に使用頻度が高い機能です。"})
];

const jsLessons = [
  lesson("js-console","js","入門","基本","JavaScriptを実行する","命令を上から順に実行し、console.logで値を確認します。",
`const message = "Hello, JavaScript!";
console.log(message);
document.querySelector("#output").textContent = message;`,{fixture:'<h2>実行結果</h2><div id="output" class="output">ここが変わります</div>',terms:[["文","実行する命令の単位。"],["console.log","開発者ツールへ値を出力する命令。"],["textContent","要素内の文字を読み書きするプロパティ。"]]}),
  lesson("js-variables","js","入門","基本","変数 const と let","値へ名前を付け、再利用します。constは再代入不可、letは再代入可能です。",
`const course = "JavaScript";
let minutes = 20;
minutes = minutes + 10;

document.querySelector("#output").textContent =
  course + "を" + minutes + "分学びました";`,{fixture:'<div id="output" class="output"></div>',terms:[["変数","値を保存し、名前で参照する仕組み。"],["const","再代入しない変数の宣言。"],["let","後から再代入する変数の宣言。"]]}),
  lesson("js-types","js","入門","基本","データ型","文字列、数値、真偽値、null、undefinedなど値の種類を学びます。",
`const name = "Aki";
const score = 92;
const passed = true;
const empty = null;

document.querySelector("#output").textContent =
  typeof name + " / " + typeof score + " / " + typeof passed;`,{fixture:'<h2>typeofの結果</h2><div id="output" class="output"></div>',terms:[["string","文字列型。"],["number","数値型。"],["boolean","trueかfalseの真偽値型。"],["typeof","値の型を調べる演算子。"]]}),
  lesson("js-operators","js","入門","基本","演算子","計算、比較、論理演算を行う記号を学びます。",
`const price = 1200;
const count = 3;
const total = price * count;
const freeShipping = total >= 3000;

document.querySelector("#output").textContent =
  "合計: " + total + "円 / 送料無料: " + freeShipping;`,{fixture:'<div id="output" class="output"></div>',terms:[["算術演算子","+ - * / など計算を行う記号。"],["比較演算子","===や>=など値を比較する記号。"],["論理演算子","&&、||、!で条件を組み合わせる記号。"]]}),
  lesson("js-template","js","入門","基本","テンプレートリテラル","バッククォートと${}で文字列へ値を読みやすく埋め込みます。",
`const name = "Mio";
const lessonCount = 12;
const message = \`\${name}さんは
\${lessonCount}講座を完了しました。\`;

document.querySelector("#output").textContent = message;`,{fixture:'<div id="output" class="output"></div>',terms:[["テンプレートリテラル","バッククォートで囲む文字列。"],["${式}","文字列内へ値や計算結果を埋め込む記法。"]]}),
  lesson("js-condition","js","入門","制御構文","ifによる条件分岐","条件がtrueかfalseかによって実行する処理を切り替えます。",
`const score = 78;
let result;

if (score >= 80) {
  result = "合格です";
} else {
  result = "あと少しです";
}

document.querySelector("#output").textContent = result;`,{fixture:'<div id="output" class="output"></div>',terms:[["if","条件が真のとき処理を実行。"],["else","条件が偽のとき処理を実行。"],["条件式","trueまたはfalseとして評価される式。"]]}),
  lesson("js-loop","js","入門","制御構文","forループ","同じ種類の処理を指定回数繰り返します。",
`const list = document.querySelector("#output");

for (let number = 1; number <= 5; number++) {
  const item = document.createElement("li");
  item.textContent = "Lesson " + number;
  list.append(item);
}`,{fixture:'<h2>講座一覧</h2><ol id="output"></ol>',terms:[["ループ","処理を繰り返す構造。"],["初期化","ループ開始時の値を決める部分。"],["インクリメント","number++のように値を1増やす操作。"]]}),
  lesson("js-function","js","基礎","関数","関数の定義と呼び出し","処理へ名前を付け、引数を受け取り、戻り値を返します。",
`function calculateTotal(price, count) {
  const total = price * count;
  return total;
}

const answer = calculateTotal(850, 3);
document.querySelector("#output").textContent =
  "合計 " + answer + "円";`,{fixture:'<div id="output" class="output"></div>',terms:[["関数","再利用できる処理のまとまり。"],["引数","関数へ渡す値。"],["戻り値","returnで関数の外へ返す値。"]]}),
  lesson("js-arrow","js","基礎","関数","アロー関数","=>を使った短い関数記法とコールバックを学びます。",
`const prices = [500, 800, 1200];
const taxed = prices.map((price) => price * 1.1);

document.querySelector("#output").textContent =
  taxed.join("円 / ") + "円";`,{fixture:'<h2>税込価格</h2><div id="output" class="output"></div>',terms:[["アロー関数","=>を使う関数式。"],["コールバック","別の関数へ渡す関数。"],["暗黙のreturn","一式だけのアロー関数でreturnを省略する記法。"]]}),
  lesson("js-array","js","基礎","データ","配列","複数の値を順序付きでまとめ、番号やメソッドで操作します。",
`const languages = ["HTML", "CSS", "JavaScript"];
languages.push("Web API");

document.querySelector("#output").innerHTML =
  languages.map((language, index) =>
    \`<li>\${index + 1}. \${language}</li>\`
  ).join("");`,{fixture:'<h2>学習する技術</h2><ul id="output"></ul>',terms:[["配列","複数の値を順番に格納するデータ。"],["インデックス","0から始まる要素の位置番号。"],["push()","配列末尾へ値を追加するメソッド。"]]}),
  lesson("js-array-methods","js","基礎","データ","map・filter・find","配列を変換、絞り込み、検索する代表的なメソッドです。",
`const scores = [45, 82, 91, 68, 76];
const passed = scores.filter((score) => score >= 70);
const labels = passed.map((score) => "合格: " + score);
const excellent = scores.find((score) => score >= 90);

document.querySelector("#output").textContent =
  labels.join(" / ") + "\\n最初の90点以上: " + excellent;`,{fixture:'<div id="output" class="output"></div>',terms:[["map()","各要素を変換した新しい配列を作る。"],["filter()","条件を満たす要素だけの配列を作る。"],["find()","条件を満たす最初の要素を返す。"]]}),
  lesson("js-object","js","基礎","データ","オブジェクト","関連する値をキーと値の組でまとめます。",
`const student = {
  name: "Rin",
  level: 3,
  skills: ["HTML", "CSS"]
};

student.level += 1;
document.querySelector("#output").textContent =
  \`\${student.name} / Level \${student.level}
Skills: \${student.skills.join(", ")}\`;`,{fixture:'<div id="output" class="output"></div>',terms:[["オブジェクト","キーと値で構成されるデータ。"],["プロパティ","オブジェクトが持つ各データ。"],["ドット記法","student.nameのようにプロパティへアクセスする記法。"]]}),
  lesson("js-destructuring","js","基礎","データ","分割代入とスプレッド構文","配列やオブジェクトから値を取り出し、コピーや結合を簡潔に書きます。",
`const user = { name: "Sora", role: "student" };
const { name, role } = user;
const updated = { ...user, completed: 14 };

document.querySelector("#output").textContent =
  \`\${name} / \${role} / 完了: \${updated.completed}\`;`,{fixture:'<div id="output" class="output"></div>',terms:[["分割代入","配列やオブジェクトから値を取り出す構文。"],["スプレッド構文","...で要素やプロパティを展開。"],["シャローコピー","一階層目を複製したデータ。"]]}),
  lesson("js-dom-select","js","基礎","DOM","DOM要素を取得する","querySelectorとquerySelectorAllでHTML要素をJavaScriptから選択します。",
`const title = document.querySelector(".title");
const items = document.querySelectorAll(".item");

title.textContent = "3つの要素を取得";
items.forEach((item, index) => {
  item.textContent = "Item " + (index + 1);
});`,{fixture:'<h2 class="title">変更前</h2><div class="row"><div class="item">?</div><div class="item">?</div><div class="item">?</div></div>',terms:[["DOM","HTML文書をJavaScriptで操作するための表現。"],["querySelector()","最初に一致する要素を取得。"],["NodeList","querySelectorAllが返す要素の集まり。"]]}),
  lesson("js-dom-change","js","基礎","DOM","内容・属性・classの変更","textContent、setAttribute、classListで表示や状態を変更します。",
`const card = document.querySelector(".card");
const title = card.querySelector("h2");

title.textContent = "JavaScriptで変更";
card.setAttribute("data-status", "active");
card.classList.add("accent-card");`,{fixture:'<style>.accent-card{border:4px solid #ff7358;background:#fff4ef}</style><div class="card"><h2>変更前</h2><p>classが追加されます。</p></div>',terms:[["setAttribute()","属性を設定するメソッド。"],["classList","classを操作するためのオブジェクト。"],["add()","classなどへ値を追加するメソッド。"]]}),
  lesson("js-events","js","基礎","イベント","クリックイベント","addEventListenerでユーザー操作が起きたときの処理を登録します。",
`const button = document.querySelector("#button");
const output = document.querySelector("#output");
let count = 0;

button.addEventListener("click", () => {
  count += 1;
  output.textContent = count + "回クリックしました";
});`,{fixture:'<button id="button">クリック</button><div id="output" class="output">0回クリックしました</div>',terms:[["イベント","クリックや入力などブラウザ内の出来事。"],["addEventListener()","イベント時に実行する処理を登録。"],["イベントリスナー","イベントを待ち受ける関数。"]]}),
  lesson("js-form","js","応用","イベント","フォーム入力を扱う","submitイベント、preventDefault、valueを使って入力値を処理します。",
`const form = document.querySelector("#form");
const output = document.querySelector("#output");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value;
  output.textContent = name + "さん、こんにちは！";
});`,{fixture:'<form id="form"><label>名前 <input id="name" value="Aki"></label> <button>送信</button></form><div id="output" class="output"></div>',terms:[["submit","フォーム送信時に発生するイベント。"],["preventDefault()","ブラウザの既定動作を止めるメソッド。"],["value","入力欄の現在値。"]]}),
  lesson("js-storage","js","応用","Web API","localStorage","文字列データをブラウザへ保存し、ページをまたいで利用します。",
`const input = document.querySelector("#memo");
const button = document.querySelector("#save");
const output = document.querySelector("#output");

input.value = localStorage.getItem("memo") || "";
button.addEventListener("click", () => {
  localStorage.setItem("memo", input.value);
  output.textContent = "ブラウザに保存しました";
});`,{fixture:'<input id="memo" placeholder="メモ"><button id="save">保存</button><div id="output" class="output"></div>',terms:[["localStorage","ブラウザへ文字列を永続保存するAPI。"],["setItem()","キーと値を保存。"],["getItem()","キーに対応する値を取得。"]],caution:"機密情報や大容量データの保存には向きません。保存値は文字列です。"}),
  lesson("js-async","js","応用","非同期","Promiseとasync/await","時間のかかる処理を待ちながら、読みやすい順序で記述します。",
`const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function start() {
  const output = document.querySelector("#output");
  output.textContent = "読み込み中...";
  await wait(1000);
  output.textContent = "完了しました！";
}

start();`,{fixture:'<div id="output" class="output"></div>',terms:[["Promise","将来完了する処理を表すオブジェクト。"],["async","関数を非同期関数として定義。"],["await","Promiseの完了を待って次へ進む演算子。"]]}),
  lesson("js-fetch","js","応用","非同期","fetchとAPI","HTTPリクエストで外部データを取得する基本形を学びます。",
`async function loadData() {
  const output = document.querySelector("#output");
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    if (!response.ok) throw new Error("取得失敗");
    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = error.message;
  }
}
loadData();`,{fixture:'<h2>API Response</h2><div id="output" class="output">Loading...</div>',terms:[["fetch()","HTTP通信を行いPromiseを返す関数。"],["response.json()","JSON形式の本文をJavaScript値へ変換。"],["try / catch","例外が起きうる処理とエラー処理を分ける構文。"]],caution:"実際のAPIではCORS、認証、通信失敗、読み込み中の表示も考慮します。"}),
  lesson("js-modules","js","応用","設計","モジュールとコード設計","exportとimportで機能をファイルへ分割し、責務を整理します。",
`// math.js
export function add(a, b) {
  return a + b;
}

// app.jsでは次のように読み込みます
// import { add } from "./math.js";
document.querySelector("#output").textContent =
  "2 + 3 = " + add(2, 3);`,{fixture:'<div id="output" class="output"></div>',terms:[["モジュール","独立した機能単位のJavaScriptファイル。"],["export","他ファイルへ公開する値を指定。"],["import","別モジュールが公開した値を読み込む構文。"]],point:"大きなアプリでは、DOM操作、データ処理、通信など責務ごとに分割すると保守しやすくなります。"})
];

window.lessonData = [...htmlLessons, ...cssLessons, ...jsLessons];
window.sharedPreviewStyle = sharedPreviewStyle;
