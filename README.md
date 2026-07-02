# Habu Gallery

撮影した写真を「良い感じ」に展示するフォトギャラリーサイトです。
メーソンリー（高さ可変のグリッド）レイアウト＋ライトボックス（クリックで拡大）で構成しています。

公開URL: https://kanami-habu1122.github.io/gallery/

## 写真の登録方法（常設で公開する写真）

**フォルダに写真を入れて push するだけ** です。カテゴリごとにフォルダが分かれています:

```
photos/
  stage/     ← ステージの写真を入れる（カテゴリ "Stage"）
  signing/   ← サイン会の写真を入れる（カテゴリ "Signing"）
  other/     ← その他の写真を入れる（カテゴリ "Other"）
```

1. 写真ファイル（`.jpg` / `.png` / `.webp` など）を、対応するフォルダに入れる
2. コミットして push する

push すると GitHub Actions（[`.github/workflows/build-photos.yml`](.github/workflows/build-photos.yml)）が
自動で写真リスト（`photos.js`）を作り直し、数分で公開サイトに反映されます。
**`photos.js` は自動生成なので、手で編集しないでください。**

- 写真の**タイトル**はファイル名から自動で付きます（例: `natsu-live.jpg` → 「natsu live」）。
- **カテゴリ**はフォルダで決まります（`stage/` → Stage、`signing/` → Signing）。
- カテゴリを増やしたいときは、`photos/` に新しいフォルダを作り、
  [`scripts/build-photos.js`](scripts/build-photos.js) の `CATEGORIES` に1行足してください。

> 最初から入っている `sample-*.svg` はプレースホルダです。
> あなたの写真を入れたら、これらは削除してかまいません。

### 手元で確認したいとき

写真を入れたあとに `photos.js` をローカルでも更新したい場合は、次を実行します（Node が必要）:

```
node scripts/build-photos.js
```

## 「写真を並べてみる」機能について

サイト下部のドロップゾーンに写真をドラッグすると、その場でギャラリーに並べて見た目を試せます。
ただしこれは**閲覧者のブラウザ内だけ**に保存される機能で、サーバーには送られず、他の人には見えません。
（GitHub Pages は静的サイトのため、アップロードの永続保存はできません。常設公開は上記のフォルダ運用で行います。）

## ローカルで確認する

`index.html` をブラウザで開くだけで動作します（写真リストは `photos.js` から読み込むため、ローカルでもそのまま表示されます）。

## 構成

| ファイル / フォルダ | 役割 |
|---|---|
| `index.html` | ギャラリー本体（レイアウト・ライトボックス・追加機能） |
| `photos/stage/` | ステージの写真を入れる（カテゴリ Stage） |
| `photos/signing/` | サイン会の写真を入れる（カテゴリ Signing） |
| `photos/other/` | その他の写真を入れる（カテゴリ Other） |
| `photos.js` | 写真リスト（**自動生成・手編集しない**） |
| `scripts/build-photos.js` | フォルダから `photos.js` を作る生成スクリプト |
| `.github/workflows/build-photos.yml` | push 時に自動生成する GitHub Actions |
