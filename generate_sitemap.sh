#!/bin/bash
# sitemap自動生成スクリプト
# ★ドメイン変更時はBASE_URLだけ書き換えればOK★

BASE_URL="https://clawtech6477.github.io/clawtech-lp"

cd ~/clawtech-lp
TODAY=$(date +%Y-%m-%d)

cat > sitemap.xml << XMLEOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${BASE_URL}/sales/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${BASE_URL}/blog/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

XMLEOF


for filepath in blog/*.html; do
    filename=$(basename "$filepath")
    [ "$filename" = "index.html" ] && continue

    lastmod=$(git log -1 --format="%ai" -- "$filepath" 2>/dev/null | cut -c1-10)
    [ -z "$lastmod" ] && lastmod="$TODAY"

    cat >> sitemap.xml << XMLEOF
  <url>
    <loc>${BASE_URL}/blog/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

XMLEOF
    echo "  追加: ${filename} (${lastmod})"
done

echo "</urlset>" >> sitemap.xml

# robots.txtも自動更新
cat > robots.txt << XMLEOF
User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
XMLEOF

COUNT=$(grep -c "<loc>" sitemap.xml)
echo ""
echo "✅ sitemap.xml 生成完了: ${COUNT}件のURL"
echo "✅ robots.txt も更新完了"
