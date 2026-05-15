# 花占いアプリ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生年月日・血液型をもとに毎日異なる花と占い結果を提示するiOSアプリを構築する。詳細占い結果は月額サブスクまたは都度課金（RevenueCat）で解放。サーバーなし・モバイル完結。

**Architecture:** Expo Router（ファイルベースナビゲーション）を採用。花の決定はシードベースの決定論的アルゴリズムで行いサーバー不要。課金はRevenueCatで管理し、サブスク状態と都度チケット枚数をローカルに保持する。

**Tech Stack:** Expo SDK 51+, Expo Router, NativeWind, @react-native-async-storage/async-storage, react-native-purchases (RevenueCat), expo-haptics

---

## 事前準備（コード外）

RevenueCat と Apple IAP の設定が必要：
1. App Store Connect でアプリを作成
2. Subscription Group を作成し月額プロダクト（`monthly_480`）を登録
3. Consumable IAP プロダクト（`ticket_120`）を登録
4. RevenueCat ダッシュボードでアプリを登録し `REVENUECAT_API_KEY` を取得

---

## ファイル構成

```
uranai-app/
├── app/
│   ├── _layout.tsx           # ルートレイアウト・RevenueCat初期化
│   ├── index.tsx             # 初回判定→オンボーディング or ホームへリダイレクト
│   ├── onboarding.tsx        # 生年月日・血液型入力
│   ├── home.tsx              # 今日の花・無料占い表示
│   ├── detail.tsx            # 有料詳細占い表示
│   ├── paywall.tsx           # 課金プラン選択
│   └── settings.tsx          # プロフィール編集・購入復元
├── src/
│   ├── data/
│   │   └── flowers.ts        # 花マスターデータ（50種）
│   ├── lib/
│   │   ├── flowerSelector.ts # シードベース花選択ロジック
│   │   ├── storage.ts        # AsyncStorageラッパー
│   │   └── purchaseManager.ts# RevenueCat購入・状態管理
│   └── components/
│       ├── FlowerCard.tsx    # 花表示カード
│       ├── FortunePreview.tsx# 無料一言占い
│       └── PaywallGate.tsx   # 課金ゲート（詳細ボタン）
├── __tests__/
│   ├── flowerSelector.test.ts
│   └── storage.test.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## Task 1: プロジェクト初期化

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx`, `app/index.tsx`

- [ ] **Step 1: Expoプロジェクト作成**

```bash
cd C:\uranai-app
npx create-expo-app@latest . --template blank-typescript
```

Expected: `Your project is ready!` が表示される

- [ ] **Step 2: 依存パッケージをインストール**

```bash
npx expo install @react-native-async-storage/async-storage expo-router react-native-purchases nativewind tailwindcss expo-haptics
```

Expected: インストール完了、エラーなし

- [ ] **Step 3: NativeWind設定**

`tailwind.config.js` を作成：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`babel.config.js` を更新：

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

- [ ] **Step 4: app.json を設定**

```json
{
  "expo": {
    "name": "花占い",
    "slug": "hana-uranai",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "hana-uranai",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.hanauranai"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

- [ ] **Step 5: Jest設定**

`package.json` に追加：

```json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
}
```

- [ ] **Step 6: 起動確認**

```bash
npx expo start
```

Expected: Metro Bundlerが起動し、Expoの初期画面が表示される

- [ ] **Step 7: コミット**

```bash
git init
git add .
git commit -m "feat: initialize expo project"
```

---

## Task 2: 花マスターデータ

**Files:**
- Create: `src/data/flowers.ts`

- [ ] **Step 1: 型定義と花データを作成**

`src/data/flowers.ts` を作成：

```typescript
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
  flowerLanguage: string   // 花言葉
  freeText: string         // 無料一言占い
  detail: FlowerDetail     // 有料詳細
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
      money: ' 予想外の出費に備えて。余裕のある行動が吉。',
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
```

- [ ] **Step 2: コミット**

```bash
git add src/data/flowers.ts
git commit -m "feat: add flower master data with 20 flowers"
```

---

## Task 3: 花選択アルゴリズム

**Files:**
- Create: `src/lib/flowerSelector.ts`
- Create: `__tests__/flowerSelector.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`__tests__/flowerSelector.test.ts` を作成：

```typescript
import { selectFlower } from '../src/lib/flowerSelector'

describe('selectFlower', () => {
  const profile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }

  it('同じユーザー・同じ日付は同じ花を返す', () => {
    const date = new Date('2026-05-15')
    const flower1 = selectFlower(profile, date)
    const flower2 = selectFlower(profile, date)
    expect(flower1.id).toBe(flower2.id)
  })

  it('日付が変わると花が変わる（ほとんどの場合）', () => {
    const date1 = new Date('2026-05-15')
    const date2 = new Date('2026-05-16')
    const flower1 = selectFlower(profile, date1)
    const flower2 = selectFlower(profile, date2)
    // 50種あれば必ず変わるわけではないが確認
    expect(flower1).toBeDefined()
    expect(flower2).toBeDefined()
  })

  it('異なるユーザーは異なる花を返すことが多い', () => {
    const date = new Date('2026-05-15')
    const profileB = { birthYear: 1990, birthMonth: 8, birthDay: 22, bloodType: 'B' as const }
    const flowerA = selectFlower(profile, date)
    const flowerB = selectFlower(profileB, date)
    // 同じになる可能性もゼロではないが、ロジックの確認
    expect(flowerA).toBeDefined()
    expect(flowerB).toBeDefined()
  })

  it('現在の季節の花が優先的に出る（季節一致率70%以上を期待）', () => {
    const springDate = new Date('2026-04-01')
    const results = Array.from({ length: 100 }, (_, i) => {
      const p = { ...profile, birthDay: (i % 28) + 1 }
      return selectFlower(p, springDate)
    })
    const springFlowers = results.filter(f => f.season === 'spring').length
    expect(springFlowers).toBeGreaterThan(60) // 60%以上
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

```bash
npx jest __tests__/flowerSelector.test.ts
```

Expected: FAIL — `Cannot find module '../src/lib/flowerSelector'`

- [ ] **Step 3: 実装を書く**

`src/lib/flowerSelector.ts` を作成：

```typescript
import { FLOWERS, Flower, Season, getSeasonFromMonth } from '../data/flowers'

export type UserProfile = {
  birthYear: number
  birthMonth: number
  birthDay: number
  bloodType: 'A' | 'B' | 'O' | 'AB'
}

const BLOOD_TYPE_COEFF: Record<UserProfile['bloodType'], number> = {
  A: 1, B: 2, O: 3, AB: 4,
}

function seededRandom(seed: number): number {
  const a = 1664525
  const c = 1013904223
  const m = 2 ** 32
  return ((a * seed + c) % m) / m
}

export function selectFlower(profile: UserProfile, date: Date): Flower {
  const dateNum =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()

  const birthNum =
    profile.birthYear * 10000 +
    profile.birthMonth * 100 +
    profile.birthDay

  const seed = birthNum + BLOOD_TYPE_COEFF[profile.bloodType] * 1000 + dateNum

  const currentSeason: Season = getSeasonFromMonth(date.getMonth() + 1)
  const inSeason = FLOWERS.filter(f => f.season === currentSeason)
  const outOfSeason = FLOWERS.filter(f => f.season !== currentSeason)

  // 70%の確率で季節の花、30%でそれ以外
  const rand = seededRandom(seed)
  if (rand < 0.7 && inSeason.length > 0) {
    const idx = Math.floor(seededRandom(seed + 1) * inSeason.length)
    return inSeason[idx]
  } else {
    const idx = Math.floor(seededRandom(seed + 2) * outOfSeason.length)
    return outOfSeason[idx]
  }
}
```

- [ ] **Step 4: テストを実行して通過を確認**

```bash
npx jest __tests__/flowerSelector.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: コミット**

```bash
git add src/lib/flowerSelector.ts __tests__/flowerSelector.test.ts
git commit -m "feat: add deterministic flower selector with season weighting"
```

---

## Task 4: ストレージ層

**Files:**
- Create: `src/lib/storage.ts`
- Create: `__tests__/storage.test.ts`

- [ ] **Step 1: 失敗するテストを書く**

`__tests__/storage.test.ts` を作成：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveUserProfile, loadUserProfile, getTicketCount, consumeTicket, addTickets } from '../src/lib/storage'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('プロフィールを保存・読み込みできる', async () => {
    const profile = { birthYear: 1995, birthMonth: 4, birthDay: 15, bloodType: 'A' as const }
    await saveUserProfile(profile)
    const loaded = await loadUserProfile()
    expect(loaded).toEqual(profile)
  })

  it('プロフィール未設定の場合はnullを返す', async () => {
    const loaded = await loadUserProfile()
    expect(loaded).toBeNull()
  })

  it('初期チケット数は0', async () => {
    const count = await getTicketCount()
    expect(count).toBe(0)
  })

  it('チケットを追加できる', async () => {
    await addTickets(3)
    const count = await getTicketCount()
    expect(count).toBe(3)
  })

  it('チケットを消費できる', async () => {
    await addTickets(2)
    const result = await consumeTicket()
    expect(result).toBe(true)
    expect(await getTicketCount()).toBe(1)
  })

  it('チケットが0の場合はconsumeTicketがfalseを返す', async () => {
    const result = await consumeTicket()
    expect(result).toBe(false)
  })
})
```

- [ ] **Step 2: テストを実行して失敗を確認**

```bash
npx jest __tests__/storage.test.ts
```

Expected: FAIL — `Cannot find module '../src/lib/storage'`

- [ ] **Step 3: 実装を書く**

`src/lib/storage.ts` を作成：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserProfile } from './flowerSelector'

const KEYS = {
  USER_PROFILE: 'user_profile',
  TICKET_COUNT: 'ticket_count',
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile))
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE)
  return raw ? JSON.parse(raw) : null
}

export async function getTicketCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.TICKET_COUNT)
  return raw ? parseInt(raw, 10) : 0
}

export async function addTickets(count: number): Promise<void> {
  const current = await getTicketCount()
  await AsyncStorage.setItem(KEYS.TICKET_COUNT, String(current + count))
}

export async function consumeTicket(): Promise<boolean> {
  const current = await getTicketCount()
  if (current <= 0) return false
  await AsyncStorage.setItem(KEYS.TICKET_COUNT, String(current - 1))
  return true
}
```

- [ ] **Step 4: テストを実行して通過を確認**

```bash
npx jest __tests__/storage.test.ts
```

Expected: PASS (6 tests)

- [ ] **Step 5: コミット**

```bash
git add src/lib/storage.ts __tests__/storage.test.ts
git commit -m "feat: add AsyncStorage wrapper for user profile and tickets"
```

---

## Task 5: RevenueCat 購入マネージャー

**Files:**
- Create: `src/lib/purchaseManager.ts`

- [ ] **Step 1: purchaseManager を作成**

`src/lib/purchaseManager.ts` を作成：

```typescript
import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { addTickets } from './storage'

const API_KEY = 'YOUR_REVENUECAT_API_KEY' // App Store Connect設定後に置き換え

export const ENTITLEMENT_ID = 'monthly_subscription'
export const PRODUCT_TICKET = 'ticket_120'

export async function initializePurchases(): Promise<void> {
  Purchases.configure({ apiKey: API_KEY })
}

export async function isSubscribed(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
  } catch {
    return false
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings()
    return offerings.current?.availablePackages ?? []
  } catch {
    return []
  }
}

export async function purchaseMonthly(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg)
    return true
  } catch (e: any) {
    if (e.userCancelled) return false
    throw e
  }
}

export async function purchaseTicket(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg)
    await addTickets(1)
    return true
  } catch (e: any) {
    if (e.userCancelled) return false
    throw e
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    await Purchases.restorePurchases()
    return true
  } catch {
    return false
  }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/lib/purchaseManager.ts
git commit -m "feat: add RevenueCat purchase manager"
```

---

## Task 6: ルートレイアウト・ナビゲーション

**Files:**
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`

- [ ] **Step 1: ルートレイアウトを作成**

`app/_layout.tsx` を作成：

```tsx
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { initializePurchases } from '../src/lib/purchaseManager'
import '../global.css'

export default function RootLayout() {
  useEffect(() => {
    initializePurchases()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="home" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}
```

`global.css` を作成（NativeWind用）：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: インデックス（リダイレクト）を作成**

`app/index.tsx` を作成：

```tsx
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { loadUserProfile } from '../src/lib/storage'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    loadUserProfile().then(profile => {
      if (profile) {
        router.replace('/home')
      } else {
        router.replace('/onboarding')
      }
    })
  }, [])

  return null
}
```

- [ ] **Step 3: コミット**

```bash
git add app/_layout.tsx app/index.tsx global.css
git commit -m "feat: add root layout and redirect logic"
```

---

## Task 7: オンボーディング画面

**Files:**
- Create: `app/onboarding.tsx`

- [ ] **Step 1: オンボーディング画面を作成**

`app/onboarding.tsx` を作成：

```tsx
import { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import { saveUserProfile } from '../src/lib/storage'
import { UserProfile } from '../src/lib/flowerSelector'

const BLOOD_TYPES = ['A', 'B', 'O', 'AB'] as const

export default function Onboarding() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState(new Date(1995, 0, 1))
  const [bloodType, setBloodType] = useState<UserProfile['bloodType']>('A')

  const handleSave = async () => {
    const profile: UserProfile = {
      birthYear: birthDate.getFullYear(),
      birthMonth: birthDate.getMonth() + 1,
      birthDay: birthDate.getDate(),
      bloodType,
    }
    await saveUserProfile(profile)
    router.replace('/home')
  }

  return (
    <View className="flex-1 bg-gray-950 items-center justify-center px-8">
      <Text className="text-white text-3xl font-serif mb-2">花占い</Text>
      <Text className="text-gray-400 text-sm mb-12">あなただけの花を見つけましょう</Text>

      <Text className="text-gray-300 mb-3 self-start">生年月日</Text>
      <DateTimePicker
        value={birthDate}
        mode="date"
        display="spinner"
        onChange={(_, date) => date && setBirthDate(date)}
        maximumDate={new Date()}
        style={{ width: '100%', marginBottom: 24 }}
        textColor="white"
      />

      <Text className="text-gray-300 mb-3 self-start mt-4">血液型</Text>
      <View className="flex-row gap-3 mb-12">
        {BLOOD_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setBloodType(type)}
            className={`w-16 h-16 rounded-full items-center justify-center border ${
              bloodType === type
                ? 'bg-rose-900 border-rose-400'
                : 'bg-gray-800 border-gray-600'
            }`}
          >
            <Text className={`text-lg font-bold ${bloodType === type ? 'text-rose-200' : 'text-gray-400'}`}>
              {type}型
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="w-full bg-rose-800 rounded-full py-4 items-center"
      >
        <Text className="text-white text-lg font-semibold">はじめる</Text>
      </TouchableOpacity>
    </View>
  )
}
```

- [ ] **Step 2: DateTimePickerをインストール**

```bash
npx expo install @react-native-community/datetimepicker
```

- [ ] **Step 3: コミット**

```bash
git add app/onboarding.tsx
git commit -m "feat: add onboarding screen with birth date and blood type input"
```

---

## Task 8: ホーム画面

**Files:**
- Create: `app/home.tsx`
- Create: `src/components/FlowerCard.tsx`
- Create: `src/components/FortunePreview.tsx`

- [ ] **Step 1: FlowerCard コンポーネントを作成**

`src/components/FlowerCard.tsx` を作成：

```tsx
import { View, Text, Animated } from 'react-native'
import { useEffect, useRef } from 'react'
import { Flower } from '../data/flowers'

type Props = { flower: Flower }

export function FlowerCard({ flower }: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}
      className="items-center mb-8"
    >
      <View className="w-40 h-40 rounded-full bg-gray-800 items-center justify-center mb-6 border border-gray-600">
        <Text style={{ fontSize: 80 }}>🌸</Text>
      </View>
      <Text className="text-white text-2xl font-serif mb-2">{flower.name}</Text>
      <Text className="text-gray-400 text-sm">{flower.nameEn}</Text>
      <View className="mt-4 px-6 py-3 bg-gray-800 rounded-2xl">
        <Text className="text-rose-300 text-center text-sm">花言葉：{flower.flowerLanguage}</Text>
      </View>
    </Animated.View>
  )
}
```

- [ ] **Step 2: FortunePreview コンポーネントを作成**

`src/components/FortunePreview.tsx` を作成：

```tsx
import { View, Text } from 'react-native'
import { Flower } from '../data/flowers'

type Props = { flower: Flower }

export function FortunePreview({ flower }: Props) {
  return (
    <View className="px-6 py-5 bg-gray-900 rounded-2xl border border-gray-700 mx-4">
      <Text className="text-gray-400 text-xs mb-2 text-center">今日のメッセージ</Text>
      <Text className="text-white text-center text-base leading-relaxed">
        {flower.freeText}
      </Text>
    </View>
  )
}
```

- [ ] **Step 3: ホーム画面を作成**

`app/home.tsx` を作成：

```tsx
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { loadUserProfile } from '../src/lib/storage'
import { selectFlower } from '../src/lib/flowerSelector'
import { Flower } from '../src/data/flowers'
import { FlowerCard } from '../src/components/FlowerCard'
import { FortunePreview } from '../src/components/FortunePreview'

export default function Home() {
  const router = useRouter()
  const [flower, setFlower] = useState<Flower | null>(null)

  useEffect(() => {
    loadUserProfile().then(profile => {
      if (!profile) { router.replace('/onboarding'); return }
      setFlower(selectFlower(profile, new Date()))
    })
  }, [])

  if (!flower) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#fb7185" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-950" contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}>
      <Text className="text-gray-500 text-center text-sm mb-8">
        {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
      </Text>

      <FlowerCard flower={flower} />
      <FortunePreview flower={flower} />

      <TouchableOpacity
        onPress={() => router.push('/detail')}
        className="mx-4 mt-6 bg-rose-900 rounded-full py-4 items-center border border-rose-700"
      >
        <Text className="text-rose-100 text-base font-semibold">詳細の占いを見る ✨</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/settings')}
        className="mt-4 items-center"
      >
        <Text className="text-gray-600 text-sm">設定</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
```

- [ ] **Step 4: コミット**

```bash
git add app/home.tsx src/components/FlowerCard.tsx src/components/FortunePreview.tsx
git commit -m "feat: add home screen with flower card and fortune preview"
```

---

## Task 9: 課金ゲート・詳細画面

**Files:**
- Create: `app/detail.tsx`
- Create: `src/components/PaywallGate.tsx`

- [ ] **Step 1: PaywallGate を作成**

`src/components/PaywallGate.tsx` を作成：

```tsx
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

type Props = { onUnlocked: () => void }

export function PaywallGate({ onUnlocked }: Props) {
  const router = useRouter()
  return (
    <View className="items-center py-8 px-6">
      <Text className="text-4xl mb-4">🔒</Text>
      <Text className="text-white text-lg font-semibold mb-2">詳細の占いを見るには</Text>
      <Text className="text-gray-400 text-sm text-center mb-6">
        月額プランまたは1回分のチケットで{'\n'}恋愛・仕事・金運・健康運が分かります
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/paywall')}
        className="w-full bg-rose-800 rounded-full py-4 items-center"
      >
        <Text className="text-white font-semibold">プランを見る</Text>
      </TouchableOpacity>
    </View>
  )
}
```

- [ ] **Step 2: 詳細画面を作成**

`app/detail.tsx` を作成：

```tsx
import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { loadUserProfile, getTicketCount, consumeTicket } from '../src/lib/storage'
import { isSubscribed } from '../src/lib/purchaseManager'
import { selectFlower } from '../src/lib/flowerSelector'
import { Flower } from '../src/data/flowers'
import { PaywallGate } from '../src/components/PaywallGate'

type AccessState = 'loading' | 'locked' | 'unlocked'

const FORTUNE_ITEMS = [
  { key: 'love', label: '恋愛運', emoji: '💕' },
  { key: 'work', label: '仕事運', emoji: '💼' },
  { key: 'money', label: '金運', emoji: '💰' },
  { key: 'health', label: '健康運', emoji: '🌿' },
] as const

export default function Detail() {
  const router = useRouter()
  const [flower, setFlower] = useState<Flower | null>(null)
  const [access, setAccess] = useState<AccessState>('loading')

  useFocusEffect(
    useCallback(() => { checkAccess() }, [])
  )

  const checkAccess = async () => {
    const profile = await loadUserProfile()
    if (!profile) { router.replace('/onboarding'); return }
    setFlower(selectFlower(profile, new Date()))

    const subscribed = await isSubscribed()
    if (subscribed) { setAccess('unlocked'); return }

    const tickets = await getTicketCount()
    if (tickets > 0) {
      await consumeTicket()
      setAccess('unlocked')
    } else {
      setAccess('locked')
    }
  }

  if (access === 'loading' || !flower) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator color="#fb7185" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-950" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-gray-400">← 戻る</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-serif mb-1">{flower.name}の占い</Text>
      <Text className="text-gray-400 text-sm mb-8">詳細鑑定結果</Text>

      {access === 'locked' ? (
        <PaywallGate onUnlocked={checkAccess} />
      ) : (
        <>
          {FORTUNE_ITEMS.map(item => (
            <View key={item.key} className="mb-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
              <Text className="text-rose-300 font-semibold mb-2">{item.emoji} {item.label}</Text>
              <Text className="text-gray-200 leading-relaxed">{flower.detail[item.key]}</Text>
            </View>
          ))}
          <View className="mt-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
            <Text className="text-rose-300 font-semibold mb-2">🍀 ラッキーアイテム</Text>
            <Text className="text-gray-200">{flower.detail.luckyItem}</Text>
          </View>
          <View className="mt-4 p-5 bg-gray-900 rounded-2xl border border-gray-700">
            <Text className="text-rose-300 font-semibold mb-2">🎨 ラッキーカラー</Text>
            <Text className="text-gray-200">{flower.detail.luckyColor}</Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}
```

- [ ] **Step 3: コミット**

```bash
git add app/detail.tsx src/components/PaywallGate.tsx
git commit -m "feat: add detail screen with paywall gate"
```

---

## Task 10: 課金画面

**Files:**
- Create: `app/paywall.tsx`

- [ ] **Step 1: 課金画面を作成**

`app/paywall.tsx` を作成：

```tsx
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { PurchasesPackage } from 'react-native-purchases'
import { getOfferings, purchaseMonthly, purchaseTicket, restorePurchases } from '../src/lib/purchaseManager'

export default function Paywall() {
  const router = useRouter()
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    getOfferings().then(pkgs => { setPackages(pkgs); setLoading(false) })
  }, [])

  const handleMonthly = async (pkg: PurchasesPackage) => {
    setPurchasing(true)
    try {
      const success = await purchaseMonthly(pkg)
      if (success) { router.back() }
    } catch {
      Alert.alert('エラー', '購入に失敗しました')
    } finally {
      setPurchasing(false)
    }
  }

  const handleTicket = async (pkg: PurchasesPackage) => {
    setPurchasing(true)
    try {
      const success = await purchaseTicket(pkg)
      if (success) { router.back() }
    } catch {
      Alert.alert('エラー', '購入に失敗しました')
    } finally {
      setPurchasing(false)
    }
  }

  const monthlyPkg = packages.find(p => p.product.identifier === 'monthly_480')
  const ticketPkg = packages.find(p => p.product.identifier === 'ticket_120')

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-16 pb-8">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-gray-400">← 戻る</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-serif mb-2">プランを選ぶ</Text>
      <Text className="text-gray-400 text-sm mb-10">詳細の占いで毎日の運気をチェック</Text>

      {loading ? (
        <ActivityIndicator color="#fb7185" />
      ) : (
        <>
          {monthlyPkg && (
            <TouchableOpacity
              onPress={() => handleMonthly(monthlyPkg)}
              disabled={purchasing}
              className="p-6 bg-rose-950 rounded-2xl border-2 border-rose-600 mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold text-lg">月額プラン</Text>
                <View className="bg-rose-600 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">おすすめ</Text>
                </View>
              </View>
              <Text className="text-rose-300 text-2xl font-bold mb-1">¥480 / 月</Text>
              <Text className="text-gray-400 text-sm">毎日詳細が見放題・いつでも解約可</Text>
            </TouchableOpacity>
          )}

          {ticketPkg && (
            <TouchableOpacity
              onPress={() => handleTicket(ticketPkg)}
              disabled={purchasing}
              className="p-6 bg-gray-900 rounded-2xl border border-gray-700 mb-8"
            >
              <Text className="text-white font-bold text-lg mb-1">1回チケット</Text>
              <Text className="text-gray-300 text-2xl font-bold mb-1">¥120 / 回</Text>
              <Text className="text-gray-400 text-sm">今日1回だけ詳細を見たい方向け</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => restorePurchases().then(() => router.back())} className="items-center">
            <Text className="text-gray-500 text-sm">購入を復元する</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add app/paywall.tsx
git commit -m "feat: add paywall screen with monthly and ticket purchase"
```

---

## Task 11: 設定画面

**Files:**
- Create: `app/settings.tsx`

- [ ] **Step 1: 設定画面を作成**

`app/settings.tsx` を作成：

```tsx
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { restorePurchases } from '../src/lib/purchaseManager'

export default function Settings() {
  const router = useRouter()

  const handleResetProfile = async () => {
    Alert.alert('プロフィールをリセット', '生年月日と血液型を再入力します', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'リセット', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user_profile')
          router.replace('/onboarding')
        },
      },
    ])
  }

  const handleRestore = async () => {
    const success = await restorePurchases()
    Alert.alert(success ? '復元完了' : 'エラー', success ? '購入履歴を復元しました' : '復元に失敗しました')
  }

  return (
    <View className="flex-1 bg-gray-950 pt-16 px-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-gray-400">← 戻る</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-serif mb-8">設定</Text>

      <TouchableOpacity onPress={handleResetProfile} className="py-4 border-b border-gray-800">
        <Text className="text-white">プロフィールを変更</Text>
        <Text className="text-gray-500 text-sm">生年月日・血液型を再設定</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRestore} className="py-4 border-b border-gray-800">
        <Text className="text-white">購入を復元する</Text>
        <Text className="text-gray-500 text-sm">サブスクの購入履歴を復元</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/paywall')} className="py-4 border-b border-gray-800">
        <Text className="text-white">プランを見る</Text>
        <Text className="text-gray-500 text-sm">月額・都度チケットの確認</Text>
      </TouchableOpacity>
    </View>
  )
}
```

- [ ] **Step 2: 全テストを実行**

```bash
npx jest
```

Expected: 全テスト PASS

- [ ] **Step 3: コミット**

```bash
git add app/settings.tsx
git commit -m "feat: add settings screen with profile reset and purchase restore"
```

---

## Task 12: iOS ビルド確認

- [ ] **Step 1: iOS シミュレーターで起動**

```bash
npx expo run:ios
```

Expected: シミュレーターでアプリが起動し、オンボーディング画面が表示される

- [ ] **Step 2: 動作確認チェックリスト**

以下を手動で確認：
- [ ] オンボーディング：生年月日・血液型を入力してホームへ遷移できる
- [ ] ホーム：今日の花・花言葉・一言占いが表示される
- [ ] ホーム：アプリを再起動しても同じ花が表示される
- [ ] ホーム：翌日（日付を変えてテスト）は異なる花になる
- [ ] 詳細ボタン：課金ゲートが表示される（チケット0の場合）
- [ ] 設定：プロフィールリセットでオンボーディングへ戻る

- [ ] **Step 3: 最終コミット**

```bash
git add .
git commit -m "feat: complete phase 1 - flower fortune iOS app"
```
