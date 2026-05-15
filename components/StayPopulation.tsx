"use client";
import { stayPopulationSteps } from "@/lib/data";

export default function StayPopulation() {
  return (
    <section id="population" style={{ padding: "72px 24px", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* 섹션 헤더 */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ width: 40, height: 3, background: "#d64f2a", marginBottom: 14 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
            체류인구 전환 방법론
          </h2>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.6, maxWidth: 620 }}>
            통신사 생활인구 데이터를 실제 축제 방문객(체류인구)으로 전환하는
            <strong> 6단계 표준 프로세스</strong>. 영천시 별빛축제에 바로 적용 가능하다.
          </p>
        </div>

        {/* 개념 구분 표 */}
        <div style={{
          background: "#0a0e1a",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 52,
        }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span className="mono" style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.06em" }}>
              CONCEPT DEFINITIONS
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>개념</th>
                  <th>정의</th>
                  <th>산출 방식</th>
                  <th>한계</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["등록인구", "주민등록상 거주자", "행정안전부 주민등록 통계", "실제 생활권 미반영"],
                  ["생활인구", "특정 시간대 해당 지역에 실제로 있었던 인구", "통신사 기지국 접속 단말 집계", "거주자 포함, 목적 미구분"],
                  ["유동인구", "특정 지점을 통과하거나 체류한 인구 흐름", "카드사·통신사 이동 패턴", "이동 목적 불명확"],
                  ["체류인구 (방문객)", "거주지 외 지역에 일정 시간 이상 체류한 방문 목적 인구", "생활인구 – 등록인구 보정 후 축제 기간 필터", "정확한 필터링 로직 필요"],
                ].map(([concept, def, method, limit], i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, whiteSpace: "nowrap", color: i === 3 ? "#d64f2a" : "inherit" }}>
                      {concept}
                    </td>
                    <td style={{ color: "#ddd" }}>{def}</td>
                    <td className="mono" style={{ fontSize: 12, color: "#aaa" }}>{method}</td>
                    <td style={{ color: "#888", fontSize: 12 }}>{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6단계 스텝 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {stayPopulationSteps.map((step, i) => (
            <div key={step.id} className="card-hover" style={{
              background: "white",
              borderRadius: 12,
              padding: "24px",
              border: `1px solid ${step.color}22`,
              borderLeft: `4px solid ${step.color}`,
              position: "relative",
            }}>
              {/* 스텝 번호 */}
              <div className="mono" style={{
                fontSize: 11, color: step.color,
                letterSpacing: "0.08em", marginBottom: 8,
              }}>
                STEP {step.id}
              </div>

              {/* 제목 */}
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                {step.title}
              </h3>

              {/* 설명 */}
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 12 }}>
                {step.desc}
              </p>

              {/* 소스 */}
              <div style={{
                background: "#f5f3ee",
                borderRadius: 6,
                padding: "8px 12px",
                fontSize: 12,
                color: "#666",
                marginBottom: 8,
              }}>
                <span style={{ fontWeight: 600, color: "#333" }}>▷ 소스: </span>
                {step.source}
              </div>

              {/* 노트 */}
              <div className="mono" style={{
                fontSize: 11, color: step.color,
                background: `${step.color}0d`,
                padding: "6px 10px",
                borderRadius: 4,
              }}>
                {step.note}
              </div>
            </div>
          ))}
        </div>

        {/* 영천 적용 예시 박스 */}
        <div style={{
          marginTop: 40,
          background: "linear-gradient(135deg, #0a0e1a 0%, #1a2035 100%)",
          borderRadius: 12,
          padding: "28px 32px",
          border: "1px solid rgba(214,79,42,0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d64f2a" }} className="pulse" />
            <span className="mono" style={{ color: "#d64f2a", fontSize: 12, letterSpacing: "0.06em" }}>
              영천 별빛축제 적용 예시
            </span>
          </div>
          <div className="code-block" style={{ borderRadius: 8 }}>
            <span style={{ color: "#6a9955" }}># 순증 방문객 계산 (10일 축제 기간 기준)</span>{"\n"}
            festival_visitors = ktdb_visitors_festival_period{"\n"}
            baseline_visitors = ktdb_avg_same_weekday_3yr{"\n\n"}
            <span style={{ color: "#6a9955" }}># Step 4: 축제 유인 효과 분리</span>{"\n"}
            net_visitors = festival_visitors - baseline_visitors{"\n\n"}
            <span style={{ color: "#6a9955" }}># Step 5: 체류 1시간 이상 필터 (KTDB 기본값)</span>{"\n"}
            filtered = net_visitors  <span style={{ color: "#6a9955" }}># KTDB 이미 1시간 기준 적용</span>{"\n\n"}
            <span style={{ color: "#6a9955" }}># Step 6: 스마트폰 보급률 보정 (93%)</span>{"\n"}
            total_estimated = filtered / <span style={{ color: "#b5cea8" }}>0.93</span>
          </div>
        </div>
      </div>
    </section>
  );
}
