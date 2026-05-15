"use client";

const workflowSteps = [
  {
    phase: "Phase 1",
    title: "데이터 수집",
    color: "#d64f2a",
    items: [
      "KTDB 월별 방문자수·숙박률 (3·5·10월)",
      "KTDB 평균 체류시간",
      "KTDB 외지인 관광소비 추이",
      "KTDB 유입 출발지 분포",
      "소상공인 상가업소 현황 (2023Q2)",
      "읍면동 경계 SHP (2023년 7월)",
    ]
  },
  {
    phase: "Phase 2",
    title: "전처리 & EDA",
    color: "#1a56db",
    items: [
      "UTF-8 / CP949 인코딩 자동 감지",
      "축제 유형 플래그 추가 (3월=베이스라인)",
      "운송업 제외 버전 별도 분석",
      "체류시간 역설(3월>5월) 주석 처리",
      "유입 Top10 비율 계산",
      "거리별(근거리L·원거리H) 구분 집계",
    ]
  },
  {
    phase: "Phase 3",
    title: "공간 분석",
    color: "#7c3aed",
    items: [
      "읍면동 경계 × 상가 포인트 조인",
      "1km · 3km · 5km 동심원 버퍼 생성",
      "축제장별 반경 내 상가 수 집계",
      "읍면동별 상가 분포 코로플레스",
      "보현산(0개) vs 한약(1,583개) 비교",
      "KDE 핫스팟 지도 작성",
    ]
  },
  {
    phase: "Phase 4",
    title: "심층 분석",
    color: "#0ea86e",
    items: [
      "준실험 설계: 3월 베이스라인 비교",
      "식음료 +27.6% / 쇼핑 +23.3% 소비 증가 확인",
      "숙박 소비 미미 → 낙수효과 제한 진단",
      "경산시(19.5%) 중심 광역 흡인력 분석",
      "투입-산출 분석 (ECOS 유발 계수)",
      "공간 자기상관 (Moran's I)",
    ]
  },
  {
    phase: "Phase 5",
    title: "결론 & 정책 제언",
    color: "#f0b429",
    items: [
      "4대 결론 도출 (유입·체류·소비·공간)",
      "보현산 연계 상권 개발 제언",
      "체류형 관광 전환 인프라 강화",
      "광역 유입 확대 전략 (KTX 연계)",
      "데이터 기반 정기 모니터링 체계",
      "공모전 제출 보고서 완성",
    ]
  },
];

const ioTable = [
  ["방문객 1인당 지출액 추정", "업종별 소비액(KTDB) ÷ 체류인구(보정값)", "KTDB 관광소비, 방문자수"],
  ["총 지출액 = 방문객 수 × 1인당 지출액", "체류인구 전환값 × 지출액 단가", "KTDB 방문객, 보정계수 0.93"],
  ["생산 유발 = 총 지출액 × 계수", "한국은행 지역산업연관표 '숙박·음식업' 계수 적용", "ECOS 산업연관표"],
  ["취업 유발 = 총 지출액 × 계수", "취업 유발 계수 (단위: 명/10억 원)", "ECOS 산업연관표"],
];

export default function Workflow() {
  return (
    <section id="workflow" style={{
      padding: "72px 24px",
      background: "var(--paper2)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ width: 40, height: 3, background: "#0ea86e", marginBottom: 14 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>영천시 적용 워크플로</h2>
          <p style={{ color: "#555", fontSize: 15 }}>
            Google Colab 기반 5단계 분석 파이프라인 — 실제 EDA 코드 로직 반영
          </p>
        </div>

        {/* 파이프라인 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 56,
        }}>
          {workflowSteps.map((step) => (
            <div key={step.phase} style={{
              background: "white",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #e0ddd6",
            }}>
              <div style={{
                background: step.color,
                padding: "12px 16px",
              }}>
                <div className="mono" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: "0.06em" }}>
                  {step.phase}
                </div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginTop: 2 }}>
                  {step.title}
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                {step.items.map((item, j) => (
                  <div key={j} style={{
                    display: "flex", gap: 8, marginBottom: 7,
                    alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: step.color, flexShrink: 0, marginTop: 6,
                    }} />
                    <span style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 경제 파급효과 워크플로 테이블 */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            투입-산출 분석 단계별 산정 워크플로
          </h3>

          <div style={{ background: "#0a0e1a", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em" }}>
                INPUT-OUTPUT ANALYSIS WORKFLOW
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 200 }}>단계</th>
                    <th>산출 방법</th>
                    <th>필요 데이터</th>
                  </tr>
                </thead>
                <tbody>
                  {ioTable.map(([step, method, data], i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#d64f2a", fontSize: 12 }}>{step}</td>
                      <td style={{ color: "#ccc" }}>{method}</td>
                      <td className="mono" style={{ fontSize: 11, color: "#0ea86e" }}>{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 한계 및 보완 */}
        <div style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 14,
        }}>
          {[
            { title: "체류시간 역설", desc: "3월 평균 1,478분 > 축제 달 1,075분. 비수기 장기체류 편중 효과로 주석 처리 필요.", color: "#e74c3c" },
            { title: "운송업 제외 분석", desc: "운송업 포함 시 소비 구조 왜곡. 식음료·쇼핑·숙박 낙수효과 파악을 위해 운송업 제외 버전 병행.", color: "#f0b429" },
            { title: "귀인 문제", desc: "3개년 동 요일 대조 기간 설정. 계절성 vs. 축제 효과 분리. 코로나 2020–2021 제외.", color: "#7c3aed" },
            { title: "단말 편향", desc: "고령층 보급률 보정. 스마트폰 보급률 93% 적용(÷0.93). 연령별 가중치 적용 권장.", color: "#1a56db" },
            { title: "공간 해상도 한계", desc: "읍면동 단위 상가 집계. 실제 동선과 소비 장소의 불일치 가능성. 카드 매출 지점 데이터로 보완 필요.", color: "#0ea86e" },
          ].map(item => (
            <div key={item.title} style={{
              background: "white",
              borderRadius: 8,
              padding: "16px",
              borderLeft: `3px solid ${item.color}`,
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: item.color }}>
                ⚠ {item.title}
              </div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
