export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type Flower = {
  id: number
  name: string
  nameEn: string
  emoji: string
  season: Season
  flowerLanguage: string
}

export const FLOWERS: Flower[] = [
  { id: 1,  name: '桜',           nameEn: 'Cherry Blossom',    emoji: '🌸', season: 'spring', flowerLanguage: '優美な女性・精神の美しさ' },
  { id: 2,  name: 'チューリップ', nameEn: 'Tulip',             emoji: '🌷', season: 'spring', flowerLanguage: '思いやり・博愛' },
  { id: 3,  name: 'スミレ',       nameEn: 'Violet',            emoji: '💜', season: 'spring', flowerLanguage: '誠実・小さな幸せ' },
  { id: 4,  name: '菜の花',       nameEn: 'Rapeseed',          emoji: '🌼', season: 'spring', flowerLanguage: '快活・明るさ' },
  { id: 5,  name: '藤',           nameEn: 'Wisteria',          emoji: '🌿', season: 'spring', flowerLanguage: '歓迎・優しさ' },
  { id: 6,  name: '向日葵',       nameEn: 'Sunflower',         emoji: '🌻', season: 'summer', flowerLanguage: '憧れ・あなたを見つめている' },
  { id: 7,  name: '紫陽花',       nameEn: 'Hydrangea',         emoji: '💐', season: 'summer', flowerLanguage: '移り気・辛抱強い愛情' },
  { id: 8,  name: '百合',         nameEn: 'Lily',              emoji: '🤍', season: 'summer', flowerLanguage: '純粋・無垢' },
  { id: 9,  name: 'ラベンダー',   nameEn: 'Lavender',          emoji: '🪻', season: 'summer', flowerLanguage: '沈黙・あなたを待っています' },
  { id: 10, name: 'コスモス',     nameEn: 'Cosmos',            emoji: '🌺', season: 'autumn', flowerLanguage: '乙女の純潔・調和' },
  { id: 11, name: '菊',           nameEn: 'Chrysanthemum',     emoji: '🏵️', season: 'autumn', flowerLanguage: '高貴・高潔' },
  { id: 12, name: 'ダリア',       nameEn: 'Dahlia',            emoji: '🌹', season: 'autumn', flowerLanguage: '華麗・優雅' },
  { id: 13, name: '椿',           nameEn: 'Camellia',          emoji: '🌺', season: 'winter', flowerLanguage: '申し分のない魅力・完璧な美しさ' },
  { id: 14, name: '水仙',         nameEn: 'Narcissus',         emoji: '🌼', season: 'winter', flowerLanguage: '自己愛・神秘' },
  { id: 15, name: '梅',           nameEn: 'Plum Blossom',      emoji: '🌸', season: 'winter', flowerLanguage: '忍耐・高潔・不屈の精神' },
  { id: 16, name: 'スイートピー', nameEn: 'Sweet Pea',         emoji: '🌸', season: 'spring', flowerLanguage: '門出・優しい思い出' },
  { id: 17, name: 'ガーベラ',     nameEn: 'Gerbera',           emoji: '🌻', season: 'summer', flowerLanguage: '希望・常に前向き' },
  { id: 18, name: '朝顔',         nameEn: 'Morning Glory',     emoji: '🌸', season: 'summer', flowerLanguage: '愛着・結びつき' },
  { id: 19, name: '金木犀',       nameEn: 'Osmanthus',         emoji: '🍂', season: 'autumn', flowerLanguage: '謙虚・真実' },
  { id: 20, name: 'ポインセチア', nameEn: 'Poinsettia',        emoji: '🎄', season: 'winter', flowerLanguage: '聖なる願い・祝福' },
  { id: 21, name: 'バラ',         nameEn: 'Rose',              emoji: '🌹', season: 'summer', flowerLanguage: '愛・美・情熱' },
  { id: 22, name: 'カーネーション', nameEn: 'Carnation',       emoji: '🌸', season: 'spring', flowerLanguage: '母への愛・感謝' },
  { id: 23, name: 'ペチュニア',   nameEn: 'Petunia',           emoji: '🌸', season: 'summer', flowerLanguage: '心が和らぐ・あなたといると心地よい' },
  { id: 24, name: 'クレマチス',   nameEn: 'Clematis',          emoji: '💜', season: 'spring', flowerLanguage: '精神の美・旅人の喜び' },
  { id: 25, name: 'マーガレット', nameEn: 'Marguerite',        emoji: '🌼', season: 'spring', flowerLanguage: '恋占い・真実の愛' },
  { id: 26, name: 'ポピー',       nameEn: 'Poppy',             emoji: '🌺', season: 'spring', flowerLanguage: '慰め・忘却・眠り' },
  { id: 27, name: 'アネモネ',     nameEn: 'Anemone',           emoji: '🌸', season: 'spring', flowerLanguage: '儚い恋・期待' },
  { id: 28, name: 'フリージア',   nameEn: 'Freesia',           emoji: '🌼', season: 'spring', flowerLanguage: '無邪気・親愛の情' },
  { id: 29, name: 'ミモザ',       nameEn: 'Mimosa',            emoji: '🌼', season: 'spring', flowerLanguage: '感謝・思いやり・友情' },
  { id: 30, name: '桔梗',         nameEn: 'Bellflower',        emoji: '💜', season: 'autumn', flowerLanguage: '清楚・誠実・永遠の愛' },
  { id: 31, name: '彼岸花',       nameEn: 'Red Spider Lily',   emoji: '🌺', season: 'autumn', flowerLanguage: '悲しい思い出・また会う日まで' },
  { id: 32, name: 'リンドウ',     nameEn: 'Gentian',           emoji: '💜', season: 'autumn', flowerLanguage: '悲しんでいるあなたを愛する・正義' },
  { id: 33, name: '秋桜（大輪）', nameEn: 'Large Cosmos',      emoji: '🌸', season: 'autumn', flowerLanguage: '少女の純潔・乙女心' },
  { id: 34, name: '千日紅',       nameEn: 'Globe Amaranth',    emoji: '🌸', season: 'summer', flowerLanguage: '変わらぬ愛・不滅' },
  { id: 35, name: 'ジニア',       nameEn: 'Zinnia',            emoji: '🌺', season: 'summer', flowerLanguage: '亡き友を思う・遠くの友を思う' },
  { id: 36, name: 'マリーゴールド', nameEn: 'Marigold',        emoji: '🌼', season: 'summer', flowerLanguage: '嫉妬・悲しみ・変わらぬ愛' },
  { id: 37, name: 'ハイビスカス', nameEn: 'Hibiscus',          emoji: '🌺', season: 'summer', flowerLanguage: '繊細な美しさ・新しい恋' },
  { id: 38, name: 'ブーゲンビリア', nameEn: 'Bougainvillea',   emoji: '🌸', season: 'summer', flowerLanguage: '情熱・あなたは魅力的' },
  { id: 39, name: 'プルメリア',   nameEn: 'Plumeria',          emoji: '🌸', season: 'summer', flowerLanguage: '恵まれた人・気品' },
  { id: 40, name: 'スノードロップ', nameEn: 'Snowdrop',        emoji: '🤍', season: 'winter', flowerLanguage: '希望・慰め・純潔' },
  { id: 41, name: 'クリスマスローズ', nameEn: 'Christmas Rose', emoji: '🌸', season: 'winter', flowerLanguage: 'いたわり・追憶・私の不安を和らげて' },
  { id: 42, name: 'シクラメン',   nameEn: 'Cyclamen',          emoji: '🌸', season: 'winter', flowerLanguage: '遠慮・はにかみ・内気な愛' },
  { id: 43, name: 'パンジー',     nameEn: 'Pansy',             emoji: '💜', season: 'winter', flowerLanguage: '思慮深い・私を思って' },
  { id: 44, name: 'ロウバイ',     nameEn: 'Wintersweet',       emoji: '🌼', season: 'winter', flowerLanguage: '先導・慈愛・ゆかしさ' },
  { id: 45, name: '福寿草',       nameEn: 'Adonis',            emoji: '🌼', season: 'winter', flowerLanguage: '幸福・長寿・永遠の幸せ' },
  { id: 46, name: 'ハナミズキ',   nameEn: 'Dogwood',           emoji: '🌸', season: 'spring', flowerLanguage: '返礼・永続性・私の想いを受けてください' },
  { id: 47, name: 'シャクナゲ',   nameEn: 'Rhododendron',      emoji: '🌸', season: 'spring', flowerLanguage: '威厳・荘厳・危険に気をつけて' },
  { id: 48, name: 'ルピナス',     nameEn: 'Lupine',            emoji: '💜', season: 'spring', flowerLanguage: '貪欲・想像力・あなたは私の安らぎ' },
  { id: 49, name: 'カキツバタ',   nameEn: 'Rabbit-ear Iris',   emoji: '💜', season: 'spring', flowerLanguage: '幸運が来る・贈り物' },
  { id: 50, name: '芍薬',         nameEn: 'Peony',             emoji: '🌸', season: 'spring', flowerLanguage: '恥じらい・誠実・幸運' },
]

export function getSeasonFromMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}
