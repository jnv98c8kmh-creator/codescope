# 公開前の設定

1. `publish-config.json` の `siteUrl` に公開URLを設定する。
2. `node generate-seo-pages.mjs` を実行して、個別ページ、`sitemap.xml`、`robots.txt`を再生成する。
3. `about.html` のサイト説明が実際の内容と一致していることを確認する。
4. AdSense審査へ申請する。承認前は広告コードを設置しない。
5. 承認後、`ads.txt.example` のIDを実際のパブリッシャーIDへ変更し、`ads.txt`として公開する。
6. AdSenseの広告コードは `.ad-slot` と `.landing-ad` のコメント位置だけに設置する。
7. 広告設置後に `data-ad-status="inactive"` を `data-ad-status="active"` へ変更する。
8. AdSenseの「プライバシーとメッセージ」から、必要な地域向けの同意管理メッセージを設定する。

## 配置ルール

- コードエディター、前へ・次へボタン、完了ボタンの近くへ広告を置かない。
- 広告ラベルは「広告」または「Advertisements」とする。
- 広告クリックを促す文章や矢印を置かない。
- ポップアップ、追従広告、自動更新広告を使わない。
- 自分の広告をクリックしない。
