# Dev Log

個人開発の記録や技術記事を発信するブログ 兼 ポートフォリオサイトです。  
Astro、React、Markdown を組み合わせて構築し、GitHub Actions 経由で GitHub Pages に静的ホスティングしています。

- **公開サイト**: [https://shin4488.github.io/dev-log/](https://shin4488.github.io/dev-log/)

---

## サイトの構成と公開フロー

```mermaid
flowchart LR
    Source["記事 (content/blog/)<br>プロフィール (src/data/)"] --> Build["Astro ビルド<br>(React + Markdown 処理)"]
    Build --> Dist["静的サイト出力<br>(dist/)"]
    Dist -->|"GitHub Actions (push to main)"| Pages["GitHub Pages 配信"]
```

---

## 主な技術スタック

- **フレームワーク**: Astro, React
- **コンテンツ管理**: Markdown, Frontmatter
- **スタイリング**: Vanilla CSS, Bootstrap
- **テスト・品質管理**: Vitest, Playwright, Prettier, TypeScript
- **パッケージマネージャ**: Yarn (v4)

---

## 開発環境のセットアップ

```bash
# Corepack を有効化して依存関係をインストール
corepack enable
yarn install --immutable

# 開発サーバの起動（http://localhost:8000/dev-log/）
yarn dev

# プロダクションビルド
yarn build

# ビルド成果物のローカル確認（http://localhost:9000/dev-log/）
yarn serve
```

### テストと検証

```bash
yarn typecheck    # TypeScript の型検査
yarn lint         # ESLint による静的解析
yarn test         # Vitest によるコンポーネントテスト
yarn test:e2e     # Playwright によるブラウザ回帰テスト
```

---

## 記事の執筆フロー

1. `content/blog/<日付-スラッグ>/index.md` を作成します。
2. フロントマターにメタデータを記載し、Markdown本文を執筆します。

```markdown
---
title: 記事のタイトル
createdDate: '2026-09-19T00:00:00.000Z'
description: 一覧や検索エンジン向けの説明文
tags: [個人開発, Web]
---

ここから記事の本文を Markdown 形式で記述します。
```

- 記事内で使用する画像は、同じディレクトリ（`content/blog/<日付-スラッグ>/`）内に配置して相対パスで参照できます。
- `yarn dev` でプレビューを確認しながら執筆を進められます。

---

## ディレクトリ構成

```text
dev-log/
├── content/blog/         # ブログ記事（1記事1ディレクトリ: index.md + 画像）
├── src/
│   ├── pages/            # Astro のルーティング・静的ページ生成
│   ├── views/            # トップページや自己紹介などの React 画面
│   ├── components/       # 共有 UI コンポーネント
│   ├── layouts/          # ページレイアウト・共通ヘッダー/フッター
│   └── data/             # スキル一覧や作品リンクなどのプロフィールデータ
└── public/               # ファビコンなどの静的アセット
```
