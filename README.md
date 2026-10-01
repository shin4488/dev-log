# Dev Log

個人開発の制作物や開発経験を紹介するポートフォリオサイトです。
Astro と React を組み合わせて構築し、GitHub Actions 経由で GitHub Pages に静的ホスティングしています。

- **公開サイト**: [https://shin4488.github.io/dev-log/](https://shin4488.github.io/dev-log/)

---

## サイトの構成と公開フロー

```mermaid
flowchart LR
    Source["プロフィール (src/data/)"] --> Build["Astro ビルド<br>(React)"]
    Build --> Dist["静的サイト出力<br>(dist/)"]
    Dist -->|"GitHub Actions (push to main)"| Pages["GitHub Pages 配信"]
```

---

## 主な技術スタック

- **フレームワーク**: Astro, React
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

## ディレクトリ構成

```text
dev-log/
├── src/
│   ├── pages/            # Astro のルーティング・静的ページ生成
│   ├── views/            # トップページや自己紹介などの React 画面
│   ├── components/       # 共有 UI コンポーネント
│   ├── layouts/          # ページレイアウト・共通ヘッダー/フッター
│   └── data/             # スキル一覧や作品リンクなどのプロフィールデータ
└── static/               # ファビコンなどの静的アセット
```
