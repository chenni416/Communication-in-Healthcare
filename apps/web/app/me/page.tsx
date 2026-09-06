"use client";
import { AskBox } from "@/components/twin/ask-box";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension } from "@schema";
import { Card } from "@/components/ui/card";
import { useApi, type MeHome } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";
import { DIRECTION_LABEL } from "@/lib/labels";
import { useMyPatientId } from "@/lib/me";

/** 本人首頁（VISION §28.1）：狀態一行 → 今天八維度 → 終身摘要 → 最近事件 → 問我的紀錄。 */
export default function MeHomePage() {
  const pid = useMyPatientId();
  const { data, error } = useApi<MeHome>(pid ? `/me/${pid}/home` : null, [pid]);
  if (pid === undefined) return <p className="text-ink-2">Loading…</p>;
  if (pid === null) return <p role="alert" className="text-danger-ink">這個身份沒有對應的紀錄。</p>;
  if (error) return <p role="alert" className="text-danger-ink">{error}</p>;
  if (!data) return <p className="text-ink-2">Loading…</p>;
  const p = data.profile;
  const age = new Date().getFullYear() - p.birth_year;
  const dims = data.today.dimensions;
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      <header className="text-center lg:col-span-2">
        {/* <p className="text-xs text-ink-2">MY HEALTH TWIN</p> */}
        {/* <h1 className="text-balance text-4xl font-medium">{p.code_name}</h1>
        <p className="text-lg text-ink-2">{age} 歲</p>
        <p className="mt-2 inline-flex items-center gap-3 rounded-full bg-surface px-4 py-2 text-2xl font-medium"></p> */}
        <p className="text-sm font-medium text-primary">我的專屬健康分身 (My Health Twin)</p>
        <h1 className="text-balance text-4xl font-medium mt-1">{p.code_name}</h1>
        <p className="text-lg text-ink-2 mt-1">{age} 歲</p>
        <p className="mt-3 inline-flex items-center gap-3 rounded-full bg-surface px-4 py-2 text-2xl font-medium shadow-sm">
          <span className={`size-4 shrink-0 rounded-full ${data.status_line.includes("護理師") ? "bg-danger" : data.status_line.includes("不一樣") ? "bg-warn" : "bg-ok"}`} aria-hidden="true" />
          {data.status_line}
        </p>
      </header>

      {/* <Card title="今天" headingLevel={2} meta={data.today.ts ? fmtDateTime(data.today.ts) : "還沒有今天的紀錄"}> */}
      <Card title="今日身體狀況 (Today's Vitals)" headingLevel={2} meta={data.today.ts ? fmtDateTime(data.today.ts) : "還沒有今天的紀錄"}>
        {/* 8 個小卡：名稱＋一個詞（docs/UIUX_OMNI_TWIN.md §4.2） */}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DIMENSIONS.map((d) => {
            const v = dims[d];
            const changed = !!v && v.direction !== "unknown" && v.direction !== "same";
            const word = !v ? "如常" : changed ? DIRECTION_LABEL[v.direction as "up" | "down"] : "如常";
            return (
              <li key={d} className={`rounded-[10px] border p-3 ${changed ? "border-accent-2/60 bg-surface-2" : "border-line bg-surface-2"}`} title={v ? `「${v.raw_quote}」` : undefined}>
                <p className="text-xs text-ink-2">{DIMENSION_LABELS[d as Dimension]["zh-TW"]}</p>
                <p className={`mt-1 text-lg font-medium ${changed ? "text-accent-2" : ""}`}>{word}</p>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="lg:col-span-2"><AskBox pid={pid} /></div>
    </div>
  );
}
