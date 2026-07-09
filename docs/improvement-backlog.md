# 改善バックログ

このリポジトリの改善候補と作業手順。誰(人・AI)が拾っても着手できる粒度で書く。
着手・完了・却下したら、この文書から該当項目を削除(または実施記録に移動)する。

工数目安: **S** = 数時間、**M** = 1〜2 日、**L** = 週単位。

---

## 基盤・依存関係

### CI の Node 16 を Node 20 へ更新 — S

ワークフロー 2 本(gh-pages.yml / test.yml)が`node-version: 16`のまま。Node 16 は 2023 年 9 月に EOL を迎えており、セキュリティ修正が来ない。ローカル開発は Node 20.18 で動いている実績があるため(ビルド・テストとも成功確認済み)、CI だけが古い状態。

1. `.github/workflows/gh-pages.yml`と`test.yml`の`node-version: 16`を`20`に変更
2. PR を作って test.yml の成功を確認 → マージして gh-pages.yml のビルド・デプロイ成功を確認
3. サイトの主要ページ(トップ・about・記事)が表示されることを確認

### Gatsby 4 → 5 へのアップグレード — L

Gatsby 4 系(2022 年)のまま。5 系は React 18 前提(導入済み)・Node 18+前提なので、上の Node 更新後に着手できる。古いままだとプラグインのセキュリティ修正や性能改善(部分ビルド高速化)を取り込めない。

1. 公式の v4→v5 マイグレーションガイドを読む
2. `gatsby`本体と`gatsby-plugin-*` / `gatsby-remark-*` / `gatsby-transformer-*`を一斉にメジャーバージョンアップ
3. 破壊的変更への対応(GraphQL スキーマの`sort`引数の形式変更が本リポジトリのクエリに影響する可能性が高い: gatsby-config.js の feed 用クエリ、gatsby-node.js、各ページのクエリ)
4. `yarn clean && yarn build`と`yarn test`が通ることを確認し、ローカルで`yarn serve`して全ページを目視
5. TypeScript 4.7 / ESLint 8 / Prettier 2 も同時期の古さなので、余力があれば別 PR で順次更新

### GraphQL コード生成プラグインの重複解消 — M

`gatsby-plugin-graphql-codegen`と`gatsby-plugin-typegen`という同目的のプラグインが両方入っている。生成物も`gatsby-graphql.ts`(コミット管理)と typegen 側の出力が併存し、開発のたびに`gatsby-graphql.ts`の diff が出て作業ノイズになっている(現に未コミットの変更が常に滞留しがち)。

1. `src/`でどちらの生成型が実際に import されているかを調査(`grep -rn "gatsby-graphql\|gatsby-types" src/`)
2. 使われている方だけ残し、もう一方をアンインストール
3. 生成物の扱いを決める: gitignore してビルド時に生成する(推奨。生成物はコミットしない)か、コミット管理を続けるか
4. 決めた方針を README に 1 行で記録

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

### lint を CI に組み込む — S

ESLint は設定済み・違反ゼロで、`yarn lint`スクリプトも追加済み(実施記録参照)だが、CI では実行されていないため退行を検知できない。

1. test.yml のテストステップの前に`- name: Run lint`→`run: yarn lint`を追加
2. PR を作って動作確認

### ビルドを PR の CI に組み込む — S

test.yml は Jest のみで、`gatsby build`が通るかは main へのマージ後(デプロイ時)まで分からない。GraphQL クエリの誤りなどはビルドで初めて検出されるため、PR 段階で検知したい。

1. test.yml に`yarn build`ステップを追加(`GOOGLE_ANALYTICS_MEASUREMENT_ID`は PR ではダミー値でよい)
2. ビルド時間が気になる場合は Gatsby キャッシュの actions/cache 利用を検討

### ページ・テンプレートのテスト追加 — M

コンポーネント 4 つ(HeroSection / SkillSection / ProjectCard / FixedNavigation)にはテストがあるが、`src/pages/`と`src/templates/blog-post.tsx`にはない。GraphQL クエリ結果を props で受ける部分はモックデータで描画テストが書ける。

1. 既存の`*.test.tsx`のパターン(Testing Library)を踏襲し、まず about.tsx から
2. GraphQL 依存はクエリ結果の型(gatsby-graphql.ts)に合わせたフィクスチャを`__mocks__/`に用意

## SEO・コンテンツ

### sitemap.xml の生成 — S

sitemap が存在せず、検索エンジンへのページ一覧の提示が robots.txt 頼み。

1. `gatsby-plugin-sitemap`を追加(Gatsby 4 系なら 6.x 系を選ぶ)
2. gatsby-config.js の plugins に追加(pathPrefix `/dev-log` が反映されることを確認)
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
