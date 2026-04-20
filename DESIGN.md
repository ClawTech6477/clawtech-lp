# DESIGN.md — ClawTech LP デザイン設計書 & 汎用テンプレート

> **用途**: ClawTech自社LP + クライアントLP制作時の共通ガイドライン
> **更新**: 2026-04-20

---

## 1. 設計思想

### ClawTech（自社）のデフォルト設定
- **印象**: 信頼感・スピード感・AI活用の専門性
- **ターゲット**: 中小企業経営者・個人事業主（40代男性中核）
- **トーン**: プロフェッショナル × 親しみやすい
- **差別化**: 「AI × 適正価格 × 最短納品」

### クライアントLP制作時のカスタマイズ指針
```
業種      → 色 / トーン / フォント強調を変える
飲食・美容 → ウォーム系（オレンジ・テラコッタ）、親しみやすさ重視
士業・法律 → ネイビー・グレー、信頼感・格調
医療・健康 → グリーン・ホワイト、清潔感・安心感
IT・テック → ブルー・ダーク、革新性・精度感
不動産    → アース系、安定感・高級感
教育      → ブルー・イエロー、活力・成長感
```
色以外の構造（セクション順・コンポーネント）は本書のまま流用可。

---

## 2. カラーパレット

### ClawTech デフォルト
| 変数名 | HEX | 用途 |
|--------|-----|------|
| `--primary` | `#0052CC` | H1・見出し・ボタン背景・アイコン |
| `--primary-dark` | `#003D99` | primaryのホバー状態 |
| `--primary-light` | `#EBF2FF` | アイコン背景・バッジ・薄いアクセント |
| `--accent` | `#FF6B35` | CTAボタン（全ページ最大3個）・NEWバッジ |
| `--accent-dark` | `#E55A2B` | accentのホバー状態 |
| `--dark` | `#1F2937` | 本文・H3以下 |
| `--gray` | `#6B7280` | サポートテキスト・説明文 |
| `--light` | `#F9FAFB` | セクション背景（白と交互使用） |
| `--border` | `#E5E7EB` | カード枠線・区切り線 |
| `--white` | `#FFFFFF` | カード本体・フォーム背景 |
| `--green` | `#10B981` | 成果・チェックアイコン |

### カラー適用ルール
- **H1・主要見出し**: `--primary`（#0052CC）
- **CTAボタン**: `--accent`（#FF6B35）→ ページに2〜3個まで
- **本文**: `--dark`（#1F2937）
- **サポートテキスト**: `--gray`（#6B7280）
- **成功・チェック**: `--green`（#10B981）
- **セクション背景**: white ↔ `--light` を交互に使う

---

## 3. タイポグラフィ

### フォント
- **全体**: `Noto Sans JP`（Google Fonts）
- **ウェイト**: 400（本文）/ 500（ラベル）/ 700（見出し）/ 900（数字・H1）

### 見出しサイズ
| 要素 | デスクトップ | モバイル | 行間 | 色 |
|------|-------------|---------|------|-----|
| H1 | 48px | 26〜32px | 1.22 | `--dark` or `--primary` |
| H2 (section-title) | 36px | 22〜26px | 1.3 | `--dark` |
| H3 (card) | 18〜22px | 16〜18px | 1.4 | `--dark` |
| H4 (flow/step) | 14〜15px | 13〜14px | 1.5 | #fff（dark bg時）|

### 本文・サポートテキスト
- **Body**: 14〜16px、行間 1.8、`--gray`
- **Caption**: 12〜13px、行間 1.6、`--gray` or `#94a3b8`
- **最小フォント**: 12px（アクセシビリティ要件）

---

## 4. コンポーネント仕様

### CTAボタン（最重要）
```css
.btn-primary {
  background: var(--accent);   /* #FF6B35 */
  color: #fff;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  min-height: 56px;
  transition: all 200ms ease-out;
}
.btn-primary:hover {
  background: var(--accent-dark);
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255,107,53,0.45);
}
```

### セカンダリボタン
```css
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  min-height: 52px;
}
.btn-secondary:hover {
  background: var(--primary);
  color: #fff;
  transform: scale(1.03);
}
```

### カード（Services / Strengths / Voices）
```css
background: #fff;
border: 1px solid var(--border);    /* #E5E7EB */
border-radius: 16px;
padding: 28〜44px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);
/* Hover */
transform: translateY(-4px);
box-shadow: 0 12px 40px rgba(0,0,0,0.14);
transition: all 200ms ease-out;
```

### Serviceカード（上部アクセントライン付き）
```css
border-top: 3px solid var(--primary);
/* NEWサービスはvar(--accent) */
```

### バッジ / ラベル
```css
/* primary系 */
background: var(--primary-light);
color: var(--primary);
border: 1px solid rgba(0,82,204,0.15);
padding: 5px 12px;
border-radius: 6px;
font-size: 11px;
font-weight: 700;

/* accent系（NEWバッジ等） */
background: var(--accent);
color: #fff;
border-radius: 50px;
```

### 数値表示（strength-num）
```css
font-size: 56px;
font-weight: 900;
color: var(--primary);
line-height: 1;
```

---

## 5. レイアウト原則

### セクション間隔
- **デスクトップ**: `padding: 80px 0`
- **モバイル (≤768px)**: `padding: 56px 0`
- **背景**: white ↔ `#F9FAFB` を交互

### グリッドシステム
- **最大幅**: 1200px（コンテンツ幅）
- **パディング**: 0 24px（デスクトップ）/ 0 16px（モバイル）
- **ガター**: 24〜32px

### 主要グリッド
| セクション | デスクトップ | モバイル |
|------------|-------------|---------|
| Problems | 4列 | 2列 |
| Services | 3列 | 1列 |
| Strengths | 3列 | 1列 |
| Pricing | 3列 | 1列 |
| Flow | 5列 | 2列 |
| Blog | 3列 | 1列 |
| Voices | 3列 | 1列 |
| Contact | 2列 | 1列 |

---

## 6. セクション構成（推奨順）

```
1. Hero        → 価値提案・メインCTA・スタッツ
2. Problems    → ターゲットの痛みポイント（4〜8項目）
3. Services    → サービス一覧（3〜6項目）
4. Strengths   → 選ばれる理由（3項目・数字で表現）
5. CTA Banner  → キャンペーン・限定オファー
6. Pricing     → 料金プラン（3プラン標準）
7. Flow        → 依頼の流れ（5ステップ）
8. Blog        → 関連記事（3本）
9. FAQ         → よくある質問（5項目）
10. Voices     → お客様の声（3件）
11. Contact    → お問い合わせフォーム
12. Company    → 会社概要
13. Footer
```

---

## 7. SEO設計

### メタタグ
```html
<title>[主要KW] ¥XX,XXX〜 [特徴]｜[ブランド名]（地域）</title>
<meta name="description" content="[ブランド名]は[KW]を[価格]〜[特徴]で提供。[サービス一覧]。無料相談[レスポンス時間]受付中。">
<link rel="canonical" href="[正規URL]">
<meta property="og:locale" content="ja_JP">
```

### 構造化データ（必須）
- `LocalBusiness` schema → 事業者情報・サービス・価格
- `FAQPage` schema → FAQセクションの全Q&A
- `WebSite` schema → ブランド名とURL

### 見出し階層（厳守）
```
H1: 1個のみ。主要KWを含む
H2: 各セクションタイトル
H3: カード・アイテムタイトル
H4: フロー・ステップタイトル
```

### 画像
- `alt` 属性: 必ず内容を説明するテキスト
- `loading="lazy"`: ファーストビュー以外の全画像
- `width` / `height`: 全画像に指定（CLS防止）

---

## 8. エフェクト・アニメーション

### スクロールアニメーション
```css
.fade-up { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }
/* stagger: nth-child(n) { transition-delay: n*0.07s } */
```

### ホバー（カード）
```
transform: translateY(-4px)
box-shadow: 0 12px 40px rgba(0,0,0,0.14)
transition: all 200ms ease-out
```

### ホバー（CTAボタン）
```
transform: scale(1.05)
background: --accent-dark
transition: all 200ms ease-out
```

### フローティングタグ
```css
animation: floatY 3.5s ease-in-out infinite;
@keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
```

---

## 9. アクセシビリティ

| 項目 | 基準 |
|------|------|
| 最小フォント | 12px |
| ボタン最小サイズ | 48px × 48px（タッチターゲット） |
| コントラスト比 | 4.5:1以上（WCAG AA） |
| フォーカス | `outline: 2px solid var(--primary); outline-offset: 3px` |
| `aria-label` | ナビ・ボタン・アイコンに付与 |
| `role` | nav / list / listitem / complementary 等 |
| 画像 | alt必須、装飾画像は `aria-hidden="true"` |

---

## 10. Do's and Don'ts

### ✅ Do's
- 大胆な数字表示（"80%"は56px・Brand Blue）
- CTAはオレンジのみ（ページに2〜3個まで）
- 余白は8pxグリッドの倍数（8 / 16 / 24 / 32 / 48 / 64 / 80）
- セクション背景を white ↔ `#F9FAFB` で交互に変える
- カードに subtle border（`#E5E7EB`）を必ず付ける
- ホバーエフェクトは200ms ease-out

### ❌ Don'ts
- グラデーション背景（特に紫グラデ）→ 白ベースのみ
- 同時に3色以上の原色を使う
- `Inter` / `Arial` / `system-ui` → `Noto Sans JP` 一択
- ボタン・リンクのタッチターゲット48px未満
- フォント12px未満
- アニメーション過多（ホバー + スクロールフェードのみ）
- セクション間の背景色が同じ連続（視認性低下）

---

## 11. Claude Code へのプロンプト例

### 基本指示
```
DESIGN.md を読んで、[クライアント業種] の LP を制作してください。
セクション順: Hero / Problems / Services / Strengths / Pricing / Flow / FAQ / Voices / Contact
ターゲット: [ターゲット属性]
主要KW: [KW1], [KW2], [KW3]
CTAテキスト: [CTA文言]
```

### 色カスタマイズ
```
デフォルトの --primary: #0052CC を [業種に合った色] に変更してください。
--accent: #FF6B35 は維持（CTAはオレンジ統一）
```

### SEO指定
```
title: [KW] ¥XX,XXX〜 [特徴]｜[ブランド名]（地域）
description: 120文字以内、主要KWを自然に含める
LocalBusiness + FAQPage の schema.org JSON-LD を必ず追加
```
