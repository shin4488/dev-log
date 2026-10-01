import f1cIcon from '@/images/f1c-icon.png?url';
import type { Locale, LocalizedText } from '@/lib/i18n';

interface SelfDevelopmentItem {
  title: LocalizedText;
  imageUri: string;
  siteUri: string;
  usedTechniques: (string | LocalizedText)[];
  summary: LocalizedText;
  technicalAppeal: LocalizedText;
}

const selfDevelopmentItems: SelfDevelopmentItem[] = [
  {
    title: {
      ja: '確率分布ビジュアライザー',
      en: 'Probability Distribution Visualizer',
    },
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
    summary: {
      ja: '確率分布の形やばらつきが、条件によってどう変わるかを動かして学べます。身近な活用例やシミュレーションを通して、数式だけではつかみにくい分布の特徴を確かめられます。',
      en: 'Explore how probability distributions change as you adjust their parameters. Practical examples and simulations help you understand features that can be hard to grasp from formulas alone.',
    },
    technicalAppeal: {
      ja: '確率計算と画面の処理を分離し、計算結果を自動テストで検証。大きな数でも計算が破綻しにくいよう工夫し、分布の設定や表示順をURLに保存しています。',
      en: 'Separates probability calculations from the UI and verifies results with automated tests. Handles large numbers more reliably and saves distribution settings and display order in the URL.',
    },
  },
  {
    title: {
      ja: 'Algorithm Visualizer｜動きで学ぶアルゴリズム',
      en: 'Algorithm Visualizer | Learn through animation',
    },
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
    summary: {
      ja: 'データを並べ替えるアルゴリズムを、アニメーションで学ぶツール。同じデータを使って動きを見比べることで、手順や処理の多さの違いがわかります。速度調整や一時停止で、気になる動きもじっくり追えます。',
      en: 'Learn sorting algorithms through animation. Compare how they process the same data to understand differences in their steps and workload. Adjust the speed or pause to examine each step.',
    },
    technicalAppeal: {
      ja: '画面とアルゴリズムの処理を分け、機能を追加しやすい構成に。ブラウザの言語に合わせた表示切り替えと、Dockerによる開発環境の統一にも対応しています。',
      en: 'Separates algorithms from the UI to make new features easier to add. Supports browser-language detection and a consistent development environment with Docker.',
    },
  },
  {
    title: {
      ja: 'investee｜財務グラフを表示するChrome拡張',
      en: 'investee | Financial charts for Chrome',
    },
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
    summary: {
      ja: '気になる銘柄を見つけたら、その場で企業の財務も確認。普段使う株式情報サイトを開いたまま、資産や利益、お金の流れをグラフで見られます。別のサイトで企業を探し直す手間を省けます。',
      en: "Check a company's finances as soon as a stock catches your eye. View assets, profits, and cash flow in charts without leaving your usual stock information site or searching for the company again.",
    },
    technicalAppeal: {
      ja: '閲覧中のページに合わせて、企業の財務データをGraphQLで取得。Redux Toolkitで拡張機能の状態を管理し、グラフの自動切り替えにも対応しています。',
      en: 'Fetches financial data through GraphQL based on the page being viewed. Uses Redux Toolkit to manage extension state and switches charts automatically.',
    },
  },
  {
    title: {
      ja: 'investee｜上場企業の財務をグラフで見る',
      en: 'investee | Financial charts for listed companies',
    },
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
      { ja: 'さくらVPS', en: 'Sakura VPS' },
    ],
    summary: {
      ja: '企業の資産や利益、お金の流れをグラフで把握。数字の表だけでは見えにくい財務の特徴をつかめます。キャッシュフローの特徴から企業を絞り込み、気になる投資先を探すこともできます。',
      en: "Understand a company's assets, profits, and cash flow through charts that reveal patterns hidden in tables. Filter companies by cash flow characteristics to find potential investments.",
    },
    technicalAppeal: {
      ja: 'EDINETから財務データを定期的に取得し、XBRL形式の書類を解析して保存。Sidekiqで定期処理を実行し、GraphQLで画面に必要なデータを返しています。',
      en: 'Regularly retrieves financial filings from EDINET, parses XBRL documents, and stores the data. Uses Sidekiq for scheduled processing and GraphQL to serve the data needed by the UI.',
    },
  },
  {
    title: {
      ja: 'F1C｜福井のNo.1企業を探す・共有する',
      en: 'F1C | Discover and share leading companies in Fukui',
    },
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
      { ja: 'さくらVPS', en: 'Sakura VPS' },
    ],
    summary: {
      ja: '名前を知らなかった地元企業の、意外な強みを知るきっかけに。さまざまな分野でNo.1を持つ福井の企業を、みんなの投稿から探せます。自分が知っている企業の魅力も共有できます。',
      en: 'Discover unexpected strengths of local companies you may not know. Explore community posts about companies in Fukui that lead their fields, and share what makes your own favorites stand out.',
    },
    technicalAppeal: {
      ja: '処理の依存関係を外から渡す設計（DI）で、機能を変更しやすい構成に。企業サイトの画像を定期的に取得・保存し、投稿取得の処理時間を約1秒短縮しました。',
      en: 'Uses dependency injection to make features easier to change. Regularly retrieves and stores company website images, reducing post retrieval time by about one second.',
    },
  },
  {
    title: {
      ja: '毎球満塁の野球盤ゲーム',
      en: 'Bases-loaded baseball board game',
    },
    imageUri: 'https://baseballgames.jp.net/image/top.png',
    siteUri: 'https://baseballgames.jp.net',
    usedTechniques: [
      'Vue.js',
      'JavaScript',
      'Firebase Authentication',
      'Cloud Firestore',
      'Docker',
      'nginx',
      { ja: 'さくらVPS', en: 'Sakura VPS' },
    ],
    summary: {
      ja: '毎球が満塁で、打つたびに大量得点を狙える野球盤ゲーム。タイミングを見極めて打ち返し、ランキングのハイスコアに挑戦できます。',
      en: 'Every pitch starts with the bases loaded, giving you a chance to score big with every hit. Time your swing and challenge the high scores on the leaderboard.',
    },
    technicalAppeal: {
      ja: '三角関数とベクトル計算で、バット・ボール・盤面の当たり判定を実装。Firebaseでユーザー認証とスコアの保存を行い、ランキングを表示しています。',
      en: 'Uses trigonometry and vector calculations for collisions between the bat, ball, and board. Firebase handles authentication and score storage for the leaderboard.',
    },
  },
  {
    title: {
      ja: 'MLB順位表を届けるX bot',
      en: 'MLB standings bot for X',
    },
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
    summary: {
      ja: 'いつものタイムラインで、MLBの順位をチェック。フォローしておけば順位表が届くので、専用のサイトを開いて検索する手間なく、順位争いを追えます。',
      en: 'Keep up with MLB standings in your usual timeline. Follow the bot to receive standings updates without opening a separate site or searching for results.',
    },
    technicalAppeal: {
      ja: 'EventBridgeとLambdaで定期実行し、TerraformでAWSの構成を管理。GitHub Actionsでテストとデプロイを自動化し、投稿前に、Xへ送る文章を手元のPCで確認できるようにしています。',
      en: 'Runs on a schedule with EventBridge and Lambda, with AWS infrastructure managed through Terraform. GitHub Actions automates testing and deployment, and posts can be previewed locally before being sent to X.',
    },
  },
  {
    title: {
      ja: 'コンビニ検索・画像翻訳のLINE bot',
      en: 'LINE bot for convenience store search and image translation',
    },
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
    summary: {
      ja: 'LINEから、近くのトイレ付きコンビニの検索や写真の文字の翻訳ができます。位置情報や写真を送るだけなので、外出先でも場所を入力したり、読めない文字を書き写したりする手間がかかりません。',
      en: 'Find nearby convenience stores with restrooms or translate text in photos from LINE. Send your location or a photo without having to type an address or copy unfamiliar text while out and about.',
    },
    technicalAppeal: {
      ja: 'FlaskでLINEのメッセージを受け取り、場所検索・文字の読み取り・翻訳のAPIを連携。翻訳はGoogle Apps ScriptでAPI化し、言語設定はFirestoreに保存しています。',
      en: 'Receives LINE messages with Flask and connects place search, text recognition, and translation APIs. Exposes translation through Google Apps Script and stores language preferences in Firestore.',
    },
  },
  {
    title: {
      ja: 'Shooting Game｜1分間の弾よけゲーム',
      en: 'Shooting Game | A one-minute bullet-dodging challenge',
    },
    imageUri: 'https://shooting-f0o5.onrender.com/img/man.png',
    siteUri: 'https://shooting-f0o5.onrender.com/index.html',
    usedTechniques: ['HTML', 'CSS', 'JavaScript', 'Render'],
    summary: {
      ja: '飛んでくる弾をかわして、1分間生き残るゲーム。ルールはシンプルで、ブラウザからちょっとした合間に遊べます。',
      en: 'Dodge incoming bullets and survive for one minute. Simple rules make it easy to play in your browser during a short break.',
    },
    technicalAppeal: {
      ja: 'JavaScriptでゲームの動作を実装。Renderを使って、ブラウザから遊べる形で公開しています。',
      en: 'Implements game behavior in JavaScript and hosts it on Render so it can be played in a browser.',
    },
  },
];

export function getSelfDevelopmentItems(locale: Locale) {
  return selfDevelopmentItems.map((item) => ({
    ...item,
    title: item.title[locale],
    summary: item.summary[locale],
    technicalAppeal: item.technicalAppeal[locale],
    usedTechniques: item.usedTechniques.map((tech) =>
      typeof tech === 'string' ? tech : tech[locale],
    ),
  }));
}
