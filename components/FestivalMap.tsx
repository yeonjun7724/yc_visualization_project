"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type ViewMode = "scatter" | "heat" | "buffer" | "flow";

interface Venue {
  festival: string; lat: number; lon: number;
  color: number[]; km1: number; km3: number; km5: number;
  eval: string; note: string;
}
interface InflowItem { region: string; ratio: number; lat: number; lon: number; }
interface AppData {
  buffer: Venue[];
  inflow: InflowItem[];
  visitors: { year: number; visitors: number; acc_rate: number }[];
  stay: { type: string; minutes: number; color: string }[];
}

const VENUE_ICONS = ["★", "●", "▲"];
const TABS: { v: ViewMode; label: string }[] = [
  { v: "scatter", label: "상가 분포" },
  { v: "heat",    label: "밀도 히트맵" },
  { v: "buffer",  label: "버퍼 분석" },
  { v: "flow",    label: "OD 흐름" },
];
const CAT_COLORS = [
  "#d64f2a","#1a56db","#7c3aed","#0ea86e","#f0b429",
  "#95a5a6","#e74c3c","#9b59b6","#3498db","#2ecc71",
];
const DONG = [
  { dong:"완산동", lat:35.9633, lon:128.9381, count:809 },
  { dong:"야사동", lat:35.9745, lon:128.9444, count:611 },
  { dong:"문외동", lat:35.9724, lon:128.9365, count:446 },
  { dong:"금호읍", lat:35.9316, lon:128.8816, count:421 },
  { dong:"망정동", lat:35.9822, lon:128.9528, count:363 },
  { dong:"신녕면", lat:36.0442, lon:128.7812, count:218 },
  { dong:"고경면", lat:35.9903, lon:129.0310, count:181 },
  { dong:"청통면", lat:35.9901, lon:128.8292, count:146 },
  { dong:"금노동", lat:35.9590, lon:128.9305, count:145 },
  { dong:"문내동", lat:35.9713, lon:128.9318, count:120 },
  { dong:"화북면", lat:36.1403, lon:128.9967, count:89  },
  { dong:"임고면", lat:36.0122, lon:129.0145, count:76  },
  { dong:"북안면", lat:36.0321, lon:128.8633, count:65  },
];

export default function FestivalMap() {
  const mapRef    = useRef<HTMLDivElement>(null);
  const LRef      = useRef<any>(null);
  const mapObjRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  const [view, setView]         = useState<ViewMode>("scatter");
  const [appData, setAppData]   = useState<AppData | null>(null);
  const [shops, setShops]       = useState<number[][]>([]);
  const [selVenue, setSelVenue] = useState<number | null>(null);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    fetch("/appdata.json").then(r => r.json()).then(setAppData).catch(console.error);
    fetch("/shops.json").then(r => r.json()).then((d: number[][]) => setShops(d)).catch(console.error);
  }, []);

  /* Leaflet 초기화 — useEffect 안에서만 실행 (SSR 안전) */
  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;

    import("leaflet").then(mod => {
      const L = (mod.default ?? mod) as any;
      LRef.current = L;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [35.972, 128.935], zoom: 11,
        zoomControl: false, attributionControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd", maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapObjRef.current = map;
      setReady(true);
    });

    return () => {
      if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null; }
    };
  }, []);

  const renderLayers = useCallback((v: ViewMode) => {
    const L   = LRef.current;
    const map = mapObjRef.current;
    if (!L || !map || !appData) return;

    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];
    const add = (layer: any) => { layer.addTo(map); layersRef.current.push(layer); };

    /* scatter */
    if (v === "scatter" && shops.length > 0) {
      shops.forEach(([lo, la, ci]) => {
        add(L.circleMarker([la / 10000, lo / 10000], {
          radius: 2.5, color: "transparent",
          fillColor: CAT_COLORS[ci] ?? "#888", fillOpacity: 0.78, weight: 0,
        }));
      });
      DONG.forEach(d => {
        add(L.marker([d.lat, d.lon], {
          interactive: false,
          icon: L.divIcon({
            className: "",
            html: `<div style="font-size:10px;color:rgba(255,255,255,0.7);white-space:nowrap;text-shadow:0 1px 3px #000">${d.dong} <span style="color:rgba(255,255,255,0.4);font-size:9px">${d.count}</span></div>`,
            iconAnchor: [22, 0],
          }),
        }));
      });
    }

    /* heat */
    if (v === "heat") {
      DONG.forEach(d => {
        const intens = d.count / 809;
        const col = intens > 0.7 ? "#ff3030" : intens > 0.4 ? "#ffa028" : intens > 0.2 ? "#32c864" : "#3264ff";
        add(L.circle([d.lat, d.lon], { radius: Math.max(500, d.count * 28), color: col, fillColor: col, fillOpacity: 0.28, weight: 0 }));
        add(L.marker([d.lat, d.lon], {
          interactive: false,
          icon: L.divIcon({
            className: "",
            html: `<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.85);text-shadow:0 1px 4px #000;white-space:nowrap">${d.dong} <span style="color:${col}">${d.count}</span></div>`,
            iconAnchor: [24, 0],
          }),
        }));
      });
    }

    /* buffer */
    if (v === "buffer") {
      appData.buffer.forEach((venue, vi) => {
        const [r, g, b] = venue.color;
        const hex = `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
        [
          { km: 5, fo: 0.06, sw: 1.2, so: 0.28, dash: "6,5" },
          { km: 3, fo: 0.11, sw: 1.6, so: 0.55, dash: "5,4" },
          { km: 1, fo: 0.20, sw: 2.5, so: 0.95, dash: "" },
        ].forEach(({ km, fo, sw, so, dash }) => {
          add(L.circle([venue.lat, venue.lon], {
            radius: km * 1000, color: hex, fillColor: hex, fillOpacity: fo,
            weight: sw, opacity: so, dashArray: dash || undefined,
          }).bindTooltip(`${venue.festival} — ${km}km 반경`, { permanent: false, direction: "top" }));
          add(L.marker([venue.lat + km * 0.009, venue.lon], {
            interactive: false,
            icon: L.divIcon({
              className: "",
              html: `<div style="font-size:9px;color:${hex};font-weight:600;text-shadow:0 1px 3px #000">${km}km</div>`,
              iconAnchor: [8, 0],
            }),
          }));
        });
        add(L.marker([venue.lat, venue.lon], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:30px;height:30px;border-radius:50%;background:${hex};display:flex;align-items:center;justify-content:center;font-size:14px;color:white;font-weight:700;box-shadow:0 0 14px ${hex}99;border:2px solid rgba(255,255,255,0.3)">${VENUE_ICONS[vi]}</div>`,
            iconSize: [30, 30], iconAnchor: [15, 15],
          }),
        }).bindPopup(`
          <div style="font-family:'Noto Sans KR',sans-serif;min-width:185px">
            <b style="font-size:13px">${VENUE_ICONS[vi]} ${venue.festival}</b>
            <div style="font-size:11px;color:#555;line-height:1.9;margin-top:5px">
              1km 반경: <b>${venue.km1.toLocaleString()}개</b><br>
              3km 반경: <b>${venue.km3.toLocaleString()}개</b><br>
              5km 반경: <b>${venue.km5.toLocaleString()}개</b><br>
              낙수 평가: <b>${venue.eval}</b>
            </div>
            <div style="font-size:10px;color:#888;margin-top:4px">${venue.note}</div>
          </div>
        `, { maxWidth: 230 }));
      });
      DONG.slice(0, 6).forEach(d => {
        add(L.circleMarker([d.lat, d.lon], {
          radius: Math.sqrt(d.count / 50) * 4,
          color: "transparent", fillColor: "#1a56db", fillOpacity: 0.3,
        }));
      });
    }

    /* flow */
    if (v === "flow") {
      const YC = { lat: 35.972, lon: 128.934 };
      appData.inflow.forEach(o => {
        const w  = Math.max(1.5, (o.ratio / 19.5) * 9);
        const op = 0.3 + (o.ratio / 19.5) * 0.6;
        const midLat = (o.lat + YC.lat) / 2 + (o.lon - YC.lon) * 0.18;
        const midLon = (o.lon + YC.lon) / 2 - (o.lat - YC.lat) * 0.18;
        const pts: [number, number][] = [];
        for (let t = 0; t <= 1.001; t += 0.04) {
          pts.push([
            (1-t)*(1-t)*o.lat + 2*(1-t)*t*midLat + t*t*YC.lat,
            (1-t)*(1-t)*o.lon + 2*(1-t)*t*midLon + t*t*YC.lon,
          ]);
        }
        add(L.polyline(pts, { color: "#1a56db", weight: w, opacity: op, smoothFactor: 1 })
          .bindTooltip(`${o.region} → 영천시: ${o.ratio}%`, { direction: "center" }));
        const sz = Math.max(9, o.ratio * 0.95);
        add(L.marker([o.lat, o.lon], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:${sz}px;height:${sz}px;background:rgba(255,210,80,0.92);border-radius:50%;border:1.5px solid rgba(255,255,255,0.4);box-shadow:0 0 8px rgba(255,210,80,0.6)"></div>`,
            iconSize: [sz, sz], iconAnchor: [sz/2, sz/2],
          }),
        }).bindTooltip(`<b>${o.region}</b><br>유입 비율: <b>${o.ratio}%</b>`, { direction: "top" }));
        add(L.marker([o.lat, o.lon], {
          interactive: false,
          icon: L.divIcon({
            className: "",
            html: `<div style="font-size:10px;color:rgba(255,255,255,0.8);text-shadow:0 1px 3px #000;white-space:nowrap">${o.region} <b style="color:rgba(255,210,80,0.9)">${o.ratio}%</b></div>`,
            iconAnchor: [22, -12],
          }),
        }));
      });
      add(L.marker([YC.lat, YC.lon], {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:38px;height:38px;border-radius:50%;background:#d64f2a;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;box-shadow:0 0 20px rgba(214,79,42,0.85);border:2px solid rgba(255,255,255,0.3)">영천</div>`,
          iconSize: [38, 38], iconAnchor: [19, 19],
        }),
      }).bindPopup("<b>영천시 중심</b><br>3개 축제장 운영 중", { maxWidth: 160 }));
    }

    /* 공통: 축제장 마커 (buffer 제외) */
    if (v !== "buffer") {
      appData.buffer.forEach((venue, vi) => {
        const [r, g, b] = venue.color;
        const hex = `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
        add(L.marker([venue.lat, venue.lon], {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:28px;height:28px;border-radius:50%;background:${hex};display:flex;align-items:center;justify-content:center;font-size:13px;color:white;font-weight:700;box-shadow:0 0 12px ${hex}88;border:2px solid rgba(255,255,255,0.25)">${VENUE_ICONS[vi]}</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14],
          }),
        }).bindPopup(`
          <div style="font-family:'Noto Sans KR',sans-serif;min-width:170px">
            <b style="font-size:13px">${VENUE_ICONS[vi]} ${venue.festival}</b>
            <div style="font-size:11px;color:#555;line-height:1.8;margin-top:4px">
              1km 상가: <b>${venue.km1.toLocaleString()}개</b><br>
              낙수 평가: <b>${venue.eval}</b>
            </div>
            <div style="font-size:10px;color:#888;margin-top:3px">${venue.note}</div>
          </div>
        `, { maxWidth: 210 }));
      });
    }
  }, [appData, shops]);

  useEffect(() => {
    if (ready && appData && (view !== "scatter" || shops.length > 0)) {
      renderLayers(view);
    }
  }, [ready, view, appData, shops, renderLayers]);

  const flyToVenue = (i: number) => {
    const map   = mapObjRef.current;
    const venue = appData?.buffer[i];
    if (!map || !venue) return;
    const next  = selVenue === i ? null : i;
    setSelVenue(next);
    if (next !== null) { map.flyTo([venue.lat, venue.lon], 13, { duration: 1.2 }); setView("buffer"); }
    else               { map.flyTo([35.972, 128.935], 11, { duration: 1.0 }); }
  };

  const legendItems = {
    scatter: ["음식","소매","수리·개인","과학·기술","시설관리·임대","부동산","예술·스포츠","숙박","교육","보건의료"].map((n,i)=>({ label:n, color:CAT_COLORS[i] })),
    heat:    [["#ff3030","최고 밀집 (700+)"],["#ffa028","고밀집 (350~700)"],["#32c864","중밀집 (150~350)"],["#3264ff","저밀집 (~150)"]].map(([c,l])=>({ label:l as string, color:c as string })),
    buffer:  appData?.buffer.map((venue,i)=>({ label:`${VENUE_ICONS[i]} ${venue.festival.slice(0,6)}`, color:`rgb(${venue.color[0]},${venue.color[1]},${venue.color[2]})` })) ?? [],
    flow:    [{ label:"유입 출발지", color:"rgba(255,210,80,0.9)" },{ label:"Arc 흐름 (두께=비율)", color:"rgba(26,86,219,0.9)" },{ label:"영천시 중심", color:"rgba(214,79,42,0.9)" }],
  };

  return (
    <section style={{ background: "#0a0e1a" }}>
      <div style={{ padding: "20px 24px 12px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 6 }}>
          <span className="chip" style={{ background:"rgba(214,79,42,0.18)",color:"#d64f2a",border:"1px solid rgba(214,79,42,0.3)",marginRight:6 }}>영천시 공공데이터·AI 활용 경진대회</span>
          <span className="chip" style={{ background:"rgba(26,86,219,0.14)",color:"#7aadff",border:"1px solid rgba(26,86,219,0.25)" }}>데이터 시각화 부문</span>
        </div>
        <h1 className="display" style={{ fontSize:"clamp(22px,3.5vw,38px)",fontWeight:800,color:"white",lineHeight:1.1,marginBottom:5 }}>
          지역소멸 대응을 위한<br/>
          <span style={{ color:"#d64f2a" }}>영천시 공간정보 기반</span> 축제 분석
        </h1>
        <p style={{ color:"rgba(255,255,255,0.42)",fontSize:13 }}>
          소상공인 상가 4,833개 · 축제장 3곳 · 2022–2024 · 팀 김연준·백승호·유현채
        </p>
      </div>

      <div style={{ maxWidth:1400,margin:"0 auto",padding:"0 24px 0",display:"grid",gridTemplateColumns:"1fr 270px",gap:0 }}>

        {/* 지도 */}
        <div style={{ position:"relative",borderRadius:"12px 0 0 12px",overflow:"hidden",height:700 }}>
          {/* 탭 */}
          <div style={{ position:"absolute",top:10,left:10,zIndex:1000,display:"flex",gap:4,flexWrap:"wrap" }}>
            {TABS.map(({ v, label }) => (
              <button key={v} onClick={() => setView(v)} style={{
                fontSize:11,padding:"5px 13px",borderRadius:5,cursor:"pointer",
                border:view===v?"1px solid rgba(26,86,219,0.8)":"1px solid rgba(255,255,255,0.18)",
                background:view===v?"rgba(26,86,219,0.28)":"rgba(13,17,23,0.82)",
                color:view===v?"#7aadff":"rgba(255,255,255,0.6)",
                transition:"all .15s",
              }}>{label}</button>
            ))}
          </div>

          {/* 배지 */}
          <div className="mono" style={{ position:"absolute",top:10,right:10,zIndex:1000,fontSize:9,color:"rgba(255,255,255,0.3)",background:"rgba(0,0,0,0.55)",padding:"2px 8px",borderRadius:4 }}>
            Leaflet · OSM · CARTO Dark · {shops.length.toLocaleString()} pts
          </div>

          {/* 범례 */}
          <div style={{ position:"absolute",bottom:38,left:10,zIndex:1000,background:"rgba(13,17,23,0.92)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"9px 12px",minWidth:148 }}>
            <div className="mono" style={{ fontSize:9,color:"rgba(255,255,255,0.32)",letterSpacing:".07em",marginBottom:7 }}>
              {view==="scatter"?"업종 분류":view==="heat"?"밀집 강도":view==="buffer"?"축제장 반경":"OD 흐름"}
            </div>
            {(legendItems[view] ?? []).map(({ label, color }) => (
              <div key={label} style={{ display:"flex",alignItems:"center",gap:5,marginBottom:3 }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:color,flexShrink:0 }}/>
                <span style={{ fontSize:10,color:"rgba(255,255,255,0.65)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* 지도 DOM */}
          <div ref={mapRef} style={{ width:"100%",height:"100%",background:"#0d1117" }}/>
        </div>

        {/* 사이드 패널 */}
        <div style={{ background:"#111620",border:"1px solid rgba(255,255,255,0.07)",borderLeft:"none",borderRadius:"0 12px 12px 0",padding:12,display:"flex",flexDirection:"column",gap:8,overflowY:"auto",maxHeight:700,scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.2) transparent" }} className="side-panel">

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
            {[{v:"4,833",l:"영천시 상가",c:"#7aadff"},{v:"40",l:"읍면동 수",c:"rgba(255,255,255,0.7)"},{v:"0개",l:"보현산 1km",c:"#e74c3c"},{v:"1,583",l:"한약 1km",c:"#2ecc71"}].map(({v,l,c})=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"6px 8px",textAlign:"center" }}>
                <div className="mono" style={{ fontSize:16,fontWeight:700,color:c }}>{v}</div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.38)",marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden" }}>
            <div className="mono" style={{ padding:"6px 11px",background:"rgba(255,255,255,0.04)",fontSize:9,color:"rgba(255,255,255,0.38)",letterSpacing:".06em",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>분석 결론</div>
            <div style={{ padding:10 }}>
              {[
                {icon:"✅",t:"방문객 유입 효과 확인",d:"+9.7%",c:"#2ecc71"},
                {icon:"⚠️",t:"체류 전환 실패",d:"1,075 < 1,478분",c:"#e74c3c"},
                {icon:"📊",t:"소비 불균등 낙수",d:"쇼핑44%·숙박1.4%",c:"#f0b429"},
                {icon:"🗺️",t:"공간 낙수 구조 차이",d:"보현산 0 vs 한약 1,583",c:"#7c3aed"},
              ].map(({icon,t,d,c})=>(
                <div key={t} style={{ display:"flex",gap:5,marginBottom:4,paddingBottom:4,borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center" }}>
                  <span style={{ fontSize:14,flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:10,fontWeight:700,color:"white" }}>{t}</div>
                    <div style={{ fontSize:9,color:"rgba(255,255,255,0.38)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {appData && (
            <div style={{ border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden" }}>
              <div className="mono" style={{ padding:"6px 11px",background:"rgba(255,255,255,0.04)",fontSize:9,color:"rgba(255,255,255,0.38)",letterSpacing:".06em",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>축제장 선택 — 버퍼 분석</div>
              <div style={{ padding:8,display:"flex",flexDirection:"column",gap:5 }}>
                {appData.buffer.map((venue, i) => (
                  <div key={venue.festival} onClick={() => flyToVenue(i)} style={{
                    padding:"5px 8px",borderRadius:7,cursor:"pointer",transition:"all .15s",
                    border:`1px solid ${selVenue===i?`rgba(${venue.color[0]},${venue.color[1]},${venue.color[2]},0.6)`:"rgba(255,255,255,0.06)"}`,
                    background:selVenue===i?`rgba(${venue.color[0]},${venue.color[1]},${venue.color[2]},0.1)`:"rgba(255,255,255,0.02)",
                  }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"white",marginBottom:3 }}>{VENUE_ICONS[i]} {venue.festival}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.38)",marginBottom:2 }}>
                      <span>1km <b style={{color:"white"}}>{venue.km1.toLocaleString()}</b></span>
                      <span>3km <b style={{color:"white"}}>{venue.km3.toLocaleString()}</b></span>
                      <span>5km <b style={{color:"white"}}>{venue.km5.toLocaleString()}</b></span>
                    </div>
                    <div style={{ height:3,background:"rgba(255,255,255,0.06)",borderRadius:2 }}>
                      <div style={{ height:"100%",width:`${venue.km1/1583*100}%`,background:`rgb(${venue.color[0]},${venue.color[1]},${venue.color[2]})`,borderRadius:2 }}/>
                    </div>
                    <div style={{ fontSize:9,color:`rgba(${venue.color[0]},${venue.color[1]},${venue.color[2]},0.8)`,marginTop:2 }}>{venue.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,overflow:"hidden" }}>
            <div className="mono" style={{ padding:"6px 11px",background:"rgba(255,255,255,0.04)",fontSize:9,color:"rgba(255,255,255,0.38)",letterSpacing:".06em",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>4대 정책 제언</div>
            <div style={{ padding:10 }}>
              {[{n:"01",t:"보현산 연계 상권 개발",c:"#7c3aed",tag:"공간"},{n:"02",t:"체류형 관광 인프라 강화",c:"#e74c3c",tag:"체류"},{n:"03",t:"광역 유입 확대 전략",c:"#2ecc71",tag:"마케팅"},{n:"04",t:"데이터 상시 모니터링",c:"#1a56db",tag:"거버넌스"}].map(({n,t,c,tag})=>(
                <div key={n} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                  <span className="mono" style={{ fontSize:9,color:"rgba(255,255,255,0.22)",flexShrink:0 }}>{n}</span>
                  <div style={{ flex:1,fontSize:10,color:"white" }}>{t}</div>
                  <span style={{ fontSize:9,padding:"1px 5px",borderRadius:3,background:`${c}1f`,color:c,flexShrink:0 }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
