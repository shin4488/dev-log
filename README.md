# Dev Log

shin4488 のブログ + 自己紹介・ポートフォリオサイト。
Astro + React + Markdown で構築し、GitHub Pages で公開している。

- 公開 URL: https://shin4488.github.io/dev-log/
- ブログ記事は `content/blog/`、自己紹介データは `src/data/` で管理
- Node 24、Yarn 4（`packageManager` に固定）を使用

## 開発コマンド

```bash
corepack enable
yarn install --immutable
yarn dev                 # http://localhost:8000/dev-log/
yarn build               # 静的HTML・アセットを dist/ に出力
yarn serve               # http://localhost:9000/dev-log/
yarn test                # VitestによるReactコンポーネントテスト
yarn lint
yarn typecheck           # AstroとTypeScriptの検証
yarn audit:dependencies  # 全重大度の脆弱性を検査。監査失敗もエラー
yarn playwright install chromium
yarn test:content        # 隔離した記事例で画像・添付・コード・RSSの配信を検証
yarn test:dev            # PC/スマホで開発ページ・コンソール・ホットリロードを検証
yarn test:e2e            # G-TESTを設定したbuild後、PC/スマホでページ・操作・RSS・アイコンを検証
```

ブラウザテスト前は `GOOGLE_ANALYTICS_MEASUREMENT_ID=G-TEST yarn build` を実行する。テストが専用サーバを起動・終了するため、先にポート 9000 の `yarn serve` を停止する。`yarn test:dev` の前にはポート 8000 の開発サーバも停止する。

変更したファイルのみ Prettier で整形する。`yarn format` は広い範囲を変更するため注意。

Google Analytics の `GOOGLE_ANALYTICS_MEASUREMENT_ID` は、本番ビルドでは `.env.production`（gitignore 済み）または CI の既存 GitHub Secret から渡す。未設定時・開発サーバでは計測しない。テストでは実際の計測先へ送信しない。

計測の目的・イベント・GA設定は [docs/analytics.md](docs/analytics.md) を参照。

## ディレクトリ構成

```text
content/blog/      記事。1記事 = 1ディレクトリ(index.md + 画像)
src/pages/         Astroの静的ルート、RSS、マニフェスト、アイコン
src/views/         固定ページのReact画面
src/templates/     記事詳細のReact画面
src/layouts/       HTML・メタデータ・共通CSS
src/components/    UIコンポーネントと既存テスト
src/lib/           記事の読込み、型、サイト設定
src/data/          個人開発の作品一覧・スキル・SNS
scripts/           Markdown互換処理・検証
e2e/               ブラウザ回帰テスト
static/            favicon.ico・robots.txt等の配信ファイル
```

## 記事の追加方法

`content/blog/<日付-スラッグ>/index.md` を作成する。

```markdown
---
title: 記事タイトル
createdDate: '2022-08-24T20:00:00.000Z'
description: 一覧やmeta descriptionに使われる要約
tags: [個人開発, gatsby]
---

本文(Markdown)
```

`updatedDate` は任意。記事は作成日時で並べ、記事詳細には前後の記事へのリンクを生成する。タグ別一覧・タグ件数・RSS も記事から生成する。本文は信頼するリポジトリの内容をビルド時に処理する。

## 配信と互換性

- `astro.config.mjs` の `base: '/dev-log'` と末尾スラッシュ付きの URL を維持する。リンク・画像でサブパスを落とさない。
- `/`・`/about/`・`/blog/`・`/tags/`・`/tagList/`・タグ別ページ・記事・`/404/`・`/404.html` を配信する。
- React 画面と CSS の見た目、スクロール操作、既存リンク先、RSS の既存記事 GUID を維持する。既存の表示上の問題をこの移行と混ぜて修正しない。
- main への push で `.github/workflows/gh-pages.yml` が `dist/` を GitHub Pages に公開する。
- PR ではテスト・lint・型チェック・本番ビルド・記事配信テスト・依存監査・ブラウザ回帰テストを実行する。Dependabot は npm と GitHub Actions を週次監視する。
- Actions は検証済みのフル SHA に固定する。ビルドは読み取り権限で実行し、Pages・OIDC の書き込み権限はデプロイのみに付与する。
- Gatsby 依存・GraphQL 型生成・`resolutions` は使用しない。上位ライブラリが要求する通常の依存範囲で修正版を取り込む。警告の無視やアラートの dismiss で 0 件にしない。

改善候補は [docs/improvement-backlog.md](docs/improvement-backlog.md) を参照。

F1C カードのアイコンは `src/images/f1c-icon.png` に同梱する。元の `https://f1c.biz/favicon.ico` と同一の画像で、外部サイトの一時障害による画像欠けを防ぐ。

記事内のローカル画像は Sharp で最大表示幅 630px の候補画像とプレースホルダーを生成し、原寸画像へのリンクを付ける。既にリンク内にある画像では二重リンクにしない。添付ファイルは内容を変えずに配信し、記事が参照しないファイルは公開しない。旧 CSS が対象にする画像・埋め込み・Prism のクラス名は表示互換性のため維持する。これらは Gatsby パッケージへの依存ではない。

RSS は XMLBuilder でエスケープと GUID 属性を生成する。記事本文の共通 HTML から、ページ用の通常遷移属性を別途付けるため、RSS から属性を文字列置換で除去しない。

`noExternal` は現在の UI パッケージが持つ ESM のディレクトリ参照を Vite に解決させる設定。依存バージョンは変更しない。`/404/` と既存のプロフィール画像 URL は、公開済み URL を維持する恒久的な互換ルートとして残す。

Bootstrap は公式のコンパイル済み CSS を読み込み、サイト固有の色と表の背景を `src/theme.css` で定義する。Sass コンパイルには依存しない。

Yarn は `node_modules` 方式を使う。インストールスクリプトは原則無効で、ビルドに必要な esbuild だけを許可する。`.yarnrc.yml` の `packageExtensions` は Astro の公開パッケージに不足する TypeScript・WASM ランタイムの依存宣言を補う。上流修正時は Yarn の冗長宣言チェックに従って削除する。監査では開発・間接依存と非推奨パッケージも対象にする。
