# 改善バックログ

このリポジトリの改善候補と作業手順。誰(人・AI)が拾っても着手できる粒度で書く。
着手・完了・却下したら、この文書から該当項目を削除(または実施記録に移動)する。

工数目安: **S** = 数時間、**M** = 1〜2 日、**L** = 週単位。

---

## 基盤・依存関係

### GitHub Actions のコミットハッシュ固定 + Dependabot 導入 — S

actions がタグ参照(`@v3`など)のままで、タグ付け替えによるサプライチェーン攻撃に弱い。probability-distribution-visualization リポジトリで採用済みのポリシーをこちらにも展開する。

1. gh-pages.yml / test.yml の各 action を`uses: owner/repo@<コミットSHA> # vX.Y.Z`形式に変更(SHA は`gh api repos/<owner>/<repo>/git/ref/tags/<tag>`などで取得)
2. あわせて古いメジャーバージョン(checkout@v3、setup-node@v3、configure-pages@v2)を最新へ
3. `.github/dependabot.yml`を追加し、`npm`と`github-actions`の 2 エコシステムを週次で監視(Dependabot は SHA 固定を理解してハッシュ+コメントを一緒に更新してくれる)

### 依存バージョンの完全固定の検討 — S

dependencies が`^`レンジ指定のため、`yarn install`のタイミングで意図しないバージョンが入り得る(yarn.lock がある限り通常は固定されるが、lockfile 再生成時に一斉に動く)。他リポジトリの「完全固定+更新は Dependabot 経由」ポリシーに合わせるか判断する。

1. 方針を決める(Dependabot 導入とセットで固定運用にするのが整合的)
2. 固定する場合: package.json の`^`を外して現在の lockfile のバージョンに揃える

## CI・品質

コンポーネント・ページ・操作のテストは `yarn test` と `yarn test:e2e` で実行する。新しい機能の追加時は、その仕様に対応する検証も追加する。

## SEO・コンテンツ

### sitemap.xml の生成 — S

sitemap が存在せず、検索エンジンへのページ一覧の提示が robots.txt 頼み。

1. Astro公式のsitemap連携を検討する
2. astro.config.mjs に追加(base `/dev-log` が反映されることを確認)
3. ビルドして`public/sitemap-*.xml`の URL が`https://shin4488.github.io/dev-log/...`形式か確認
4. Google Search Console にサイト登録し、sitemap を送信(所有権確認は GA 連携か HTML タグ)

### テスト記事の整理 — S(判断のみ)

`content/blog/2022-09-02-test/`と`2022-09-02-test2/`はタイトルが「2 自己紹介ページを作成しました 2」等の動作確認用コピーで、未コミットのままローカルに残っている。公開する記事ではないので削除するか、下書き運用(frontmatter に`draft: true`を設けてビルド除外)を作るかを決める。

### ブログ記事の執筆再開 — 継続

公開済み記事が実質 1 本(2022-08-24 の自己紹介ページ告知)で、「Dev Log」というサイト名に対してログがない状態。直近の開発(確率分布ビジュアライザー、Algorithm Visualizer など)は記事ネタとして十分。

1. 1 作品 1 記事で「何を作ったか・技術選定・工夫した点」を書く(selfDevelopment.ts の technicalAppeal が下書きに使える)
2. Zenn/Qiita に書く場合もこちらに元記事か相互リンクを置き、サイトへの導線を作る

## その他

### LICENSE ファイルの見直し — S(判断のみ)

`LICENSE`(0BSD)と package.json の`"license": "0BSD"`は gatsby-starter-blog の初期値のまま。ブログ記事や自己紹介文まで 0BSD(事実上の放棄)で公開する意図があるかを確認し、意図と違えばコード部分とコンテンツ部分のライセンスを分けるなど検討する。

---

## 実施記録

### 2026-07-07: スターター残骸の一掃(このバックログ作成と同時に実施)

- PWA マニフェストの`name: Gatsby Starter Blog` / `short_name: GatsbyJS`を`Dev Log`に修正(ホーム画面追加時などにユーザーへ露出していた)
- RSS フィードのタイトル`Gatsby Starter Blog RSS Feed`を`Dev Log RSS Feed`に修正
- package.json の`name` / `bugs` / `homepage` / `repository`をスターターの URL から本リポジトリのものに修正
- 動かない`deploy`スクリプトを削除(`gh-pages`パッケージが未インストールで実行不能。デプロイは gh-pages.yml が担う)
- `lint`スクリプトを追加(ESLint は設定済み・違反ゼロだった)
- README.md をスターターの説明文から本リポジトリの説明(コマンド・構成・記事の書き方・デプロイ)に全面書き換え
- src/data/selfDevelopment.ts のタイポ修正: Percel → Parcel(algorithm-visualizer リポジトリが Parcel 使用であることを確認済み)
