# Dev Log

shin4488 のブログ + 自己紹介・ポートフォリオサイト。
Gatsby + Markdown で構築し、GitHub Pages で公開している。

- 公開 URL: https://shin4488.github.io/dev-log/
- ブログ記事は Markdown(`content/blog/`)、自己紹介ページのデータは TypeScript(`src/data/`)で管理

## 開発コマンド

```bash
yarn install        # 依存関係のインストール
yarn dev            # 開発サーバ(http://localhost:8000、GraphiQLは/___graphql)
yarn build          # 本番ビルド(--prefix-paths付き) → public/
yarn serve          # ビルド結果のローカル配信
yarn test           # Jest(コンポーネントテスト)
yarn lint           # ESLint(src配下とgatsby-*.js)
yarn format         # Prettierで整形
yarn dev            # Gatsby標準のGraphQL型生成も実行
yarn typecheck      # 生成型を含むTypeScript検証
yarn clean          # Gatsbyキャッシュ削除(ビルドがおかしい時の最初の一手)
```

環境変数はローカルでは`.env.development`(gitignore 済み)、CI では GitHub Secrets で渡す:

| 変数                              | 用途                                                    |
| --------------------------------- | ------------------------------------------------------- |
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | Google Analytics 4 の計測 ID(gatsby-plugin-google-gtag) |

## ディレクトリ構成

```
content/blog/      ブログ記事。1記事 = 1ディレクトリ(index.md + 画像)
src/pages/         固定ページ(about, blog, tagList, 404)
src/templates/     記事詳細ページのテンプレート(blog-post.tsx)
src/components/    UIコンポーネント(*.test.tsxが同居)
src/data/          自己紹介ページのデータ(個人開発の作品一覧・スキル・SNS)
static/            そのまま配信されるファイル(favicon, robots.txt)
```

## 記事の追加方法

`content/blog/<日付-スラッグ>/index.md` を作成する。frontmatter の形式:

```markdown
---
title: 記事タイトル
createdDate: '2022-08-24T20:00:00.000Z'
description: 一覧やmeta descriptionに使われる要約
tags: [個人開発, gatsby]
---

本文(Markdown)
```

## デプロイ

- main への push で `.github/workflows/gh-pages.yml` が起動し、ビルド → GitHub Pages へデプロイされる(手動デプロイは不要)
- プルリクエストでは `.github/workflows/test.yml` がテストを実行する
- `--prefix-paths`(pathPrefix: `/dev-log`)前提のビルドのため、**アセットを絶対パス`/...`で参照しないこと**

## 改善バックログ

今後の改善候補と作業手順は [docs/improvement-backlog.md](docs/improvement-backlog.md) を参照。
