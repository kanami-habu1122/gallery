/* =========================================================================
   photos.js を自動生成するスクリプト
   -------------------------------------------------------------------------
   photos/stage・photos/signing フォルダの中の画像ファイルを読み取って、
   ギャラリー用の写真リスト（photos.js）を作り直します。

   ・photos/stage   の画像 … カテゴリ "Stage"
   ・photos/signing の画像 … カテゴリ "Signing"

   通常は GitHub Actions が push のたびに自動実行します。
   手元で確認したいときは:  node scripts/build-photos.js
   ========================================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// フォルダ → カテゴリ名 の対応。カテゴリを増やすときはここに1行足す。
const CATEGORIES = [
  { dir: "photos/stage", tag: "Stage" },
  { dir: "photos/signing", tag: "Signing" },
];

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

function titleFromFilename(file) {
  return file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

const photos = [];
for (const cat of CATEGORIES) {
  const abs = path.join(ROOT, cat.dir);
  if (!fs.existsSync(abs)) continue;
  const files = fs.readdirSync(abs).filter((f) => IMAGE_EXT.test(f)).sort();
  for (const f of files) {
    photos.push({ src: cat.dir + "/" + f, title: titleFromFilename(f), tag: cat.tag });
  }
}

const banner =
  "/* ⚠ このファイルは自動生成されます（scripts/build-photos.js）。手で編集しないでください。\n" +
  "   photos/stage・photos/signing に画像を入れて push すると、\n" +
  "   GitHub Actions が自動でこのリストを作り直します。 */\n";

const body =
  "window.PHOTOS = [\n" +
  photos
    .map(
      (p) =>
        "  { src: " + JSON.stringify(p.src) +
        ", title: " + JSON.stringify(p.title) +
        ", tag: " + JSON.stringify(p.tag) + " },"
    )
    .join("\n") +
  "\n];\n";

fs.writeFileSync(path.join(ROOT, "photos.js"), banner + body);
console.log("photos.js updated: " + photos.length + " photos");
