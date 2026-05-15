export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type FlowerDetail = {
  love: string
  work: string
  money: string
  health: string
  luckyColor: string
  luckyItem: string
}

export type Flower = {
  id: number
  name: string
  nameEn: string
  season: Season
  flowerLanguage: string
  freeText: string
  detail: FlowerDetail
}

export const FLOWERS: Flower[] = [
  {
    id: 1,
    name: '桜',
    nameEn: 'Cherry Blossom',
    season: 'spring',
    flowerLanguage: '優美な女性・精神の美しさ',
    freeText: '今日は周りの人との縁が深まる日。笑顔を大切に。',
    detail: {
      love: '新しい出会いの予感。今日は積極的に話しかけてみて。心を開くことで素敵な縁が生まれます。',
      work: '努力が周囲に認められる日。プレゼンや発表があれば自信を持って臨んで。',
      money: '小さな幸運が舞い込む予感。衝動買いは避け、本当に必要なものを見極めて。',
      health: '体と心のバランスが取れている良い日。軽い運動で更に調子が上がります。',
      luckyColor: 'ピンク',
      luckyItem: 'ハンカチ',
    },
  },
  {
    id: 2,
    name: 'チューリップ',
    nameEn: 'Tulip',
    season: 'spring',
    flowerLanguage: '思いやり・博愛',
    freeText: '素直な気持ちを大切にする日。本音を伝えるタイミングかも。',
    detail: {
      love: '正直な言葉が心を動かす。気になる人には素直な気持ちを伝えてみて。',
      work: 'チームワークが鍵。一人で抱え込まず、周囲に頼ることで突破口が開けます。',
      money: '計画的な支出が吉。将来のための貯蓄を意識して。',
      health: '睡眠の質を上げることを意識して。早めに休む日にしましょう。',
      luckyColor: '赤',
      luckyItem: '手帳',
    },
  },
  {
    id: 3,
    name: 'スミレ',
    nameEn: 'Violet',
    season: 'spring',
    flowerLanguage: '誠実・小さな幸せ',
    freeText: '細部に気を配ると良い発見がある日。丁寧な行動が運を呼び込みます。',
    detail: {
      love: '小さな気遣いが相手の心に響く。ラインやメッセージを送るのに良い日です。',
      work: '細かい作業や確認作業で実力を発揮。ミスを防ぐことで信頼が積み上がります。',
      money: 'ポイントや割引を活用すると◎。節約意識が自然と高まる日。',
      health: '目の疲れに注意。こまめな休憩を取り入れて。',
      luckyColor: '紫',
      luckyItem: 'メモ帳',
    },
  },
  {
    id: 4,
    name: '菜の花',
    nameEn: 'Rapeseed',
    season: 'spring',
    flowerLanguage: '快活・明るさ',
    freeText: '新しいことを始めるのに最高の日。直感を信じて踏み出して。',
    detail: {
      love: '明るく元気な自分でいることが最大の魅力。笑顔で過ごすだけで良縁が近づきます。',
      work: '新しいアイデアが浮かびやすい日。思いついたことはすぐメモして。',
      money: '少額の投資や自己投資に良いタイミング。学ぶことへの投資が後で実ります。',
      health: '体を動かすと気分が上がります。朝の散歩やストレッチが特に効果的。',
      luckyColor: '黄色',
      luckyItem: 'ランニングシューズ',
    },
  },
  {
    id: 5,
    name: '藤',
    nameEn: 'Wisteria',
    season: 'spring',
    flowerLanguage: '歓迎・優しさ',
    freeText: '人との繋がりを大切にする日。古い友人に連絡してみると吉。',
    detail: {
      love: '過去の縁が復活する予感。懐かしい人からの連絡があるかも。',
      work: '人脈が仕事を動かす日。交流の場に積極的に顔を出して。',
      money: '共同出費や割り勘が増えるかも。金銭の貸し借りには注意を。',
      health: 'リラックスできる環境を整えることが大切な日。アロマやハーブティーが効果的。',
      luckyColor: '薄紫',
      luckyItem: 'ハーブティー',
    },
  },
  {
    id: 6,
    name: '向日葵',
    nameEn: 'Sunflower',
    season: 'summer',
    flowerLanguage: '憧れ・あなたを見つめている',
    freeText: '太陽のような輝きを放てる日。自分らしく堂々と行動して。',
    detail: {
      love: '情熱的なアプローチが実を結ぶ。好きな人には積極的に気持ちを伝えて。',
      work: 'リーダーシップを発揮できる日。周りを引っ張る姿勢が評価されます。',
      money: '大きな決断は慎重に。勢いだけで動くと後悔することも。',
      health: '水分補給を忘れずに。エネルギーが高い分、消耗も早い日です。',
      luckyColor: 'オレンジ',
      luckyItem: '水筒',
    },
  },
  {
    id: 7,
    name: '紫陽花',
    nameEn: 'Hydrangea',
    season: 'summer',
    flowerLanguage: '移り気・辛抱強い愛情',
    freeText: '感情の波が大きい日。流れに身を任せると良い方向へ向かいます。',
    detail: {
      love: '気持ちが揺れやすい日。大事な決断は少し時間をおいて。',
      work: '臨機応変な対応が求められます。変化を恐れず柔軟に動いて。',
      money: '予想外の出費に備えて。余裕のある行動が吉。',
      health: '雨や湿気による体調変化に注意。温かい飲み物で体を温めて。',
      luckyColor: '水色',
      luckyItem: '傘',
    },
  },
  {
    id: 8,
    name: '百合',
    nameEn: 'Lily',
    season: 'summer',
    flowerLanguage: '純粋・無垢',
    freeText: '心の声に従う日。打算を捨てて純粋な行動が幸運を引き寄せます。',
    detail: {
      love: '純粋な気持ちが相手に伝わる日。飾らない自分でいることが大切。',
      work: '誠実な姿勢が信頼を生む。ずるい近道より正攻法が結果につながります。',
      money: '清く正しくがモットーの日。怪しい儲け話には近づかないで。',
      health: '心の浄化に良い日。自然の中で過ごす時間を作ると◎。',
      luckyColor: '白',
      luckyItem: '白いタオル',
    },
  },
  {
    id: 9,
    name: 'ラベンダー',
    nameEn: 'Lavender',
    season: 'summer',
    flowerLanguage: '沈黙・あなたを待っています',
    freeText: '静かに内省する日。焦らずじっくりと自分の内面と向き合って。',
    detail: {
      love: '待ちの姿勢が吉。相手のペースに合わせることで関係が深まります。',
      work: '集中力が高まる日。一つのことに絞って取り組むと成果が出ます。',
      money: '衝動的な支出を避けて。本当に必要かを一晩考えてから決断して。',
      health: '睡眠の質が上がる日。ラベンダーの香りを取り入れて良い眠りを。',
      luckyColor: 'ラベンダー',
      luckyItem: 'アロマオイル',
    },
  },
  {
    id: 10,
    name: 'コスモス',
    nameEn: 'Cosmos',
    season: 'autumn',
    flowerLanguage: '乙女の純潔・調和',
    freeText: 'バランス感覚が冴える日。周囲との調和を意識すると物事がスムーズに。',
    detail: {
      love: '自然体でいることが最大の魅力。無理せず等身大の自分を見せて。',
      work: '複数のタスクをバランスよく進められる日。優先順位を整理して取り組んで。',
      money: '収支のバランスを見直す良いタイミング。家計簿をつけ始めるなら今日から。',
      health: '体と心のバランスを整える日。ヨガや瞑想が特に効果的です。',
      luckyColor: 'ピンク',
      luckyItem: 'ヨガマット',
    },
  },
  {
    id: 11,
    name: '菊',
    nameEn: 'Chrysanthemum',
    season: 'autumn',
    flowerLanguage: '高貴・高潔',
    freeText: '品格が輝く日。上品な言動が周囲からの評価を高めます。',
    detail: {
      love: '品のある振る舞いが魅力を引き立てる日。丁寧な言葉遣いを心がけて。',
      work: '責任感を持った行動が評価される日。リーダーとして信頼を得るチャンス。',
      money: '高品質なものへの投資が吉。安物買いより本物を選ぶ日です。',
      health: '体のメンテナンスに良い日。マッサージや整体に行くと◎。',
      luckyColor: '金色',
      luckyItem: '良質な化粧品',
    },
  },
  {
    id: 12,
    name: 'ダリア',
    nameEn: 'Dahlia',
    season: 'autumn',
    flowerLanguage: '華麗・優雅',
    freeText: '個性を輝かせる日。自分らしさを前面に出すと運気アップ。',
    detail: {
      love: '個性的な魅力が輝く日。自分にしかないアピールポイントを大切に。',
      work: '創造性が高まる日。アート、デザイン、企画など創作系の作業が捗ります。',
      money: '特別なものへの出費OK。自分へのご褒美も必要な投資です。',
      health: '好きなことで英気を養う日。趣味の時間を作ることが心の健康に繋がります。',
      luckyColor: '赤紫',
      luckyItem: 'アクセサリー',
    },
  },
  {
    id: 13,
    name: '椿',
    nameEn: 'Camellia',
    season: 'winter',
    flowerLanguage: '申し分のない魅力・完璧な美しさ',
    freeText: '内側から輝く日。自分の魅力を再確認できるタイミング。',
    detail: {
      love: '自信を持って恋愛に臨んで。あなたの魅力は十分に伝わっています。',
      work: 'これまでの努力が結果として現れてくる日。自信を持って前進して。',
      money: '実力通りの評価が得られる日。正当な報酬を求めることを恐れないで。',
      health: '冬の乾燥対策を忘れずに。保湿ケアで肌の調子を整えて。',
      luckyColor: '赤',
      luckyItem: 'ハンドクリーム',
    },
  },
  {
    id: 14,
    name: '水仙',
    nameEn: 'Narcissus',
    season: 'winter',
    flowerLanguage: '自己愛・神秘',
    freeText: '自分を大切にする日。まず自分を満たすことが周囲への優しさにつながります。',
    detail: {
      love: '自分軸を大切にして。尽くしすぎより、自分も相手も大切にするバランスを。',
      work: '自分の強みを活かす方向で動いて。得意分野で勝負する日です。',
      money: '自己投資が最大のリターンをもたらす日。スキルアップへの出費は惜しまないで。',
      health: '自分のペースを守ることが大切。無理なお付き合いは断る勇気も必要。',
      luckyColor: '白と黄色',
      luckyItem: '日記帳',
    },
  },
  {
    id: 15,
    name: '梅',
    nameEn: 'Plum Blossom',
    season: 'winter',
    flowerLanguage: '忍耐・高潔・不屈の精神',
    freeText: '試練を乗り越える力が湧き出る日。粘り強く取り組めば必ず道が開けます。',
    detail: {
      love: '簡単に諦めないことが大切。ゆっくりでも着実に関係を築いていって。',
      work: '困難な状況でも踏ん張れる日。今日の頑張りが後で大きな実りになります。',
      money: '節約と忍耐が実を結ぶ時期。地道な積み立てが将来の安心につながります。',
      health: '免疫力を高める食事を意識して。温かいものを食べて体の芯から温めて。',
      luckyColor: '白',
      luckyItem: '梅昆布茶',
    },
  },
  {
    id: 16,
    name: 'スイートピー',
    nameEn: 'Sweet Pea',
    season: 'spring',
    flowerLanguage: '門出・優しい思い出',
    freeText: '新しいステージへの一歩を踏み出す日。勇気を出して前へ。',
    detail: {
      love: '新しい出会いのために行動する日。出かける先で素敵な縁が待っています。',
      work: '新プロジェクトや新しい役割への適応力が高まる日。積極的に挑戦して。',
      money: '新しい口座や家計管理ツールを始めるのに良い日。お金の流れを整理して。',
      health: '新しい健康習慣を始める良いタイミング。小さなことから始めて続けることが大切。',
      luckyColor: 'パステルピンク',
      luckyItem: '新しい文具',
    },
  },
  {
    id: 17,
    name: 'ガーベラ',
    nameEn: 'Gerbera',
    season: 'summer',
    flowerLanguage: '希望・常に前向き',
    freeText: '前向きなエネルギーに満ちた日。ポジティブな言葉を意識して使って。',
    detail: {
      love: '笑顔と明るさが最大の武器。暗い話より楽しい話で場を盛り上げて。',
      work: 'ポジティブな提案が受け入れられやすい日。改善案やアイデアを提出するチャンス。',
      money: 'お金の流れが良くなる予感。宝くじや懸賞に運がある日かも。',
      health: '気持ちが体に影響する日。楽しいことを考えるだけで体調が上向きます。',
      luckyColor: '黄色',
      luckyItem: '明るい色のポーチ',
    },
  },
  {
    id: 18,
    name: '朝顔',
    nameEn: 'Morning Glory',
    season: 'summer',
    flowerLanguage: '愛着・結びつき',
    freeText: '大切なつながりを再確認する日。身近な人への感謝を忘れずに。',
    detail: {
      love: '長く続く関係に感謝する日。パートナーや好きな人への小さな気遣いを忘れずに。',
      work: '日々の積み重ねが評価される日。地道な努力が認められるタイミングです。',
      money: '定期的な支出の見直しをするのに良い日。無駄なサブスクがないか確認して。',
      health: '早起きして朝の時間を有効活用して。朝のルーティンが整うと一日が変わります。',
      luckyColor: '青紫',
      luckyItem: 'タイマー',
    },
  },
  {
    id: 19,
    name: '金木犀',
    nameEn: 'Osmanthus',
    season: 'autumn',
    flowerLanguage: '謙虚・真実',
    freeText: '誠実さが輝く日。飾らない言葉と行動が人の心を動かします。',
    detail: {
      love: '正直な気持ちを伝えるのに良い日。回りくどい表現より率直な言葉で。',
      work: '真摯な態度が信頼を勝ち取る日。ミスがあれば素直に認めることが大切。',
      money: '誠実な取引が吉。相手の立場に立った取引が長期的な利益につながります。',
      health: '香りのセラピーが効果的な日。好きな香りで気分を整えて。',
      luckyColor: 'オレンジ',
      luckyItem: '香水やフレグランス',
    },
  },
  {
    id: 20,
    name: 'ポインセチア',
    nameEn: 'Poinsettia',
    season: 'winter',
    flowerLanguage: '聖なる願い・祝福',
    freeText: '願いが叶いやすい日。心の中の大切な願いを意識して過ごして。',
    detail: {
      love: '真剣な気持ちで向き合うと関係が深まる日。大切な話をするのに良いタイミング。',
      work: '目標を再確認する日。ゴールを明確にすることで行動が変わります。',
      money: '大切なもののために貯める目標を決めると良い日。目的ある貯金が吉。',
      health: '心身を温める日。温かいお風呂にゆっくり浸かって体を癒して。',
      luckyColor: '赤と緑',
      luckyItem: 'キャンドル',
    },
  },
]

export function getSeasonFromMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}
