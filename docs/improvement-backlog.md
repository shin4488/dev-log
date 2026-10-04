# 改善バックログ

このリポジトリの改善候補と作業手順。誰(人・AI)が拾っても着手できる粒度で書く。
着手・完了・却下したら、この文書から該当項目を削除(または実施記録に移動)する。

工数目安: **S** = 数時間、**M** = 1〜2 日、**L** = 週単位。

---

## 基盤・依存関係

### TypeScriptの次期メジャーへの移行 — M

現在は Astro の型検査と typescript-eslint が共通で対応する6系を使用する。7系には両ツールが必要とするプログラムAPIがなく、単純な置き換えでは型検査とlintが停止する。コンパイラの併用や検査の省略で更新を成立させず、以下の条件を満たした時点で移行する。

1. [Astroの対応状況](https://github.com/withastro/roadmap/discussions/1321)と[typescript-eslintの対応状況](https://github.com/typescript-eslint/typescript-eslint/issues/10940)を確認し、両方の安定版が移行先を正式にサポートしていることを確認する。関連ツールの更新時にもこの条件を再確認する。
2. TypeScriptと必要な関連ツールを同じPRで更新する。peer依存の上書きや別コンパイラの追加をせず、`.astro`・`.ts`・`.tsx` の検査範囲を維持する。
3. 固定Yarnのimmutable install、lint、型検査、単体テスト、依存監査、本番ビルド、本番・開発時のブラウザテストを実行する。
4. 対応範囲を確認したうえで `.github/dependabot.yml` の TypeScript メジャー更新の除外を見直す。READMEの対応バージョンも更新する。

### 依存バージョンの完全固定の検討 — S

dependencies が`^`レンジ指定のため、`yarn install`のタイミングで意図しないバージョンが入り得る(yarn.lock がある限り通常は固定されるが、lockfile 再生成時に一斉に動く)。他リポジトリの「完全固定+更新は Dependabot 経由」ポリシーに合わせるか判断する。

1. 方針を決める(Dependabot 導入とセットで固定運用にするのが整合的)
2. 固定する場合: package.json の`^`を外して現在の lockfile のバージョンに揃える

## CI・品質

コンポーネント・ページ・操作のテストは `yarn test` と `yarn test:e2e` で実行する。新しい機能の追加時は、その仕様に対応する検証も追加する。

---

## 実施記録

### 2026-07-07: スターター残骸の一掃(このバックログ作成と同時に実施)

- PWA マニフェストの`name: Gatsby Starter Blog` / `short_name: GatsbyJS`を`Dev Log`に修正(ホーム画面追加時などにユーザーへ露出していた)
- package.json の`name` / `bugs` / `homepage` / `repository`をスターターの URL から本リポジトリのものに修正
- 動かない`deploy`スクリプトを削除(`gh-pages`パッケージが未インストールで実行不能。デプロイは gh-pages.yml が担う)
- `lint`スクリプトを追加(ESLint は設定済み・違反ゼロだった)
- README.md をスターターの説明文から本リポジトリの説明(コマンド・構成・デプロイ)に全面書き換え
- src/data/selfDevelopment.ts のタイポ修正: Percel → Parcel(algorithm-visualizer リポジトリが Parcel 使用であることを確認済み)
