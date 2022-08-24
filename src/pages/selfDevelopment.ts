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
    title:
      'トイレのある近くのコンビニ検索・画像内の文字を指定の言語に翻訳するLINE bot',
    imageUri: 'https://chojugiga.com/c/choju50_0016/choju50_0016.png',
    siteUri: 'https://line.me/R/ti/p/%40244gzids',
    developmentStartAt: '2019年9月',
    developmentEndAt: '11月（以降、たまにメンテナンス実施）',
    usedTechniques: [
      'LINE Messaging API',
      'Python',
      'Heroku',
      'Google Vision API',
      'Google Places API',
      'Firebase (Firestore)',
    ],
    sellingPoint:
      '開発当時、画像の文章を翻訳するサービスがなかったため（少ないながらも）ユーザさんから重宝してもらっていた。' +
      '（今は、Google翻訳が画像対応できてしまったようで、あまりこのBotで翻訳するメリットがなさそう...）',
    description:
      'もともと、近くのレストラン検索Botとして開発を行なっていたが、ホットペッパーのAPI提供が終了してしまったため別路線に切り替えた。' +
      '代替としてコンビニ検索を入れている。（ただ検索するだけではGoogleマップの方を使われてしまうため、付加価値としてトイレ付きのコンビニを検索するようにした。）' +
      'ユーザ管理をLINE側で行ってくれるのがとてもありがたい。',
  },
  {
    title: 'Shooting Game',
    imageUri: 'https://shooting-basic.surge.sh/img/man.png',
    siteUri: 'https://shooting-basic.surge.sh',
    developmentStartAt: '2017年1月',
    developmentEndAt: '3月',
    usedTechniques: ['JavaScript', 'Surge'],
    sellingPoint:
      'Surgeを使用してサーバコスト・開発スピードをかけずにデリバリーできるようにした。',
    description:
      '大学3年生の時に初めてHTML・CSS・JavaScriptを触った時に作ったもの。今考えるとよくこんなクオリティでリリースしたなと思うが、当時は結構真剣に作っていた。',
  },
];
