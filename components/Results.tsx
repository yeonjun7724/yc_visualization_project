"use client";
import { conclusions, policyRecommendations, analysisResults } from "@/lib/data";

export default function Results() {
  const { visitors, stayTime, accommodation, inflow, buffer } = analysisResults;

  return (
    <section id="results" style={{ padding: "72px 24px", background: "#0a0e1a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* 섹션 헤더 */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ width: 40, height: 3, background: "#e74c3c", marginBottom: 14 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 10 }}>
            분석 결과 요약
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
            2022–2024년 3개년 · 3월 베이스라인 vs 5월 한약축제 vs 10월 가을축제 준실험 설계
          </p>
        </div>

        {/* EDA 수치 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 56 }}>

          {/* 방문자수 */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "24px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em", marginBottom: 14 }}>EDA 1 — 방문자수 & 숙박률</div>
            {[visitors.baseline, visitors.herb, visitors.autumn].map((d) => (
              <div key={d.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{d.label}</span>
                  <span style={{ color: d.color, fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700 }}>
                    {(d.value / 10000).toFixed(1)}만명
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${(d.value / 1100000) * 100}%`, background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginBottom: 8 }}>숙박률 비교</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[accommodation.baseline, accommodation.herb, accommodation.autumn].map(d => (
                  <div key={d.label} style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                    <div style={{ color: d.color, fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700 }}>{d.rate}%</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 2 }}>{d.label.split("(")[0]}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, color: "#f0b429", fontSize: 11 }}>
                ⚠ 축제 달과 비축제 달 간 숙박률 차이 미미 (최대 0.8%p)
              </div>
            </div>
          </div>

          {/* 체류시간 역설 */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "24px", border: "1px solid rgba(231,76,60,0.3)" }}>
            <div className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em", marginBottom: 14 }}>EDA 2 — 체류시간 (역설적 결과)</div>
            {[stayTime.baseline, stayTime.herb, stayTime.autumn].map((d) => (
              <div key={d.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{d.label}</span>
                  <span style={{ color: d.color, fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700 }}>
                    {d.minutes}분 ({(d.minutes / 60).toFixed(1)}h)
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${(d.minutes / 1600) * 100}%`, background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{
              marginTop: 14, padding: "12px", borderRadius: 8,
              background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.2)"
            }}>
              <div style={{ color: "#e74c3c", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>역설 해석</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6 }}>
                3월(비수기)은 소수이지만 장기체류 관광객 위주.<br />
                축제 기간에는 단기 당일 방문객이 대거 유입됨.<br />
                → <span style={{ color: "#f0b429" }}>당일 방문 편중 현상</span> 구조적 확인
              </div>
            </div>
          </div>

          {/* 유입 출발지 */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "24px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em", marginBottom: 14 }}>EDA 4 — 주요 유입 출발지 Top10</div>
            {inflow.map((item, i) => (
              <div key={item.region} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span className="mono" style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, width: 16 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{item.region}</span>
                    <span style={{ color: "#1a56db", fontFamily: "var(--mono)", fontSize: 11 }}>{item.ratio}%</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${(item.ratio / 20) * 100}%`, background: "#1a56db", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, color: "#f0b429", fontSize: 11 }}>
              ⚠ 상위 3개 지역(경산·대구동구·수성구) 약 42% 집중 → 광역 흡인력 제한적
            </div>
          </div>
        </div>

        {/* 버퍼 분석 테이블 */}
        <div style={{ marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>공간 분석: 축제장 반경별 상가 수</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>
            소상공인 상가 데이터(2023Q2) × 읍면동 경계 SHP — 동심원 버퍼 분석
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>축제</th>
                  <th>0–1km 상가 수</th>
                  <th>0–3km 상가 수</th>
                  <th>0–5km 상가 수</th>
                  <th>낙수효과 구조 진단</th>
                </tr>
              </thead>
              <tbody>
                {buffer.map((row) => (
                  <tr key={row.festival}>
                    <td style={{ fontWeight: 700, color: row.color }}>{row.festival}</td>
                    <td className="mono" style={{ color: row.km1 === 0 ? "#e74c3c" : "#2ecc71", fontWeight: 700 }}>
                      {row.km1.toLocaleString()}개
                    </td>
                    <td className="mono" style={{ color: "rgba(255,255,255,0.6)" }}>{row.km3.toLocaleString()}개</td>
                    <td className="mono" style={{ color: "rgba(255,255,255,0.6)" }}>{row.km5.toLocaleString()}개</td>
                    <td style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4대 결론 */}
        <div style={{ marginBottom: 56 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 20 }}>종합 결론</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {conclusions.map((c) => (
              <div key={c.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${c.color}33`,
                borderLeft: `3px solid ${c.color}`,
                borderRadius: 10, padding: "20px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <span className="chip" style={{ background: `${c.color}22`, color: c.color, fontSize: 10 }}>{c.badge}</span>
                </div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{c.title}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4대 정책 제언 */}
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 20 }}>정책 제언</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {policyRecommendations.map((p) => (
              <div key={p.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "20px",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span className="mono" style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{p.id}</span>
                  <span className="chip" style={{ background: `${p.color}22`, color: p.color, fontSize: 10 }}>{p.tag}</span>
                </div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{p.title}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
