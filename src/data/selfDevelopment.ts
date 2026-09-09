import f1cIcon from '@/images/f1c-icon.png?url';

interface SelfDevelopmentItem {
  title: string;
  imageUri: string;
  siteUri: string;
  usedTechniques: string[];
  summary: string;
  technicalAppeal: string;
}

export const selfDevelopmentItems: SelfDevelopmentItem[] = [
  {
    title: '確率分布ビジュアライザー',
    imageUri:
      'https://shin4488.github.io/probability-distribution-visualization/ogp.png',
    siteUri:
      'https://shin4488.github.io/probability-distribution-visualization/',
    usedTechniques: [
      'React',
      'TypeScript',
      'Vite',
      'Chart.js',
      'Tailwind CSS',
      'Vitest',
      'Docker',
      'Dev Containers',
      'GitHub Actions',
      'GitHub Pages',
    ],
    summary:
      '確率分布の形やばらつきが、条件によってどう変わるかを動かして学べます。身近な活用例やシミュレーションを通して、数式だけではつかみにくい分布の特徴を確かめられます。',
    technicalAppeal:
      '確率計算と画面の処理を分離し、計算結果を自動テストで検証。大きな数でも計算が破綻しにくいよう工夫し、分布の設定や表示順をURLに保存しています。',
  },
  {
    title: 'Algorithm Visualizer｜動きで学ぶアルゴリズム',
    imageUri:
      'https://algorithm-visualizer-6w68.onrender.com/static/og-image.png',
    siteUri: 'https://algorithm-visualizer-6w68.onrender.com',
    usedTechniques: [
      'React',
      'TypeScript',
      'Parcel',
      'Mantine',
      'i18next',
      'Vitest',
      'Docker',
      'Dev Containers',
    ],
    summary:
      'データを並べ替えるアルゴリズムを、アニメーションで学ぶツール。同じデータを使って動きを見比べることで、手順や処理の多さの違いがわかります。速度調整や一時停止で、気になる動きもじっくり追えます。',
    technicalAppeal:
      '画面とアルゴリズムの処理を分け、機能を追加しやすい構成に。ブラウザの言語に合わせた表示切り替えと、Dockerによる開発環境の統一にも対応しています。',
  },
  {
    title: 'investee｜財務グラフを表示するChrome拡張',
    imageUri:
      'https://lh3.googleusercontent.com/_xZpV9RW1B24gnNpYz4tJTuok5bFRnFFe4Z9_v4Lmx6rb2jnjHY2IssMb5n8bC-2x7ECnGnS04vLPwkeRu2NM6X83nc=s275-w275-h175',
    siteUri:
      'https://chromewebstore.google.com/detail/jjjlnbhaimbljpnohoelnodggfdoimee',
    usedTechniques: [
      'React',
      'TypeScript',
      'Chrome Extensions API',
      'Redux Toolkit',
      'GraphQL',
      'Apollo Client',
      'Material UI',
      'Recharts',
      'Vite',
      'Docker',
    ],
    summary:
      '気になる銘柄を見つけたら、その場で企業の財務も確認。普段使う株式情報サイトを開いたまま、資産や利益、お金の流れをグラフで見られます。別のサイトで企業を探し直す手間を省けます。',
    technicalAppeal:
      '閲覧中のページに合わせて、企業の財務データをGraphQLで取得。Redux Toolkitで拡張機能の状態を管理し、グラフの自動切り替えにも対応しています。',
  },
  {
    title: 'investee｜上場企業の財務をグラフで見る',
    imageUri: 'https://investee.info/logo192.png',
    siteUri: 'https://investee.info',
    usedTechniques: [
      'React',
      'TypeScript',
      'Material UI',
      'Recharts',
      'Ruby on Rails',
      'GraphQL',
      'Sidekiq',
      'PostgreSQL',
      'Redis',
      'EDINET API',
      'XBRL',
      'Docker',
      'nginx',
      'さくらVPS',
    ],
    summary:
      '企業の資産や利益、お金の流れをグラフで把握。数字の表だけでは見えにくい財務の特徴をつかめます。キャッシュフローの特徴から企業を絞り込み、気になる投資先を探すこともできます。',
    technicalAppeal:
      'EDINETから財務データを定期的に取得し、XBRL形式の書類を解析して保存。Sidekiqで定期処理を実行し、GraphQLで画面に必要なデータを返しています。',
  },
  {
    title: 'F1C｜福井のNo.1企業を探す・共有する',
    imageUri: f1cIcon,
    siteUri: 'https://f1c.biz',
    usedTechniques: [
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
      'Vuetify',
      'Node.js',
      'Express.js',
      'Firebase Authentication',
      'Cloud Functions for Firebase',
      'PostgreSQL',
      'Docker',
      'nginx',
      'さくらVPS',
    ],
    summary:
      '名前を知らなかった地元企業の、意外な強みを知るきっかけに。さまざまな分野でNo.1を持つ福井の企業を、みんなの投稿から探せます。自分が知っている企業の魅力も共有できます。',
    technicalAppeal:
      '処理の依存関係を外から渡す設計（DI）で、機能を変更しやすい構成に。企業サイトの画像を定期的に取得・保存し、投稿取得の処理時間を約1秒短縮しました。',
  },
  {
    title: '毎球満塁の野球盤ゲーム',
    imageUri: 'https://baseballgames.jp.net/image/top.png',
    siteUri: 'https://baseballgames.jp.net',
    usedTechniques: [
      'Vue.js',
      'JavaScript',
      'Firebase Authentication',
      'Cloud Firestore',
      'Docker',
      'nginx',
      'さくらVPS',
    ],
    summary:
      '毎球が満塁で、打つたびに大量得点を狙える野球盤ゲーム。タイミングを見極めて打ち返し、ランキングのハイスコアに挑戦できます。',
    technicalAppeal:
      '三角関数とベクトル計算で、バット・ボール・盤面の当たり判定を実装。Firebaseでユーザー認証とスコアの保存を行い、ランキングを表示しています。',
  },
  {
    title: 'MLB順位表を届けるX bot',
    imageUri:
      'https://4.bp.blogspot.com/-soWYXYF8VzE/XLAc6evk4lI/AAAAAAABST8/sPABxbJwhlopXnLJNLRMEdnl1lyOphDegCLcBGAs/s400/character_sports_baseball.png',
    siteUri: 'https://twitter.com/mlbbot2',
    usedTechniques: [
      'C#',
      '.NET',
      'AWS Lambda',
      'Amazon EventBridge',
      'Terraform',
      'X API',
      'GitHub Actions',
    ],
    summary:
      'いつものタイムラインで、MLBの順位をチェック。フォローしておけば順位表が届くので、専用のサイトを開いて検索する手間なく、順位争いを追えます。',
    technicalAppeal:
      'EventBridgeとLambdaで定期実行し、TerraformでAWSの構成を管理。GitHub Actionsでテストとデプロイを自動化し、投稿前に、Xへ送る文章を手元のPCで確認できるようにしています。',
  },
  {
    title: 'コンビニ検索・画像翻訳のLINE bot',
    imageUri: 'https://chojugiga.com/c/choju50_0016/choju50_0016.png',
    siteUri: 'https://line.me/R/ti/p/%40244gzids',
    usedTechniques: [
      'Python',
      'Flask',
      'LINE Messaging API',
      'Cloud Vision API',
      'Google Places API',
      'Google Apps Script',
      'Cloud Firestore',
      'Render',
    ],
    summary:
      'LINEから、近くのトイレ付きコンビニの検索や写真の文字の翻訳ができます。位置情報や写真を送るだけなので、外出先でも場所を入力したり、読めない文字を書き写したりする手間がかかりません。',
    technicalAppeal:
      'FlaskでLINEのメッセージを受け取り、場所検索・文字の読み取り・翻訳のAPIを連携。翻訳はGoogle Apps ScriptでAPI化し、言語設定はFirestoreに保存しています。',
  },
  {
    title: 'Shooting Game｜1分間の弾よけゲーム',
    imageUri: 'https://shooting-f0o5.onrender.com/img/man.png',
    siteUri: 'https://shooting-f0o5.onrender.com/index.html',
    usedTechniques: ['HTML', 'CSS', 'JavaScript', 'Render'],
    summary:
      '飛んでくる弾をかわして、1分間生き残るゲーム。ルールはシンプルで、ブラウザからちょっとした合間に遊べます。',
    technicalAppeal:
      'JavaScriptでゲームの動作を実装。Renderを使って、ブラウザから遊べる形で公開しています。',
  },
];
