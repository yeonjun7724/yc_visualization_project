"use client";

export default function Hero() {
  return (
    <section id="overview" style={{
      background: "#0a0e1a", position: "relative",
      overflow: "hidden", padding: "80px 24px 72px",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div style={{
        position: "absolute", top: -80, right: -80, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(214,79,42,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 400, height: 400,
        background: "radial-gradient(circle, rgba(26,86,219,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <span className="chip" style={{ background: "#d64f2a", color: "white" }}>영천시 축제 분석</span>
          <span className="chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>공간경제 효과 분석</span>
          <span className="chip" style={{ background: "#0ea86e22", color: "#0ea86e" }}>2022–2024</span>
        </div>

        <h1 style={{
          fontFamily: "var(--display)", fontSize: "clamp(32px, 5vw, 58px)",
          fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 20,
        }}>
          영천시 축제<br />
          <span style={{ color: "#d64f2a" }}>낙수효과</span> 정량 분석
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.8,
          maxWidth: 600, marginBottom: 40,
        }}>
          한약축제·별빛축제·와인페스타 등 영천시 주요 축제의 방문자 유입, 체류, 소비 패턴과
          공간적 낙수효과를 한국관광데이터랩·소상공인 데이터·공간 GIS로 정량 분석한 결과입니다.
        </p>

        {/* 핵심 수치 요약 카드 */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "축제 달 방문자 증가", value: "+14–15%", sub: "베이스라인(3월) 대비", color: "#2ecc71" },
            { label: "보현산 1km 반경 상가", value: "0개", sub: "낙수 구조 자체 부재", color: "#e74c3c" },
            { label: "식음료업 소비 증가", value: "+27.6%", sub: "한약축제 vs 베이스라인", color: "#f0b429" },
            { label: "숙박률 차이", value: "0.8%p", sub: "8.2% → 9.0% (미미)", color: "#7c3aed" },
          ].map(item => (
            <div key={item.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${item.color}33`,
              borderLeft: `3px solid ${item.color}`,
              borderRadius: 8, padding: "14px 18px",
              minWidth: 160,
            }}>
              <div style={{ color: item.color, fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700 }}>
                {item.value}
              </div>
              <div style={{ color: "white", fontSize: 12, fontWeight: 600, marginTop: 2 }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* 분석 대상 축제 */}
        <div style={{ marginTop: 36, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginRight: 4 }}>분석 대상:</span>
          {["영천한약축제 (5월)", "보현산별빛축제 (10월)", "영천와인페스타 (10월)", "별빛한우명품구이축제 (10월)", "영천문화예술제 (10월)"].map(f => (
            <span key={f} className="chip" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>{f}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
