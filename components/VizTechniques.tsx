"use client";
import { useState } from "react";
import { vizTechniques } from "@/lib/data";

const categories = ["전체", "공간", "시계열", "텍스트", "통계", "흐름"];

const diffBadge: Record<string, { bg: string; color: string }> = {
  하: { bg: "#d1fae5", color: "#065f46" },
  중: { bg: "#fef3c7", color: "#92400e" },
  상: { bg: "#fee2e2", color: "#991b1b" },
};
const impactBadge: Record<string, { bg: string; color: string }> = {
  중: { bg: "#e0e7ff", color: "#3730a3" },
  상: { bg: "#fce7f3", color: "#9d174d" },
};

// 각 기법별 미니 시각화 SVG
const MiniViz = ({ id, color }: { id: string; color: string }) => {
  if (id === "flow") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {[
        { x1: 10, y1: 15, x2: 110, y2: 35, w: 4 },
        { x1: 10, y1: 35, x2: 110, y2: 35, w: 7 },
        { x1: 10, y1: 55, x2: 110, y2: 35, w: 3 },
        { x1: 10, y1: 25, x2: 110, y2: 35, w: 5 },
      ].map((l, i) => (
        <path key={i}
          d={`M${l.x1},${l.y1} C${l.x1 + 50},${l.y1} ${l.x2 - 50},${l.y2} ${l.x2},${l.y2}`}
          stroke={color} strokeWidth={l.w} fill="none" opacity={0.6 + i * 0.1} />
      ))}
      <circle cx={110} cy={35} r={8} fill={color} opacity={0.9} />
      {[15, 35, 55, 25].map((y, i) => (
        <circle key={i} cx={10} cy={y} r={4} fill={color} opacity={0.5} />
      ))}
    </svg>
  );

  if (id === "kde") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      <defs>
        <radialGradient id={`kg${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="40%" stopColor={color} stopOpacity="0.5" />
          <stop offset="70%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`kg2${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={60} cy={35} rx={40} ry={28} fill={`url(#kg${id})`} />
      <ellipse cx={85} cy={22} rx={18} ry={13} fill={`url(#kg2${id})`} />
      <ellipse cx={35} cy={50} rx={15} ry={10} fill={`url(#kg2${id})`} opacity={0.6} />
    </svg>
  );

  if (id === "isochrone") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {[28, 20, 12].map((r, i) => (
        <ellipse key={i} cx={60} cy={35} rx={r * 1.8} ry={r}
          stroke={color} strokeWidth={1.5} fill={color}
          fillOpacity={(i + 1) * 0.12} strokeOpacity={0.7 - i * 0.15} />
      ))}
      <circle cx={60} cy={35} r={4} fill={color} />
      <text x={87} y={18} fontSize={8} fill={color} opacity={0.8}>120분</text>
      <text x={80} y={28} fontSize={8} fill={color} opacity={0.9}>60분</text>
      <text x={72} y={36} fontSize={8} fill={color}>30분</text>
    </svg>
  );

  if (id === "moran") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {[
        { x: 8,  y: 5,  w: 22, h: 18, c: "#ef4444", o: 0.85 },
        { x: 32, y: 5,  w: 22, h: 18, c: "#ef4444", o: 0.7 },
        { x: 56, y: 5,  w: 22, h: 18, c: "#fca5a5", o: 0.5 },
        { x: 80, y: 5,  w: 22, h: 18, c: "#e0e7ff", o: 0.5 },
        { x: 8,  y: 26, w: 22, h: 18, c: "#ef4444", o: 0.6 },
        { x: 32, y: 26, w: 22, h: 18, c: "#fca5a5", o: 0.4 },
        { x: 56, y: 26, w: 22, h: 18, c: "#e0e7ff", o: 0.5 },
        { x: 80, y: 26, w: 22, h: 18, c: "#93c5fd", o: 0.6 },
        { x: 8,  y: 47, w: 22, h: 18, c: "#e0e7ff", o: 0.4 },
        { x: 32, y: 47, w: 22, h: 18, c: "#93c5fd", o: 0.5 },
        { x: 56, y: 47, w: 22, h: 18, c: "#3b82f6", o: 0.7 },
        { x: 80, y: 47, w: 22, h: 18, c: "#3b82f6", o: 0.85 },
      ].map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h}
          fill={r.c} opacity={r.o} rx={2} />
      ))}
    </svg>
  );

  if (id === "timeline") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      <defs>
        <linearGradient id={`tg${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* 실제 라인 */}
      <polyline points="5,55 20,42 35,38 50,25 65,30 80,20 95,18 110,15"
        stroke={color} strokeWidth={2} fill="none" />
      {/* 예측 구간 (점선) */}
      <polyline points="80,20 95,16 110,12"
        stroke={color} strokeWidth={1.5} fill="none" strokeDasharray="3,2" opacity={0.6} />
      {/* 신뢰구간 */}
      <polygon points="80,20 95,10 110,6 110,18 95,22 80,20"
        fill={color} opacity={0.15} />
      {/* 계절성 파동 */}
      <polyline points="5,65 20,60 35,65 50,60 65,65 80,60 95,65 110,60"
        stroke={color} strokeWidth={1} fill="none" opacity={0.4} />
      <line x1="5" y1="68" x2="115" y2="68" stroke="#ccc" strokeWidth={0.5} />
    </svg>
  );

  if (id === "sentiment") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      <defs>
        <linearGradient id={`sg_pos${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={`sg_neg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* 긍정 면적 */}
      <polygon points="5,35 20,28 35,32 50,18 65,22 80,15 95,20 110,16 110,50 5,50"
        fill="url(#sg_pos)" />
      {/* 부정 면적 */}
      <polygon points="5,50 20,52 35,55 50,50 65,58 80,52 95,55 110,50 110,65 5,65"
        fill="url(#sg_neg)" />
      {/* 이슈 버블 */}
      <circle cx={65} cy={56} r={6} fill="#ef4444" opacity={0.4} />
      <circle cx={65} cy={56} r={3} fill="#ef4444" opacity={0.8} />
    </svg>
  );

  if (id === "wordcloud") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {[
        { x: 60, y: 35, r: 12, o: 0.9 },
        { x: 35, y: 25, r: 8, o: 0.7 },
        { x: 85, y: 28, r: 7, o: 0.7 },
        { x: 40, y: 50, r: 6, o: 0.6 },
        { x: 80, y: 50, r: 5, o: 0.6 },
        { x: 15, y: 38, r: 4, o: 0.5 },
        { x: 105, y: 40, r: 4, o: 0.5 },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={color} opacity={n.o} />
        </g>
      ))}
      {/* 엣지 */}
      {[
        [60, 35, 35, 25], [60, 35, 85, 28], [60, 35, 40, 50],
        [60, 35, 80, 50], [35, 25, 15, 38], [85, 28, 105, 40],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={1.5} opacity={0.35} />
      ))}
    </svg>
  );

  if (id === "ipa") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      <line x1={60} y1={5} x2={60} y2={65} stroke="#ccc" strokeWidth={1} />
      <line x1={5} y1={35} x2={115} y2={35} stroke="#ccc" strokeWidth={1} />
      <text x={8} y={18} fontSize={7} fill="#888">집중개선</text>
      <text x={65} y={18} fontSize={7} fill="#888">현 수준 유지</text>
      <text x={8} y={62} fontSize={7} fill="#888">낮은 우선</text>
      <text x={65} y={62} fontSize={7} fill="#888">과잉투자</text>
      {[
        { x: 42, y: 18, c: "#ef4444" }, { x: 28, y: 26, c: "#ef4444" },
        { x: 48, y: 12, c: "#ef4444" },
        { x: 78, y: 15, c: "#10b981" }, { x: 90, y: 22, c: "#10b981" },
        { x: 72, y: 28, c: "#10b981" },
        { x: 35, y: 50, c: "#94a3b8" }, { x: 50, y: 58, c: "#94a3b8" },
        { x: 82, y: 48, c: "#f59e0b" }, { x: 95, y: 55, c: "#f59e0b" },
      ].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={4} fill={pt.c} opacity={0.8} />
      ))}
    </svg>
  );

  if (id === "sankey") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {[
        { x1: 5, y1: 10, h1: 20, x2: 40, y2: 8, h2: 12, c: color },
        { x1: 5, y1: 10, h1: 20, x2: 40, y2: 22, h2: 8, c: "#1a56db" },
        { x1: 5, y1: 32, h1: 15, x2: 40, y2: 32, h2: 10, c: "#0ea86e" },
        { x1: 5, y1: 32, h1: 15, x2: 40, y2: 43, h2: 5, c: "#f0b429" },
        { x1: 5, y1: 48, h1: 10, x2: 40, y2: 49, h2: 10, c: "#7c3aed" },
        { x1: 40, y1: 8, h1: 12, x2: 80, y2: 5, h2: 8, c: color },
        { x1: 40, y1: 22, h1: 8, x2: 80, y2: 15, h2: 6, c: "#1a56db" },
        { x1: 40, y1: 32, h1: 10, x2: 80, y2: 22, h2: 8, c: "#0ea86e" },
        { x1: 40, y1: 43, h1: 5, x2: 80, y2: 32, h2: 5, c: "#f0b429" },
        { x1: 40, y1: 49, h1: 10, x2: 80, y2: 38, h2: 10, c: "#7c3aed" },
        { x1: 80, y1: 5, h1: 8, x2: 115, y2: 5, h2: 8, c: color },
        { x1: 80, y1: 15, h1: 6, x2: 115, y2: 15, h2: 6, c: "#1a56db" },
        { x1: 80, y1: 22, h1: 8, x2: 115, y2: 23, h2: 8, c: "#0ea86e" },
        { x1: 80, y1: 32, h1: 5, x2: 115, y2: 33, h2: 5, c: "#f0b429" },
        { x1: 80, y1: 38, h1: 10, x2: 115, y2: 40, h2: 10, c: "#7c3aed" },
      ].map((s, i) => (
        <path key={i} opacity={0.55}
          d={`M${s.x1},${s.y1} C${(s.x1 + s.x2) / 2},${s.y1} ${(s.x1 + s.x2) / 2},${s.y2} ${s.x2},${s.y2}
             L${s.x2},${s.y2 + s.h2} C${(s.x1 + s.x2) / 2},${s.y2 + s.h2} ${(s.x1 + s.x2) / 2},${s.y1 + s.h1} ${s.x1},${s.y1 + s.h1} Z`}
          fill={s.c} />
      ))}
    </svg>
  );

  if (id === "radar") return (
    <svg viewBox="0 0 120 70" style={{ width: "100%", height: 70 }}>
      {(() => {
        const cx = 60, cy = 36, r = 28;
        const axes = 6;
        const pts1 = [0.9, 0.7, 0.8, 0.6, 0.75, 0.85];
        const pts2 = [0.6, 0.8, 0.5, 0.9, 0.6, 0.7];
        const toXY = (i: number, v: number) => {
          const a = (Math.PI * 2 * i / axes) - Math.PI / 2;
          return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v];
        };
        const poly1 = pts1.map((v, i) => toXY(i, v).join(",")).join(" ");
        const poly2 = pts2.map((v, i) => toXY(i, v).join(",")).join(" ");
        const gridLines = [0.33, 0.66, 1].map(gr =>
          Array.from({ length: axes }, (_, i) => toXY(i, gr).join(",")).join(" ")
        );
        return (
          <>
            {gridLines.map((pts, i) => (
              <polygon key={i} points={pts} fill="none" stroke="#ccc" strokeWidth={0.5} />
            ))}
            {Array.from({ length: axes }, (_, i) => {
              const [x, y] = toXY(i, 1);
              return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#ccc" strokeWidth={0.5} />;
            })}
            <polygon points={poly1} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.5} />
            <polygon points={poly2} fill="#1a56db" fillOpacity={0.15} stroke="#1a56db" strokeWidth={1.5} strokeDasharray="2,1" />
          </>
        );
      })()}
    </svg>
  );

  return null;
};

export default function VizTechniques() {
  const [activeCat, setActiveCat] = useState("전체");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = activeCat === "전체"
    ? vizTechniques
    : vizTechniques.filter(v => v.category === activeCat);

  const activeViz = vizTechniques.find(v => v.id === selected);

  return (
    <section id="viz" style={{ padding: "72px 24px", background: "#0a0e1a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ width: 40, height: 3, background: "#f0b429", marginBottom: 14 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 10 }}>
            시각화 기법 가이드
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 600 }}>
            공모전 심사 기준에 최적화된 10종의 시각화 기법 — 모두 무료 도구로 구현 가능하며,
            각 기법의 입력·출력·난이도·임팩트를 함께 제시한다.
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {categories.map(cat => {
            const active = activeCat === cat;
            return (
              <button key={cat} onClick={() => { setActiveCat(cat); setSelected(null); }}
                style={{
                  padding: "6px 14px", borderRadius: 6,
                  border: active ? "1.5px solid #f0b429" : "1.5px solid rgba(255,255,255,0.12)",
                  background: active ? "#f0b429" : "transparent",
                  color: active ? "#0a0e1a" : "rgba(255,255,255,0.6)",
                  fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer",
                  fontFamily: "var(--mono)", letterSpacing: "0.04em",
                  transition: "all 0.15s",
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

          {/* 카드 그리드 */}
          <div style={{
            flex: "1 1 600px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
            alignContent: "start",
          }}>
            {filtered.map(viz => {
              const isSelected = selected === viz.id;
              return (
                <button key={viz.id} onClick={() => setSelected(isSelected ? null : viz.id)}
                  style={{
                    background: isSelected ? viz.color : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${isSelected ? viz.color : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10, padding: "16px", cursor: "pointer",
                    textAlign: "left", fontFamily: "var(--sans)",
                    transition: "all 0.18s",
                  }}>
                  {/* 미니 SVG 시각화 */}
                  <div style={{
                    background: isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    borderRadius: 6, marginBottom: 12, overflow: "hidden",
                    opacity: isSelected ? 1 : 0.75,
                  }}>
                    <MiniViz id={viz.id} color={isSelected ? "white" : viz.color} />
                  </div>

                  <div className="chip" style={{
                    background: isSelected ? "rgba(255,255,255,0.2)" : `${viz.color}22`,
                    color: isSelected ? "white" : viz.color,
                    marginBottom: 8,
                  }}>
                    {viz.category}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "white" : "rgba(255,255,255,0.9)", marginBottom: 3 }}>
                    {viz.title}
                  </div>
                  <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                    {viz.subtitle}
                  </div>

                  {/* 난이도/임팩트 뱃지 */}
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <span style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 3,
                      background: isSelected ? "rgba(255,255,255,0.2)" : diffBadge[viz.difficulty].bg,
                      color: isSelected ? "white" : diffBadge[viz.difficulty].color,
                      fontFamily: "var(--mono)",
                    }}>난이도 {viz.difficulty}</span>
                    <span style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 3,
                      background: isSelected ? "rgba(255,255,255,0.2)" : impactBadge[viz.impact].bg,
                      color: isSelected ? "white" : impactBadge[viz.impact].color,
                      fontFamily: "var(--mono)",
                    }}>임팩트 {viz.impact}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 상세 패널 */}
          <div style={{ flex: "1 1 280px", minWidth: 260 }}>
            {activeViz ? (
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${activeViz.color}44`,
                borderRadius: 12, padding: "24px",
                position: "sticky", top: 72,
              }}>
                {/* 큰 미니 시각화 */}
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8, marginBottom: 18,
                  height: 100, overflow: "hidden",
                  display: "flex", alignItems: "center",
                }}>
                  <div style={{ width: "100%", transform: "scale(1.3)", transformOrigin: "center" }}>
                    <MiniViz id={activeViz.id} color={activeViz.color} />
                  </div>
                </div>

                <div className="chip" style={{ background: `${activeViz.color}22`, color: activeViz.color, marginBottom: 12 }}>
                  {activeViz.category}
                </div>
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  {activeViz.title}
                </h3>
                <div className="mono" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 16 }}>
                  {activeViz.subtitle}
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                  {activeViz.desc}
                </p>

                {[
                  { label: "INPUTS", items: activeViz.inputs, color: "#93c5fd" },
                  { label: "OUTPUTS", items: activeViz.outputs, color: "#86efac" },
                  { label: "TOOLS (무료)", items: activeViz.tools, color: "#fde68a" },
                ].map(section => (
                  <div key={section.label} style={{ marginBottom: 16 }}>
                    <div className="mono" style={{
                      color: "rgba(255,255,255,0.3)", fontSize: 10,
                      letterSpacing: "0.08em", marginBottom: 8,
                    }}>
                      {section.label}
                    </div>
                    {section.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: section.color, flexShrink: 0, marginTop: 5,
                        }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1.5px dashed rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "40px 24px",
                textAlign: "center", color: "rgba(255,255,255,0.2)",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>↖</div>
                <div style={{ fontSize: 13 }}>카드를 선택하면<br />상세 내용이 표시됩니다</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}