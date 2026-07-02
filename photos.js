/* =========================================================================
   写真リスト（ここに写真を登録します）
   -------------------------------------------------------------------------
   photos フォルダに画像ファイル（.jpg / .png / .webp など）を入れて、
   下のリストに1つ追加するだけで、ギャラリーに表示されます。

   { src: "photos/ファイル名", title: "タイトル", tag: "カテゴリ" }

   ・src   … photos フォルダからのパス（必須）
   ・title … 写真のタイトル（任意。ライトボックスで表示）
   ・tag   … カテゴリ（任意。上部フィルターに使われます 例: live / portrait）

   サンプルの .svg は、あなたの写真に差し替えて（または削除して）ください。
   ========================================================================= */
window.PHOTOS = [
  { src: "photos/sample-01.svg", title: "Sample 01", tag: "live" },
  { src: "photos/sample-02.svg", title: "Sample 02", tag: "portrait" },
  { src: "photos/sample-03.svg", title: "Sample 03", tag: "live" },
  { src: "photos/sample-04.svg", title: "Sample 04", tag: "portrait" },
  { src: "photos/sample-05.svg", title: "Sample 05", tag: "stage" },
  { src: "photos/sample-06.svg", title: "Sample 06", tag: "live" },
];
