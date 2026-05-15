"use client";
import { useState } from "react";
import { analysisMethodologies } from "@/lib/data";

export default function Methods() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = analysisMethodologies.find(m => m.id === selected);

  return (
    <section id="methods" style={{ padding: "72px 24px", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ width: 40, height: 3, background: "#7c3aed", marginBottom: 14 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>분석 방법론</h2>
          <p style={{ color: "#555", fontSize: 15 }}>
            카드를 클릭하면 공식·도구를 확인할 수 있다.
          </p>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>

          {/* 카드 그리드 */}
          <div style={{
            flex: "1 1 520px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 14,
            alignContent: "start",
          }}>
            {analysisMethodologies.map(m => {
              const isSelected = selected === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(isSelected ? null : m.id)}
                  style={{
                    background: isSelected ? "#0a0e1a" : "white",
                    border: isSelected ? `2px solid ${m.categoryColor}` : "2px solid #e0ddd6",
                    borderRadius: 10,
                    padding: "18px 18px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--sans)",
                    transition: "all 0.18s",
                  }}
                >
                  <div className="chip" style={{
                    background: `${m.categoryColor}18`,
                    color: m.categoryColor,
                    marginBottom: 10,
                  }}>
                    {m.category}
                  </div>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: isSelected ? "white" : "#0a0e1a",
                    marginBottom: 4,
                  }}>
                    {m.title}
                  </div>
                  <div className="mono" style={{
                    fontSize: 10,
                    color: isSelected ? "rgba(255,255,255,0.4)" : "#999",
                    letterSpacing: "0.03em",
                  }}>
                    {m.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 디테일 패널 */}
          <div style={{ flex: "1 1 300px", minWidth: 280 }}>
            {active ? (
              <div style={{
                background: "#0a0e1a",
                borderRadius: 12,
                padding: "28px",
                position: "sticky",
                top: 72,
                border: `1px solid ${active.categoryColor}44`,
              }}>
                <div className="chip" style={{
                  background: `${active.categoryColor}22`,
                  color: active.categoryColor,
                  marginBottom: 14,
                }}>
                  {active.category}
                </div>

                <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                  {active.title}
                </h3>
                <div className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 18 }}>
                  {active.subtitle}
                </div>

                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  {active.desc}
                </p>

                <div style={{ marginBottom: 24 }}>
                  <div className="mono" style={{
                    color: active.categoryColor, fontSize: 10,
                    letterSpacing: "0.08em", marginBottom: 10,
                  }}>
                    FORMULAS / PROCESS
                  </div>
                  {active.formulas.map((f, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, marginBottom: 8,
                      alignItems: "flex-start",
                    }}>
                      <span style={{
                        minWidth: 18, height: 18,
                        background: active.categoryColor,
                        borderRadius: 3,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "white", fontWeight: 700, flexShrink: 0, marginTop: 2,
                      }}>{i + 1}</span>
                      <span className="mono" style={{ fontSize: 12, color: "#a8d8a8", lineHeight: 1.5 }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mono" style={{
                    color: "rgba(255,255,255,0.4)", fontSize: 10,
                    letterSpacing: "0.08em", marginBottom: 10,
                  }}>
                    TOOLS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {active.tools.map(t => (
                      <span key={t} className="chip" style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.7)",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: "white",
                border: "2px dashed #ddd",
                borderRadius: 12,
                padding: "40px 28px",
                textAlign: "center",
                color: "#aaa",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
                <div style={{ fontSize: 14 }}>방법론 카드를 클릭하면<br />상세 내용이 표시됩니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
