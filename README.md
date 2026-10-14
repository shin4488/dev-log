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

## 多言語対応

トップURL（`/dev-log/`）は英語版です。初回に開くと、ブラウザの言語設定が日本語なら日本語版（`/dev-log/ja/`）へ移動します。
画面右上の「日本語 / English」で切り替えると、選択をブラウザに保存します。
各言語のページは静的に生成されるため、直接アクセスや再読み込みにも対応しています。

| ページ | 日本語             | 英語                                 |
| ------ | ------------------ | ------------------------------------ |
| トップ | `/dev-log/ja/`     | `/dev-log/`                          |
| 404    | `/dev-log/ja/404/` | `/dev-log/404/`、`/dev-log/404.html` |

通常の画面はトップページのみです。重複していた `/dev-log/about/` と `/dev-log/en/about/` は削除し、アクセスすると404を返します。
以前の英語版のURL `/dev-log/en/` は、トップURLへ転送します。

トップURLでは保存済みの選択を優先し、未選択ならブラウザの言語設定を順に確認します。対応する言語がなければ英語を表示します。
日本語版の `/dev-log/ja/` を直接開くと、保存済みの選択にかかわらず日本語を表示します。
検索エンジンのクローラーは英語のブラウザとして動くため、言語による自動移動は英語版のトップURLだけで行い、各言語のページがそれぞれのURLで検索エンジンに登録されるようにしています。
切り替えると同じページの別言語版に移動し、URLにセクションの指定（`#projects` など）がある場合はその指定も引き継ぎます。
404ページも保存済みの言語、ブラウザの言語、英語の順に表示言語を選びます。
存在しないURLの言語を自動判定するときは、元のURLと404の応答を維持して文言・ページタイトル・HTMLの言語を切り替えます。
ブラウザの保存領域が使えない場合は、切り替えた言語を `?lang=ja` / `?lang=en` で指定します。
JavaScriptを無効にした場合も、日英のページ表示とリンクでの言語切り替えを利用できます。
404の自動判定にはJavaScriptを使い、無効時は通常の404を英語、`/dev-log/ja/404/` を日本語で表示します。

共通の表示文言とURLの処理は `src/lib/i18n.ts`、作品の翻訳は
`src/data/selfDevelopment.ts`、技術名と注釈の翻訳は `src/data/skillLevel.ts` にあります。
ブラウザの言語判定は `src/components/PreferredLanguage.astro`、メタデータの生成・更新は
`src/lib/pageMetadata.ts` に集約しています。
切り替え操作の保存は `src/components/LanguageControls.astro` で、Reactの初期化前から処理します。

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
