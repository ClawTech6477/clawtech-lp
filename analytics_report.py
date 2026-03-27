"""
GA4 Analytics Report - clawtech-lp
取得項目: 直帰率・平均セッション時間・ページ別離脱率・スクロール深度・CTAクリック率
期間: 直近30日
"""

import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    Dimension,
    Metric,
    DateRange,
    OrderBy,
    FilterExpression,
    Filter,
)
from google.oauth2 import service_account

KEY_PATH = os.path.expanduser("~/.openclaw/secrets/ga4_key.json")
PROPERTY_ID = "526950964"
DATE_RANGE = DateRange(start_date="30daysAgo", end_date="today")

credentials = service_account.Credentials.from_service_account_file(
    KEY_PATH,
    scopes=["https://www.googleapis.com/auth/analytics.readonly"],
)
client = BetaAnalyticsDataClient(credentials=credentials)


def sep(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)


# ──────────────────────────────────────────
# 1. 直帰率・平均セッション時間（サイト全体）
# ──────────────────────────────────────────
def report_overview():
    sep("1. サイト全体 - 直帰率・平均セッション時間")
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DATE_RANGE],
        metrics=[
            Metric(name="bounceRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="sessions"),
        ],
    )
    resp = client.run_report(req)
    for row in resp.rows:
        bounce = float(row.metric_values[0].value) * 100
        avg_sec = float(row.metric_values[1].value)
        sessions = row.metric_values[2].value
        minutes, seconds = divmod(int(avg_sec), 60)
        print(f"  セッション数       : {sessions}")
        print(f"  直帰率             : {bounce:.1f}%")
        print(f"  平均セッション時間 : {minutes}分{seconds:02d}秒")


# ──────────────────────────────────────────
# 2. ランディングページ別 直帰率（≒離脱率）
# ※ GA4 Data APIはexits/exitRateを非サポート。
#   landingPagePlusQueryString × bounceRate で代替。
# ──────────────────────────────────────────
def report_exit_rate():
    sep("2. ランディングページ別 直帰率（GA4はexit rate非対応のため代替）")
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DATE_RANGE],
        dimensions=[Dimension(name="landingPagePlusQueryString")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="bounceRate"),
            Metric(name="engagementRate"),
        ],
        order_bys=[
            OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)
        ],
        limit=15,
    )
    resp = client.run_report(req)
    print(f"  {'ランディングページ':<45} {'Sess':>5}  {'直帰率':>6}  {'エンゲージ率':>10}")
    print(f"  {'-'*45} {'-'*5}  {'-'*6}  {'-'*10}")
    for row in resp.rows:
        path = row.dimension_values[0].value[:44]
        sessions = row.metric_values[0].value
        bounce = float(row.metric_values[1].value) * 100
        engage = float(row.metric_values[2].value) * 100
        print(f"  {path:<45} {sessions:>5}  {bounce:>5.1f}%  {engage:>9.1f}%")


# ──────────────────────────────────────────
# 3. スクロール深度（scroll イベント）
# ──────────────────────────────────────────
def report_scroll_depth():
    sep("3. スクロール深度 (scroll イベント / percent_scrolled 別)")
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DATE_RANGE],
        dimensions=[
            Dimension(name="eventName"),
            Dimension(name="percentScrolled"),
        ],
        metrics=[Metric(name="eventCount")],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="eventName",
                string_filter=Filter.StringFilter(value="scroll"),
            )
        ),
        order_bys=[
            OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="percentScrolled"))
        ],
        limit=20,
    )
    resp = client.run_report(req)
    if not resp.rows:
        print("  ※ scroll イベントデータなし（GA4のデフォルト計測は90%のみ）")
        print("     詳細なスクロール深度計測にはGTMカスタムイベント設定が必要です")
        return
    print(f"  {'スクロール深度':<20} {'イベント数':>10}")
    print(f"  {'-'*20} {'-'*10}")
    for row in resp.rows:
        depth = row.dimension_values[1].value
        count = row.metric_values[0].value
        print(f"  {depth+'%':<20} {count:>10}")


# ──────────────────────────────────────────
# 4. CTAクリック率
# ──────────────────────────────────────────
def report_cta_ctr():
    sep("4. CTAクリック率")

    # セッション数取得
    req_sessions = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DATE_RANGE],
        metrics=[Metric(name="sessions")],
    )
    resp_s = client.run_report(req_sessions)
    total_sessions = int(resp_s.rows[0].metric_values[0].value) if resp_s.rows else 0

    # CTA系イベント取得（click / generate_lead / contact 等）
    cta_event_names = ["click", "generate_lead", "contact", "form_submit", "cta_click"]
    req_cta = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[DATE_RANGE],
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="eventCount"), Metric(name="totalUsers")],
        order_bys=[
            OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)
        ],
        limit=30,
    )
    resp_cta = client.run_report(req_cta)

    cta_rows = [
        row for row in resp_cta.rows
        if any(k in row.dimension_values[0].value.lower() for k in ["click", "lead", "contact", "cta", "form", "submit", "cv"])
    ]

    if not cta_rows:
        print("  ※ CTA系イベント未検出。全イベント上位10件を表示します:")
        print(f"  {'イベント名':<35} {'回数':>8}  {'ユーザー':>8}  {'CTR(session比)':>14}")
        print(f"  {'-'*35} {'-'*8}  {'-'*8}  {'-'*14}")
        for row in resp_cta.rows[:10]:
            name = row.dimension_values[0].value[:34]
            count = row.metric_values[0].value
            users = row.metric_values[1].value
            ctr = int(count) / total_sessions * 100 if total_sessions else 0
            print(f"  {name:<35} {count:>8}  {users:>8}  {ctr:>13.1f}%")
    else:
        print(f"  総セッション数: {total_sessions:,}")
        print(f"  {'イベント名':<35} {'回数':>8}  {'ユーザー':>8}  {'CTR(session比)':>14}")
        print(f"  {'-'*35} {'-'*8}  {'-'*8}  {'-'*14}")
        for row in cta_rows:
            name = row.dimension_values[0].value[:34]
            count = row.metric_values[0].value
            users = row.metric_values[1].value
            ctr = int(count) / total_sessions * 100 if total_sessions else 0
            print(f"  {name:<35} {count:>8}  {users:>8}  {ctr:>13.1f}%")


# ──────────────────────────────────────────
# 実行
# ──────────────────────────────────────────
if __name__ == "__main__":
    print(f"\nGA4 Analytics Report")
    print(f"Property ID : {PROPERTY_ID}")
    print(f"期間        : 直近30日 (30daysAgo → today)")

    report_overview()
    report_exit_rate()
    report_scroll_depth()
    report_cta_ctr()

    print(f"\n{'='*60}")
    print("  レポート完了")
    print('='*60)
