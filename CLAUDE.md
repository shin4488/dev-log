# 開発ガイド

Astro と React で作る日本語ブログ・自己紹介サイト。記事は `content/blog/<記事>/index.md`、自己紹介データは `src/data/`、ルートは `src/pages/`、画面は `src/views/`・`src/templates/`・`src/components/`。記事の書式・起動手順は [README](README.md)の該当節を参照する。

## 開発・検証と公開

- Node 24 と Corepack で固定した Yarn と `yarn install --immutable` を使う。UI ライブラリは固定しており、変更時は画面を比較する。コマンドと依存の正は `package.json`。開発は `yarn dev`、コード変更の確認は `yarn lint`・`yarn test`、記事・画面の表示確認は `yarn build` と `yarn serve` を入口にする。必要な検証は変更対象に合わせる。
- GitHub Pages のサブパス配信を維持する。`astro.config.mjs` の `base` と `trailingSlash` を前提に、アセットを `/...` の絶対パスで参照しない。
- main への push はサイト公開につながる。公開条件は `.github/workflows/gh-pages.yml`、PR のテストは `.github/workflows/test.yml` を確認する。
- 基盤・依存の変更時は `yarn typecheck`・`yarn audit:dependencies` も実行する。ページや配信の変更時は本番ビルド後に `yarn test:e2e` を実行し、必要に応じて移行前と PC/スマホの表示を比較する。
- 整形は変更したファイルに絞る。`yarn format` は広い範囲を書き換えるため、無関係な差分を含めない。`.env.development` の内容をコミット・ログ・文書に転記しない。
- 継続する改善候補は [docs/improvement-backlog.md](docs/improvement-backlog.md)を使う。

## 調査と指示の保守

- `AGENTS.md` は `CLAUDE.md` への相対リンク。本文は一度読み、実体を編集する。
- `rg` は対象ディレクトリから名前・見出し・シンボルを探す。通常は `-g` で依存・成果物・ログ・ロックファイル・生成コードを除外し、依存・生成・型・障害の調査では直接読む。見つからなければ範囲・除外を見直す。
- 必須検証を行い、要点・失敗箇所を報告する。同じ差分・依存・設定・実行条件の結果は再利用する。
- ここは恒久規約・必須条件・主要コマンド・参照先に限る。進捗はチャット・既存 Issue/PR、機能・構成・依存・設定等の現在値は元の定義へ。規約・条件・参照先の変更や継続して必要な判断基準の追加時に更新する。
- スキルは説明から選び、該当 `SKILL.md` に従う。一覧・手順は転記せず、このガイドの必須適用条件は守る。
