interface SelfDevelopmentItem {
  title: string;
  imageUri: string;
  siteUri: string;
  developmentStartAt: string;
  developmentEndAt: string;
  usedTechniques: string[];
  sellingPoint: string;
  description: string;
}

export const selfDevelopmentItems: SelfDevelopmentItem[] = [
  {
    title: '上場企業の公開済み財務データを可視化するサービス（FLAZA）',
    imageUri: 'https://flaza.online/logo192.png',
    siteUri: 'https://flaza.online',
    developmentStartAt: '2023年9月',
    developmentEndAt: '10月',
    usedTechniques: [
      'Docker',
      'nginx',
      'React.js',
      'Material UI',
      'Recharts',
      'TypeScript',
      'Ruby',
      'Ruby on Rails',
      'Sidekiq',
      'GraphQL',
      'PostgreSQL',
      'Redis',
      'Ubuntu',
      'さくらVPS',
    ],
    description: `前日以前に公開された財務データ（貸借対照表・損益計算書・キャッシュフロー計算書）をグラフ化して一覧表示するサービス。
上場企業の財務データを閲覧・検索できるサービスは世に存在するが、それを可視化して一覧表示するサービスは見当たらなかったため開発した。
ユーザー層としては株など個別企業への投資家をターゲットとしているため、各企業の株探へのリンクをつけており、企業の株価などもすぐチェックできる。
貸借対照表・損益計算書において国際会計基準や金融機関のデータが表示対応していないことが伸びしろ。
今後予定している追加機能として、検索・お気に入り登録・ROAやROEなど経営指標の表示を予定している。`,
    sellingPoint: `財務データの自動切替によってユーザー側で操作せずとも財務3表を繰り返し見れる。
訂正財務諸表が提出された場合もそれを取り込んで常に正確な財務データを表示できる。
開発面では、将来的にモバイルアプリを作りたいと考えているが、表示するデータをフロントエンドで自由に選択できるように（フロントエンドが欲しいデータのみをバックエンドが返すために）、
フロントエンドとバックエンドのインターフェースにはGraphQLを使用した。`,
  },
  {
    title:
      '福井に拠点のあるNo.1企業を共有し、また他ユーザの共有内容を閲覧できるサービス（F1C）',
    imageUri: 'https://illustrain.com/img/work/2016/illustrain04-kaisya01.png',
    siteUri: 'https://f1c.biz',
    developmentStartAt: '2022年5月',
    developmentEndAt: '6月',
    usedTechniques: [
      'Docker',
      'nginx',
      'Vue.js',
      'Vuetify',
      'Nuxt.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Firebase (Authentication, Functions)',
      'PostgreSQL',
      'Ubuntu',
      'さくらVPS',
    ],
    description: `自分自身が一時期、地元である福井の企業を探す機会があったが、なかなか福井にはどのような企業があるのかを探すのが難しいと感じたことが開発のきっかけ。
現在は福井の人口流出が続いているものの、「自分は把握できていないが、優良な企業」はたくさんあると思い、福井への関心が高まることでUターンする人も増えて、
個人・企業・地域がWin-Winの関係を作れればという思いで開発。しかし、「個人ユーザには投稿するメリットがない」「企業の人にはこのサービスの認知をされない」など投稿する人の立場に立った企画ができていないという問題が発生している。
（地元の新聞社に新聞記事としてこのサービスの掲載依頼を行ったり、地元の団体のサイトへ掲載依頼を行うもむなしく掲載されず、認知されないという企画倒れなサービスとなっている。）
このサービスの開発の記録は以下を参照 https://qiita.com/shin4488/items/65dc5fba6a3df1eeb4f8`,
    sellingPoint: `各企業のホームページに設定されているmetaタグの"og:image"情報の取得を「リアルタイムで取得」から「日次バッチで取得しDB保存」
としたことで、リアルタイムの処理負担が減り、投稿取得のサーバサイドの処理時間が1秒ほど短縮した。`,
  },
  {
    title: '常に満塁から始まる野球盤ゲーム',
    imageUri: 'https://baseballgames.jp.net/image/top.png',
    siteUri: 'https://baseballgames.jp.net',
    developmentStartAt: '2021年5月',
    developmentEndAt: '',
    usedTechniques: [
      'Docker',
      'nginx',
      'Vue.js',
      'JavaScript',
      'Gulp',
      'webpack',
      'Firebase (Authentication, Firestore)',
      'Ubuntu',
      'さくらVPS',
    ],
    description: `全球が満塁から始まる設定の野球ゲーム。野球好きな人とかかわりあえる場所が欲しいと思ったのが開発のきっかけ。
スマホでプレイすると短い距離からスピードのある球が投げ込まれるため、かなり難しく感じてしまう。
現状、1人対戦しかできないため、2人でオンライン対戦できるようにするのが伸びしろ（WebSocketなど使えばできる...はず）`,
    sellingPoint: `今週分と歴代分のランキングによって、他の人と関わり合えるような機能を作成した。
「バットとボール」「ボールと盤」などの当たり判定には、三角関数やベクトルを利用してより厳密な当たり判定を行うようにした。`,
  },
  {
    title: 'メジャーリーグの順位表をツイートするTwitter bot',
    imageUri:
      'https://4.bp.blogspot.com/-soWYXYF8VzE/XLAc6evk4lI/AAAAAAABST8/sPABxbJwhlopXnLJNLRMEdnl1lyOphDegCLcBGAs/s400/character_sports_baseball.png',
    siteUri: 'https://twitter.com/mlbbot2',
    developmentStartAt: '2020年8月',
    developmentEndAt: '',
    usedTechniques: ['C#', 'AWS Lambda', 'Twitter API'],
    description: `メジャーリーグの試合のあった日に順位表を教えてくれるTwitter bot。
Lambdaを使用してサーバレスな環境を日次で動かしている。
デプロイを手動で行なっているため、自動化やAWS環境はIaCな形で管理できるようにするのが技術的伸びしろ。
試合がない日にはツイートしないように制御をかけている。
前年にはLINE botを使用して開発を行なっていることもあり、この頃bot開発をとても楽しんでいた。`,
    sellingPoint: `Twitterアカウントさえフォローしておけば、自分から「メジャーリーグ 順位」など能動的に検索せずとも
順位表を教えてくれるようになっており、比較的気軽に使える。`,
  },
  {
    title:
      'トイレのある近くのコンビニ検索・画像内の文字を指定の言語に翻訳するLINE bot',
    imageUri: 'https://chojugiga.com/c/choju50_0016/choju50_0016.png',
    siteUri: 'https://line.me/R/ti/p/%40244gzids',
    developmentStartAt: '2019年9月',
    developmentEndAt: '11月（以降、たまにメンテナンス実施）',
    usedTechniques: [
      'LINE Messaging API',
      'Python',
      'Heroku（リリース当時）',
      'Render（Heroku無料枠廃止に伴い使用）',
      'Google Vision API',
      'Google Places API',
      'Firebase (Firestore)',
      'Google Apps Script',
    ],
    description: `LINEから位置情報を送ると近くのコンビニ（トイレ付き）を表示して、画像を送ると画像内のテキストを翻訳してくれる。
もともと、近くのレストラン検索Botとして開発を行なっていたが、ホットペッパーのAPI提供が終了してしまったため別路線に切り替えた。
代替としてコンビニ検索を入れている。（ただ検索するだけではGoogleマップと同じになってしまうため、差別化のためにトイレ付きのコンビニを検索するようにした。）
ユーザ管理をLINE側で行ってくれるのがとてもありがたい。`,
    sellingPoint: `開発当時、画像の文章を翻訳するサービスがなかったため（少ないながらも）ユーザさんから重宝してもらっていた。
今は、Google翻訳が画像対応できてしまったようで、あまりこのBotで翻訳するメリットがなさそう...。
（技術的なアピールとして）翻訳部分でGoogle翻訳APIを使用してしまうと料金がかかってしまうため、翻訳はGoogle Apps Script（GAS）側で行い無料で翻訳を実現している。
（GAS側でAPIのエンドポイントを公開できるため、自作したGASの翻訳用のAPIを叩いている。）`,
  },
  {
    title: 'Shooting Game',
    imageUri: 'https://shooting-basic.surge.sh/img/man.png',
    siteUri: 'https://shooting-basic.surge.sh',
    developmentStartAt: '2017年1月',
    developmentEndAt: '3月',
    usedTechniques: ['JavaScript', 'Surge'],
    description: `1分間、球から逃げ続けるシューティングゲーム。大学3年生の時に初めてHTML・CSS・JavaScriptを触った時に作ったもの。
クオリティ的な問題はたくさんあると思うが、当時は結構真剣に作っていた。`,
    sellingPoint: `Surgeを使用してサーバコスト・開発スピードをかけずにデリバリーできるようにした。`,
  },
];
