# 花占い claudecode

花と運命の占いアプリ。生年月日・血液型から毎日の花を選び、花言葉と運勢を届ける iOS アプリ。

## 必要な環境

- Node.js 18 以上
- npm
- [Expo Go](https://expo.dev/go) アプリ（iPhone にインストール）

## セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/kotapo1530/uranai_claudecode.git
cd uranai_claudecode

# 2. 依存パッケージをインストール
npm install --legacy-peer-deps

# 3. 開発サーバー起動
npm start
```

起動後にターミナルに QR コードが表示されます。iPhone の Expo Go アプリでスキャンすれば実機で確認できます。

## 開発モードの挙動

`__DEV__` フラグが `true` の間は以下の動作になります。

- 「今日の花を占う」ボタンは常に表示（1日1回制限なし）
- ボタンを押すたびにランダムな花を表示
- 詳細画面のペイウォール（RevenueCat IAP）をスキップして直接表示

## テスト実行

```bash
npm test
```

## 主な技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native / Expo SDK 54 |
| ナビゲーション | Expo Router（ファイルベース） |
| スタイリング | NativeWind v2.0.11（Tailwind CSS） |
| ストレージ | AsyncStorage |
| IAP | RevenueCat（Expo Go 内はモック） |
