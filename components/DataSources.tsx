"use client";
import { useState } from "react";
import { dataSources } from "@/lib/data";

const categories = [
  { key: "visitorsPopulation", label: "방문객·체류인구", icon: "👥", desc: "KTDB, SGIS 생활인구 등" },
  { key: "consumption",        label: "소비·경제",       icon: "💳", desc: "소상공인, ECOS 등" },
  { key: "social",             label: "소셜·텍스트",     icon: "📱", desc: "네이버, 카카오, 빅카인즈" },
  { key: "spatial",            label: "공간·기상",       icon: "🗺️", desc: "국토정보, 기상청 등" },
  { key: "survey",             label: "설문·조사",       icon: "📋", desc: "문체부, KTDB 원시데이터" },
];

type DSKey = keyof typeof dataSources;
interface DS { name:string; org:string; url:string; unit:string; cost:string; note:string; tag:string; tagColor:string; }

export default function DataSources() {
  const [active, setActive] = useState<DSKey>("visitorsPopulation");
  const items = dataSources[active] as DS[];

  const totalFree = Object.values(dataSources).flat().filter((d: any) =>
    d.cost === "무료" || d.cost.startsWith("무료")
  ).length;

  return (
    <section id="sources" style={{ padding: "72px 24px", background: "var(--paper2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 36 }}>
          <div style={{ width: 40, height: 3, background: "#1a56db", marginBottom: 14 }} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>무료 데이터 소스 총람</h2>
            <div style={{
              background: "#0ea86e", color: "white", borderRadius: 6,
              padding: "4px 12px", fontSize: 13, fontWeight: 700,
              fontFamily: "var(--mono)", marginBottom: 4,
            }}>
              ✓ 전 {totalFree}건 무료
            </div>
          </div>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6, maxWidth: 620 }}>
            유료·협약 필요 소스(SKT 상품, KT BDP, 카드사 직접 협약 등)를 제외하고
            누구나 바로 접근 가능한 소스만 수록했다.
          </p>
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {categories.map(cat => {
            const isActive = active === cat.key;
            const items = dataSources[cat.key as DSKey] as DS[];
            return (
              <button key={cat.key} onClick={() => setActive(cat.key as DSKey)}
                style={{
                  padding: "10px 18px", borderRadius: 10,
                  border: isActive ? "2px solid #1a56db" : "2px solid #ddd",
                  background: isActive ? "#1a56db" : "white",
                  color: isActive ? "white" : "#444",
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", fontFamily: "var(--sans)",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontWeight: 600 }}>{cat.label}</span>
                  <span style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "#e8e8e8",
                    color: isActive ? "white" : "#666",
                    borderRadius: 10, padding: "1px 7px", fontSize: 11,
                    fontFamily: "var(--mono)",
                  }}>{items.length}</span>
                </div>
                <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.6)" : "#999", marginTop: 2, marginLeft: 28 }}>
                  {cat.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {items.map((src, i) => (
            <div key={i} className="card-hover" style={{
              background: "white", borderRadius: 10,
              padding: "20px", border: "1px solid #e0ddd6",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, paddingRight: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 3 }}>{src.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{src.org}</div>
                </div>
                <span className="chip" style={{ background: `${src.tagColor}18`, color: src.tagColor, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {src.tag}
                </span>
              </div>

              <a href={`https://${src.url.replace(/^https?:\/\//, "")}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "block", fontFamily: "var(--mono)", fontSize: 11,
                  color: "#1a56db", textDecoration: "none",
                  background: "#f0f5ff", padding: "5px 10px", borderRadius: 4,
                  marginBottom: 10, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                ↗ {src.url}
              </a>

              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#555" }}>
                  <span style={{ color: "#999", fontSize: 11 }}>단위 </span>{src.unit}
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: src.cost === "무료" || src.cost.startsWith("무료") ? "#0ea86e" : "#d64f2a",
                }}>
                  ✓ {src.cost}
                </div>
              </div>

              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, borderTop: "1px solid #f0ede6", paddingTop: 10 }}>
                {src.note}
              </p>
            </div>
          ))}
        </div>

        {/* 제외된 유료 소스 안내 */}
        <div style={{
          marginTop: 32,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: 10, padding: "16px 20px",
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 4 }}>제외된 유료·협약 소스</div>
            <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7 }}>
              SKT 데이터허브 생활인구 상품, KT BDP 관광 빅데이터, 신한·BC·KB카드 소비 데이터는
              기관 협약 또는 유료 계약이 필요하여 이 목록에서 제외했다.
              소상공인 상권정보·여신금융협회 통계로 소비 패턴을 대체할 수 있다.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
