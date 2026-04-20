# DESIGN.md - ClawTech LP デザイン設計書

## 1. Visual Theme & Atmosphere
ClawTechは「AI × 実行力」を体現するブランド。
- 印象：テック企業らしい・信頼感・スピード感
- 対象：中小企業経営者・個人事業主（40代男性が中核）
- トーン：プロフェッショナル × 親しみやすい

## 2. Color Palette & Roles

### Primary Colors
- **Brand Blue: #0052CC** （Figmaブルー。テック感）
- **Accent Orange: #FF6B35** （CTAボタン・数字。スピード感）
- **Text Dark: #1F2937** （本文。読みやすさ重視）
- **Text Light: #6B7280** （補足・説明文）

### Secondary Colors
- **Success Green: #10B981** （「成果」「安心」を示すアイコン）
- **Background Light: #F9FAFB** （セクション背景。淡すぎない）
- **Border Gray: #E5E7EB** （カード区切り線）

### Application Rules
- H1・メイン見出し: Brand Blue (#0052CC)
- CTA ボタン: Accent Orange (#FF6B35)
- メインコピー: Text Dark (#1F2937)
- サポートテキスト: Text Light (#6B7280)
- 成功事例アイコン: Success Green (#10B981)
- セクション背景: Background Light (#F9FAFB)

## 3. Typography Rules

### Heading Hierarchy
- **H1（ページタイトル）**: Noto Sans JP Bold 48px
  - 行間: 1.2
  - 色: Brand Blue (#0052CC)
  - マージン下: 24px

- **H2（セクションタイトル）**: Noto Sans JP Bold 36px
  - 行間: 1.3
  - 色: Text Dark (#1F2937)
  - マージン上: 64px / 下: 32px

- **H3（見出し3）**: Noto Sans JP SemiBold 20px
  - 行間: 1.4
  - 色: Text Dark (#1F2937)

- **H4（カード見出し）**: Noto Sans JP Medium 16px
  - 行間: 1.5
  - 色: Brand Blue (#0052CC)

### Body Text
- **本文（Body）**: Noto Sans JP Regular 16px
  - 行間: 1.75
  - 色: Text Light (#6B7280)
  - 文字間隔: 0.5px

- **小文字（Caption）**: Noto Sans JP Regular 14px
  - 行間: 1.6
  - 色: Text Light (#6B7280)

### Button Text
- **CTA Button**: Noto Sans JP SemiBold 16px
  - 色: White (#FFFFFF)
  - 大文字でない（日本語は対象外）
  - 左右パディング: 32px

## 4. Component Stylings

### CTA Button（最重要）
Background: Accent Orange (#FF6B35)
Padding: 16px 32px
Border-radius: 8px
Font: Noto Sans JP SemiBold 16px
Color: White (#FFFFFF)
Height: 56px（Material Design タッチターゲット: 48px 最小）
Hover State:
  - Background: #E55A2B（オレンジを暗く）
  - Transform: scale(1.05)
  - Transition: 200ms ease-out
Focus State:
  - Outline: 2px solid Brand Blue
  - Outline-offset: 2px

### Secondary Button（サービスページリンク）
Background: Transparent
Border: 2px solid Brand Blue (#0052CC)
Color: Brand Blue (#0052CC)
Padding: 12px 24px
Border-radius: 6px
Font: Noto Sans JP Medium 14px
Hover:
  - Background: Brand Blue (#0052CC)
  - Color: White (#FFFFFF)
  - Transition: 200ms ease-out

### Card Styles（Services / Why / Voices）
Background: White (#FFFFFF)
Border: 1px solid Border Gray (#E5E7EB)
Border-radius: 8px
Padding: 24px
Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
Hover shadow: 0 8px 16px rgba(0, 0, 0, 0.12)
Transition: box-shadow 200ms ease-out, transform 200ms ease-out
Hover transform: translateY(-4px)

### Badge / Label（"人気No.1"）
Background: #FEF3E2（薄いオレンジ）
Color: Accent Orange (#FF6B35)
Padding: 4px 12px
Border-radius: 20px
Font: Noto Sans JP Medium 12px
Display: inline-block

### Number / Stat Display（"80%"）
Font: Noto Sans JP Bold 48px
Color: Brand Blue (#0052CC)
Line-height: 1.1
Margin-bottom: 8px

## 5. Layout Principles

### Section Spacing
- 上下マージン: 80px（デスクトップ）/ 48px（モバイル）
- セクション間ボーダー: なし（背景色で区別）

### Grid System
- 最大幅: 1200px（コンテンツ）
- カラム: 12 列
- ガター: 24px
- グリッド: CSS Grid 推奨

### Content Box
Max-width: 1200px
Margin: 0 auto
Padding: 0 24px（デスクトップ）/ 0 16px（モバイル）

### Services Grid（3 列）
Display: grid
Grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))
Gap: 32px（横）/ 24px（縦）

### Why ClawTech Grid（3 列）
同上
Card min-width: 320px
Gap: 28px

### Voices Grid（3 列）
同上
Card min-width: 300px

### Hero Section
Min-height: 560px
Display: flex
Align-items: center
Justify-content: center
Background: Linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)
Text-align: center
Padding: 80px 24px

### Pricing Grid（3 列 + 1 列別枠）
Display: grid
Grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
Gap: 24px
最後の行（AI営業代行）: full-width or 4 列目に配置

## 6. Depth & Elevation

### Shadows
- **Subtle (Card)**: 0 1px 3px rgba(0, 0, 0, 0.08)
- **Medium (Hover Card)**: 0 8px 16px rgba(0, 0, 0, 0.12)
- **Button Hover**: 0 4px 12px rgba(0, 0, 0, 0.15)

### Borders
- **Primary Border**: 1px solid #E5E7EB
- **Divider**: 1px solid #E5E7EB
- **Focus Outline**: 2px solid #0052CC

### Background Layers
- Layer 0 (Base): White (#FFFFFF)
- Layer 1 (Sections): #F9FAFB
- Layer 2 (Hover elements): Transparent with shadow

## 7. Do's and Don'ts

### ✅ Do's
- 大胆な数字表示（"80%"は大きく、Brand Blue で）
- CTA はオレンジ（ページに 2-3 個まで）
- 余白は 24px または 32px の倍数で（8px グリッド）
- ホバーエフェクトは動きを付ける（200ms ease-out）
- Icons はシンプル（Fill: Brand Blue or Success Green）
- テキスト: 行間 1.75 以上（読みやすさ）

### ❌ Don'ts
- グラデーション背景（白ベース、淡い色のみ）
- 複数の原色を同時に使う（Brand Blue + Orange が基本）
- 境界線なし（カードは subtle border で区別）
- アニメーション過多（ホバーのみ）
- 小文字 12px 未満（アクセシビリティ）
- フォント混在（Noto Sans JP のみ）
- ボタンサイズ 48px 未満（Material Design）

## 8. Responsive Behavior

### Breakpoints
- **Desktop**: 1200px 以上
- **Tablet**: 768px - 1199px
- **Mobile**: 767px 以下

### Mobile Adjustments
- **H1**: 36px（デスクトップ 48px）
- **H2**: 28px（デスクトップ 36px）
- **Section Spacing**: 48px（デスクトップ 80px）
- **Grid Columns**: 1 列（Desktop: 3 列）
- **Padding**: 16px（Desktop: 24px）

### Mobile Grid
Services / Why / Voices / Pricing: 1 列
Gap: 20px

### Touch Target
- 全ボタン・リンク: 最小 48px × 48px
- タップ領域パディング: 12px 以上

## 9. Agent Prompt Guide

Claude Code に対する指示方法：

基本指示
DESIGN.md を読んで、ClawTech LP を改善してください。
セクション: Hero / Problems / Services / Why / Pricing / Flow / Blog / FAQ / Voices / Contact

色指定
色はDESIGN.md の Color Palette を厳守してください。
- H1・見出し: Brand Blue (#0052CC)
- CTA ボタン: Accent Orange (#FF6B35)
- 本文: Text Dark (#1F2937)
- サポート: Text Light (#6B7280)

タイポグラフィ指定
フォントはすべて Noto Sans JP にしてください。
見出しサイズ：H1 48px / H2 36px / H3 20px / H4 16px
本文: 16px、行間 1.75

CTA 指定
CTA ボタンはオレンジ (#FF6B35)、高さ 56px、ホバーで scale(1.05)
全ページで最大 3 個まで。

グリッド指定
Services / Why / Voices は 3 列グリッド (gap: 32px)
Pricing は 3 列 + AI営業代行は別レイアウト

スペーシング指定
セクション上下マージン: 80px
内部パディング: 24px
カード間ギャップ: 24-32px
余白はすべて 8px グリッド

ホバーエフェクト
カード: translateY(-4px) + shadow 増加
ボタン: scale(1.05) + 色濃化
リンク: underline + color 変更
全て 200ms ease-out

アクセシビリティ
- 最小文字サイズ: 14px
- ボタン最小サイズ: 48px
- コントラスト比: 4.5:1 以上（WCAG AA）
- Focus outline: 2px solid Brand Blue

