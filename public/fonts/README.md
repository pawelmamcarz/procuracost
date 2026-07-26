# Fonts

`NotoSans-{Regular,Bold}-subset.ttf` — Noto Sans, SIL Open Font License 1.1, subsetted to
Latin + Latin Extended-A plus the punctuation and symbols the PDF export actually uses
(~23 KB per weight, down from ~569 KB).

They exist because jsPDF's built-in Helvetica is WinAnsi and has no Polish diacritics, so
the exported report rendered every ą ć ę ł ń ó ś ź ż and every "zł" as mojibake.

`components/PDFExport.tsx` fetches them at export time rather than importing them, so they
never enter the page bundle.

Regenerate with:

```bash
python3 -m fontTools.subset NotoSans-Regular.ttf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0100-017F,U+2010-2015,U+2018-201F,U+2020-2022,U+2026,U+2030,U+20AC,U+2212,U+00D7,U+2265,U+2264,U+0394,U+03A6,U+2202" \
  --layout-features='' --no-hinting --desubroutinize \
  --output-file=NotoSans-Regular-subset.ttf
```
