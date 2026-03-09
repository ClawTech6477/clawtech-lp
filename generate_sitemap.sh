#!/bin/bash
# sitemap自動生成スクリプト
# 使い方: bash generate_sitemap.sh
# ブログ記事追加後に実行するだけで自動更新される

cd ~/clawtech-lp

TODAY=$(date +%Y-%m-%d)

# ---- ヘッダー ----
cat > sitemap.xml << XMLEOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- トップLP -->
  <url>
    <loc>https://clawtech6477.github.io/clawtech-lp/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- AI営業代行LP -->
  <url>
    <loc>https://clawtech6477.github.io/clawtech-lp/sales/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- ブログ一覧 -->
  <url>
    <loc>https://clawtech6477.github.io/clawtech-lp/blog/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

XMLEOF

# ---- blog/配下の.htmlを全自動スキャン ----
echo "  <!-- ブログ記事（自動生成） -->" >> sitemap.xml

for filepath in blog/*.html; do
    filename=$(basename "$filepath")
    
    # index.htmlはスキップ
    [ "$filename" = "index.html" ] && continue
    
    # ファイルの最終更新日を取得
    lastmod=$(git log -1 --format="%ai" -- "$filepath" 2>/dev/null | cut -c1-10)
    [ -z "$lastmod" ] && lastmod="$TODAY"
    
    cat >> sitemap.xml << XMLEOF
  <url>
    <loc>https://clawtech6477.github.io/clawtech-lp/blog/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

XMLEOF
    echo "  追加: ${filename} (${lastmod})"
done

# ---- フッター ----
echo "</urlset>" >> sitemap.xml

# ---- 結果表示 ----
COUNT=$(grep -c "<loc>" sitemap.xml)
echo ""
echo "✅ sitemap.xml 生成完了: ${COUNT}件のURL"
