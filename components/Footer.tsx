"use client";
export default function Footer() {
  const links: Record<string, string> = {
    "개요": "overview", "분석 결과": "results", "체류인구": "population",
    "데이터 소스": "sources", "시각화 기법": "viz",
    "분석 방법론": "methods", "워크플로": "workflow",
  };
  return (
    <footer style={{ background: "#0a0e1a", padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 4 }}>영천시 축제 데이터랩</div>
          <div className="mono" style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            무료 데이터 소스 · 체류인구 전환 · 시각화 공모전 가이드 · 2026
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {Object.entries(links).map(([label, href]) => (
            <a key={label} href={`#${href}`}
              style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 12, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
