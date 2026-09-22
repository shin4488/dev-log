# 開発ガイド

Astro と React で作る日本語ブログ・自己紹介サイト。記事は `content/blog/<記事>/index.md`、自己紹介データは `src/data/`、ルートは `src/pages/`、画面は `src/views/`・`src/templates/`・`src/components/`。記事の書式・起動手順は [README](README.md)の該当節を参照する。

## 開発・検証と公開

- Node 24 と Corepack で固定した Yarn と `yarn install --immutable` を使う。UI ライブラリは固定しており、変更時は画面を比較する。コマンドと依存の正は `package.json`。開発は `yarn dev`、コード変更の確認は `yarn lint`・`yarn test`、記事・画面の表示確認は `yarn build` と `yarn serve` を入口にする。必要な検証は変更対象に合わせる。
- GitHub Pages のサブパス配信を維持する。`astro.config.mjs` の `base` と `trailingSlash` を前提に、アセットを `/...` の絶対パスで参照しない。
- main への push はサイト公開につながる。公開条件は `.github/workflows/gh-pages.yml`、PR のテストは `.github/workflows/test.yml` を確認する。
- 基盤・依存の変更時は `yarn typecheck`・`yarn audit:dependencies` も実行する。ページや配信の変更時は本番ビルド後に `yarn test:e2e` を実行し、必要に応じて移行前と PC/スマホの表示を比較する。
- 整形は変更したファイルに絞る。`yarn format` は広い範囲を書き換えるため、無関係な差分を含めない。`.env.development` の内容をコミット・ログ・文書に転記しない。
- 継続する改善候補は [docs/improvement-backlog.md](docs/improvement-backlog.md)を使う。

## 作業の進め方

- 関連箇所・資料・skillsに絞って読み、根拠が足りなければ調査範囲を広げる。
- 判断に必要な不明点は既存資料で確認し、解消できなければ依存する作業の前に質問する。合意済み事項は再確認しない。
- 文書の言語を保ち、読み手に自然な表現にする。
- 該当する必須検証を行い、問題を修正する。差分・依存・設定・実行条件が同じなら結果を再利用し、結果と未確認事項を簡潔に報告する。
- 継続する規約と参照先だけを残し、進捗・設定値・他の資料やskillsの手順は複製しない。
