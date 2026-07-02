/* =========================================================================
   photos.js と最適化画像を自動生成するスクリプト
   -------------------------------------------------------------------------
   photos/stage・photos/signing・photos/other フォルダの画像を読み取り、
   表示用に軽量化した画像を cache/ に作り、写真リスト（photos.js）を書き出す。

   ・一覧用サムネイル … cache/thumb/<カテゴリ>/  幅800px・軽量
   ・拡大用（大きめ）   … cache/large/<カテゴリ>/  幅2000px
   ・元のフル解像度は photos/ にそのまま残る

   カテゴリはフォルダで決まる:
     photos/stage   → "Stage"
     photos/signing → "Signing"
     photos/other   → "Other"

   通常は GitHub Actions が push のたびに自動実行する。
   手元で実行するとき:  npm install  →  node scripts/build-photos.js
   ========================================================================= */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");

const CATEGORIES = [
  { dir: "photos/stage", tag: "Stage" },
  { dir: "photos/signing", tag: "Signing" },
  { dir: "photos/other", tag: "Other" },
];

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

// 生成する画像サイズ（幅の上限・JPEG品質）
const THUMB = { base: "cache/thumb", width: 800, quality: 72 };
const LARGE = { base: "cache/large", width: 2000, quality: 80 };

function titleFromFilename(file) {
  return file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}
function toJpgName(file) {
  return file.replace(/\.[^.]+$/, "") + ".jpg";
}

async function generate(srcAbs, outRel, cfg) {
  const outAbs = path.join(ROOT, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  await sharp(srcAbs)
    .rotate() // EXIF の回転情報を反映
    .resize({ width: cfg.width, withoutEnlargement: true })
    .jpeg({ quality: cfg.quality, mozjpeg: true })
    .toFile(outAbs);
}

// cache/ から、今は存在しない写真の派生画像を掃除する
function cleanOrphans(base, keep) {
  const baseAbs = path.join(ROOT, base);
  if (!fs.existsSync(baseAbs)) return;
  for (const catDir of fs.readdirSync(baseAbs)) {
    const catAbs = path.join(baseAbs, catDir);
    if (!fs.statSync(catAbs).isDirectory()) continue;
    for (const file of fs.readdirSync(catAbs)) {
      const rel = base + "/" + catDir + "/" + file;
      if (!keep.has(rel)) {
        fs.unlinkSync(path.join(ROOT, rel));
        console.log("removed orphan: " + rel);
      }
    }
  }
}

(async () => {
  const photos = [];
  const keep = new Set();

  for (const cat of CATEGORIES) {
    const abs = path.join(ROOT, cat.dir);
    if (!fs.existsSync(abs)) continue;
    const catName = path.basename(cat.dir);
    const files = fs.readdirSync(abs).filter((f) => IMAGE_EXT.test(f)).sort();

    for (const f of files) {
      const srcAbs = path.join(abs, f);
      const thumbRel = THUMB.base + "/" + catName + "/" + toJpgName(f);
      const largeRel = LARGE.base + "/" + catName + "/" + toJpgName(f);

      await generate(srcAbs, thumbRel, THUMB);
      await generate(srcAbs, largeRel, LARGE);
      keep.add(thumbRel);
      keep.add(largeRel);

      photos.push({
        src: largeRel,
        thumb: thumbRel,
        title: titleFromFilename(f),
        tag: cat.tag,
      });
      console.log("optimized: " + cat.dir + "/" + f);
    }
  }

  cleanOrphans(THUMB.base, keep);
  cleanOrphans(LARGE.base, keep);

  const banner =
    "/* ⚠ このファイルは自動生成されます（scripts/build-photos.js）。手で編集しないでください。\n" +
    "   photos/stage・photos/signing・photos/other に画像を入れて push すると、\n" +
    "   GitHub Actions が自動でこのリストと最適化画像を作り直します。 */\n";

  const body =
    "window.PHOTOS = [\n" +
    photos
      .map(
        (p) =>
          "  { src: " + JSON.stringify(p.src) +
          ", thumb: " + JSON.stringify(p.thumb) +
          ", title: " + JSON.stringify(p.title) +
          ", tag: " + JSON.stringify(p.tag) + " },"
      )
      .join("\n") +
    "\n];\n";

  fs.writeFileSync(path.join(ROOT, "photos.js"), banner + body);
  console.log("photos.js updated: " + photos.length + " photos");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
