# Dev Log

shin4488 のブログ + 自己紹介・ポートフォリオサイト。
Astro + React + Markdown で構築し、GitHub Pages で公開している。

- 公開 URL: https://shin4488.github.io/dev-log/
- ブログ記事は `content/blog/`、自己紹介データは `src/data/` で管理
- Node 24、Yarn 1.22.22 を使用

## 開発コマンド

```bash
yarn install --frozen-lockfile
yarn dev                 # http://localhost:8000/dev-log/
yarn build               # 静的HTML・アセットを dist/ に出力
yarn serve               # http://localhost:9000/dev-log/
yarn test                # Reactコンポーネントテスト
yarn lint
yarn typecheck           # AstroとTypeScriptの検証
yarn audit:dependencies  # 全重大度の脆弱性を検査。監査失敗もエラー
yarn playwright install chromium
yarn test:e2e            # build後、PC/スマホでページ・操作・RSS・アイコンを検証
```

変更したファイルのみ Prettier で整形する。`yarn format` は広い範囲を変更するため注意。

Google Analytics の `GOOGLE_ANALYTICS_MEASUREMENT_ID` は、本番ビルドでは `.env.production`（gitignore 済み）または CI の既存 GitHub Secret から渡す。未設定時・開発サーバでは計測しない。テストでは実際の計測先へ送信しない。

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
scripts/           Markdown互換処理・依存監査
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
- PR ではテスト・lint・型チェック・本番ビルド・依存監査・ブラウザ回帰テストを実行する。
- Gatsby 依存・GraphQL 型生成・`resolutions` は使用しない。上位ライブラリが要求する通常の依存範囲で修正版を取り込む。警告の無視やアラートの dismiss で 0 件にしない。

改善候補は [docs/improvement-backlog.md](docs/improvement-backlog.md) を参照。

F1C カードのアイコンは `src/images/f1c-icon.png` に同梱する。元の `https://f1c.biz/favicon.ico` と同一の画像で、外部サイトの一時障害による画像欠けを防ぐ。
