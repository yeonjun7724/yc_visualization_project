"use client";
import { useEffect, useRef, useState } from "react";

interface AppData {
  consume: {year:number;cat:string;val:number}[];
  visitors: {year:number;visitors:number;acc_rate:number}[];
  stay: {type:string;minutes:number;color:string}[];
  inflow: {region:string;ratio:number;lon:number;lat:number}[];
  cat_counts: Record<string,number>;
  dong_top10: {dong:string;count:number;lon:number;lat:number}[];
  buffer: {festival:string;km1:number;km3:number;km5:number;color:number[];eval:string}[];
}
interface RadarRow {
  year:number;
  visitors_score:number; consume_score:number; acc_score:number;
  visitors_raw:number; consume_raw:number; acc_raw:number;
}
interface SankeyData {
  nodes:string[]; sources:number[]; targets:number[]; values:number[];
  link_colors:string[]; layer_labels:string[]; layer_counts:number[];
  node_layers:number[]; note:string;
}

const CONSUME_COLORS:Record<string,string> = {
  '숙박업':'#7c3aed','쇼핑업':'#1a56db','여가서비스업':'#0ea86e',
  '의료웰니스업':'#f0b429','식음료업':'#d64f2a'
};
// 레이더: 실측 3축만
const RADAR_KEYS = ['visitors_score','consume_score','acc_score'] as const;
const RADAR_LABELS = ['방문객 수','관광소비액','숙박률'];
const RADAR_COLORS = ['#95a5a6','#2ecc71','#e74c3c'];

function MiniBarChart({data,labelKey,valKey,color,unit=''}:{data:any[];labelKey:string;valKey:string;color:string|((d:any)=>string);unit?:string}) {
  const max = Math.max(...data.map(d=>d[valKey])) || 1;
  return (<div>{data.map((d,i)=>(
    <div key={i} style={{marginBottom:6}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:2}}>
        <span style={{color:'rgba(255,255,255,0.55)'}}>{d[labelKey]}</span>
        <span className="mono" style={{color:'rgba(255,255,255,0.82)'}}>{typeof d[valKey]==='number'?d[valKey].toLocaleString():d[valKey]}{unit}</span>
      </div>
      <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:3}}>
        <div style={{height:'100%',width:`${d[valKey]/max*100}%`,background:typeof color==='function'?color(d):color,borderRadius:3}}/>
      </div>
    </div>
  ))}</div>);
}

function ChartCard({title,mono,sub,children,fullWidth}:{title:string;mono?:string;sub?:string;children:React.ReactNode;fullWidth?:boolean}){
  return (
    <div style={{background:'#111620',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,overflow:'hidden',display:'flex',flexDirection:'column',gridColumn:fullWidth?'1/-1':undefined}}>
      <div style={{padding:'8px 14px',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(255,255,255,0.03)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:12,fontWeight:500,color:'rgba(255,255,255,0.8)'}}>{title}</span>
          {mono&&<span className="mono" style={{fontSize:9,color:'rgba(255,255,255,0.28)',letterSpacing:'.05em'}}>{mono}</span>}
        </div>
        {sub&&<div style={{fontSize:9,color:'rgba(255,255,255,0.28)',marginTop:2}}>{sub}</div>}
      </div>
      <div style={{padding:'12px 14px',flex:1}}>{children}</div>
    </div>
  );
}

/* ── 레이더 (3축 실측) ── */
function RadarChart({data}:{data:RadarRow[]}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<number|null>(null);

  useEffect(()=>{
    try {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2+10, R = Math.min(w,h)*0.32;
    const N = RADAR_KEYS.length;
    const MIN_VAL = 60;

    ctx.clearRect(0,0,w,h);
    // 동심원
    for(let ring=1;ring<=4;ring++){
      const r = R*ring/4;
      ctx.beginPath();
      for(let i=0;i<N;i++){
        const a=(i/N)*Math.PI*2-Math.PI/2;
        i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      }
      ctx.closePath();
      ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=0.8; ctx.stroke();
      const lv = Math.round(MIN_VAL+(100-MIN_VAL)*ring/4);
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='7px monospace'; ctx.textAlign='center';
      ctx.fillText(lv.toString(), cx, cy-r+4);
    }
    // 축선
    for(let i=0;i<N;i++){
      const a=(i/N)*Math.PI*2-Math.PI/2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
      ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=0.8; ctx.stroke();
    }
    // 폴리곤
    data.forEach((row,ri)=>{
      const color = RADAR_COLORS[ri];
      const isHov = hovered===ri;
      ctx.beginPath();
      RADAR_KEYS.forEach((k,i)=>{
        const a=(i/N)*Math.PI*2-Math.PI/2;
        const norm=(row[k]-MIN_VAL)/(100-MIN_VAL);
        const r=R*Math.max(0,norm);
        i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r):ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      });
      ctx.closePath();
      ctx.fillStyle=color+(isHov?'55':'25'); ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=isHov?2.5:1.5; ctx.stroke();
      RADAR_KEYS.forEach((k,i)=>{
        const a=(i/N)*Math.PI*2-Math.PI/2;
        const norm=(row[k]-MIN_VAL)/(100-MIN_VAL);
        const r=R*Math.max(0,norm);
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,isHov?4:2.5,0,Math.PI*2);
        ctx.fillStyle=color; ctx.fill();
      });
    });
    // 축 레이블
    RADAR_LABELS.forEach((lbl,i)=>{
      const a=(i/N)*Math.PI*2-Math.PI/2;
      const x=cx+Math.cos(a)*(R+22), y=cy+Math.sin(a)*(R+22);
      ctx.fillStyle='rgba(255,255,255,0.72)'; ctx.font='bold 10px Noto Sans KR,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(lbl,x,y);
    });
    } catch(e) { console.error('RadarChart error:', e); }
  },[data,hovered]);

  return (
    <div>
      <canvas ref={canvasRef} width={280} height={240} style={{width:'100%',maxWidth:280}}/>
      <div style={{display:'flex',gap:10,marginTop:4,justifyContent:'center'}}>
        {data.map((row,i)=>(
          <div key={row.year} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{display:'flex',alignItems:'center',gap:4,cursor:'pointer',opacity:hovered!==null&&hovered!==i?0.35:1,transition:'opacity .15s'}}>
            <span style={{width:9,height:9,borderRadius:2,background:RADAR_COLORS[i],display:'block'}}/>
            <span style={{fontSize:10,color:'rgba(255,255,255,0.7)'}}>{row.year}</span>
          </div>
        ))}
      </div>
      {/* 실측값 테이블 */}
      <div style={{marginTop:8,overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:9}}>
          <thead>
            <tr>
              <th style={{padding:'3px 4px',color:'rgba(255,255,255,0.3)',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:400}}>지표</th>
              {data.map(r=><th key={r.year} style={{padding:'3px 4px',textAlign:'right',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:400,color:'rgba(255,255,255,0.3)'}}>{r.year}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ['방문객',...data.map(r=>(r.visitors_raw/10000).toFixed(0)+'만명')],
              ['소비(운송제외)',...data.map(r=>r.consume_raw+'억')],
              ['숙박률',...data.map(r=>r.acc_raw+'%')],
            ].map(([lbl,...vals])=>(
              <tr key={lbl as string}>
                <td style={{padding:'3px 4px',color:'rgba(255,255,255,0.42)'}}>{lbl}</td>
                {vals.map((v,i)=><td key={i} className="mono" style={{padding:'3px 4px',textAlign:'right',color:'rgba(255,255,255,0.72)',fontSize:9}}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:6,fontSize:9,color:'rgba(255,255,255,0.22)',textAlign:'center'}}>
        출처: 한국관광데이터랩 · 소상공인진흥공단 실측값
      </div>
    </div>
  );
}

/* ── Sankey (Canvas, 3단계 실측) ── */
function SankeyChart({data}:{data:SankeyData}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{x:number;y:number;text:string}|null>(null);
  const nodeRectsRef = useRef<{x:number;y:number;w:number;h:number;label:string;val:number}[]>([]);

  const LAYER_COLORS = ['#3498db','#2ecc71','#e74c3c'];
  const NODE_W = 13;

  useEffect(()=>{
    try {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const PAD_L=72, PAD_R=88, PAD_T=28, PAD_B=22;
    const drawW = W-PAD_L-PAD_R, drawH = H-PAD_T-PAD_B;
    ctx.clearRect(0,0,W,H);

    if (!data?.layer_counts?.length || !data?.nodes?.length ||
        !data?.sources?.length || !data?.targets?.length || !data?.values?.length) return;
    const {layer_counts} = data;
    const layerX = layer_counts.map((_,i)=>PAD_L + drawW*i/(layer_counts.length-1));
    const nodeFlow: number[] = new Array(data.nodes.length).fill(0);
    // source 기반 flow
    let nodeIdx = 0;
    layer_counts.forEach((cnt)=>{
      for(let j=0;j<cnt;j++){
        const ni = nodeIdx+j;
        const sFlow = data.values.filter((_,vi)=>data.sources[vi]===ni).reduce((a,v)=>a+v,0);
        const tFlow = data.values.filter((_,vi)=>data.targets[vi]===ni).reduce((a,v)=>a+v,0);
        nodeFlow[ni] = Math.max(sFlow, tFlow);
      }
      nodeIdx+=cnt;
    });

    const nodeRects: typeof nodeRectsRef.current = [];
    nodeIdx = 0;
    layer_counts.forEach((cnt,li)=>{
      const x = layerX[li] - NODE_W/2;
      const GAP = 7, totalH = drawH*0.9;
      const layerTotal = Array.from({length:cnt},(_,j)=>nodeFlow[nodeIdx+j]).reduce((a,v)=>a+v,0);
      let curY = PAD_T + drawH*0.05;
      for(let j=0;j<cnt;j++){
        const ni = nodeIdx+j;
        const nh = Math.max(5, (nodeFlow[ni]/layerTotal)*(totalH - GAP*(cnt-1)));
        nodeRects.push({x,y:curY,w:NODE_W,h:nh,label:data.nodes[ni],val:nodeFlow[ni]});
        curY += nh + GAP;
        nodeIdx++;
      }
    });
    nodeRectsRef.current = nodeRects;

    const srcOff = new Array(data.nodes.length).fill(0);
    const tgtOff = new Array(data.nodes.length).fill(0);
    const linkOrder = data.sources.map((_,i)=>i).sort((a,b)=>data.sources[a]-data.sources[b]);

    linkOrder.forEach(li=>{
      const s=data.sources[li],t=data.targets[li],v=data.values[li];
      if(v<=0)return;
      const sR=nodeRects[s],tR=nodeRects[t];
      if(!sR||!tR||nodeFlow[s]===0||nodeFlow[t]===0)return;
      const sH=sR.h*(v/nodeFlow[s]),tH=tR.h*(v/nodeFlow[t]);
      const sy=sR.y+srcOff[s],ty=tR.y+tgtOff[t];
      srcOff[s]+=sH; tgtOff[t]+=tH;
      const x1=sR.x+NODE_W,x2=tR.x,cpx=(x1+x2)/2;
      ctx.beginPath();
      ctx.moveTo(x1,sy);ctx.bezierCurveTo(cpx,sy,cpx,ty,x2,ty);
      ctx.lineTo(x2,ty+tH);ctx.bezierCurveTo(cpx,ty+tH,cpx,sy+sH,x1,sy+sH);
      ctx.closePath();
      ctx.fillStyle=data.link_colors[li]||'rgba(150,150,150,0.2)'; ctx.fill();
    });

    nodeRects.forEach((nr,i)=>{
      const li=data.node_layers[i];
      ctx.fillStyle=LAYER_COLORS[li];
      ctx.fillRect(nr.x,nr.y,nr.w,nr.h);
      ctx.fillStyle='rgba(255,255,255,0.75)';
      ctx.font='9.5px Noto Sans KR,sans-serif'; ctx.textBaseline='middle';
      const lbl = nr.label.length>7?nr.label.slice(0,7):nr.label;
      if(li===0){ ctx.textAlign='right'; ctx.fillText(lbl,nr.x-4,nr.y+nr.h/2); }
      else if(li===layer_counts.length-1){ ctx.textAlign='left'; ctx.fillText(lbl,nr.x+NODE_W+4,nr.y+nr.h/2); }
      else { ctx.textAlign='center'; if(nr.h>13) ctx.fillText(lbl,nr.x+NODE_W/2,nr.y+nr.h/2); }
    });

    data.layer_labels.forEach((lbl,li)=>{
      ctx.fillStyle=LAYER_COLORS[li];
      ctx.font='bold 10px Noto Sans KR,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(lbl,layerX[li],5);
    });
      } catch(e) { console.error('SankeyChart render error:', e); }
  },[data]);

  const onMouseMove=(e:React.MouseEvent<HTMLCanvasElement>)=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    const found=nodeRectsRef.current.find(nr=>mx>=nr.x&&mx<=nr.x+nr.w&&my>=nr.y&&my<=nr.y+nr.h);
    setTooltip(found?{x:e.clientX-rect.left,y:e.clientY-rect.top,text:`${found.label}: ${found.val}명`}:null);
  };

  return (
    <div style={{position:'relative'}}>
      <canvas ref={canvasRef} width={820} height={290} style={{width:'100%',display:'block'}}
        onMouseMove={onMouseMove} onMouseLeave={()=>setTooltip(null)}/>
      {tooltip&&(
        <div style={{position:'absolute',left:tooltip.x+10,top:tooltip.y-10,background:'rgba(13,17,23,0.95)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:5,padding:'4px 9px',fontSize:11,color:'white',pointerEvents:'none',whiteSpace:'nowrap'}}>
          {tooltip.text}
        </div>
      )}
      <div style={{textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.28)',marginTop:4}}>
        기준: 방문객 1,000명 · {data.note}
      </div>
    </div>
  );
}

/* ── 메인 ── */
export default function EDAPanel() {
  const [data, setData] = useState<AppData|null>(null);
  const [radarData, setRadarData] = useState<RadarRow[]|null>(null);
  const [sankeyData, setSankeyData] = useState<SankeyData|null>(null);
  const [selYear, setSelYear] = useState<number>(0);

  useEffect(()=>{
    fetch('/appdata.json').then(r=>r.json()).then(setData).catch(console.error);
    fetch('/radar.json').then(r=>r.json()).then(setRadarData).catch(console.error);
    fetch('/sankey.json').then(r=>r.json()).then(setSankeyData).catch(console.error);
  },[]);

  if(!data) return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:13}}>데이터 로딩 중...</div>;

  const consumeFiltered = selYear===0
    ? (['숙박업','쇼핑업','여가서비스업','의료웰니스업','식음료업']).map(cat=>({
        cat, avg: Math.round(data.consume.filter(d=>d.cat===cat).reduce((s,d)=>s+d.val,0)/3*10)/10
      }))
    : data.consume.filter(d=>d.year===selYear).map(d=>({cat:d.cat,avg:d.val}));

  return (
    <section style={{background:'#0d1117',padding:'28px 24px 48px'}}>
      <div style={{maxWidth:1400,margin:'0 auto'}}>

        {/* 헤더 */}
        <div style={{marginBottom:20,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{width:36,height:3,background:'#1a56db',marginBottom:10,borderRadius:2}}/>
            <h2 style={{fontSize:22,fontWeight:700,color:'white',marginBottom:4}}>탐색적 데이터 분석 (EDA)</h2>
            <p style={{color:'rgba(255,255,255,0.38)',fontSize:13}}>
              한국관광데이터랩 · 소상공인진흥공단 · 국가통계 · 2022–2024 준실험 설계
            </p>
          </div>
          <div style={{display:'flex',gap:5}}>
            {[{v:0,l:'전체 평균'},{v:2022,l:'2022년'},{v:2023,l:'2023년'},{v:2024,l:'2024년'}].map(({v,l})=>(
              <button key={v} onClick={()=>setSelYear(v)} style={{
                fontSize:11,padding:'4px 11px',borderRadius:5,cursor:'pointer',
                border:selYear===v?'1px solid rgba(26,86,219,0.7)':'1px solid rgba(255,255,255,0.12)',
                background:selYear===v?'rgba(26,86,219,0.2)':'transparent',
                color:selYear===v?'#7aadff':'rgba(255,255,255,0.5)',transition:'all .15s',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* 1행: 방문자/숙박 + 체류역설 + 버퍼 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:14}}>
          <ChartCard title="방문자수 & 숙박률" mono="EDA 1" sub="출처: 한국관광데이터랩 실측">
            {data.visitors.map(v=>(
              <div key={v.year} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                  <span style={{color:'rgba(255,255,255,0.5)'}}>{v.year}년</span>
                  <span className="mono" style={{color:'rgba(255,255,255,0.85)'}}>{v.visitors.toLocaleString()}명</span>
                </div>
                <div style={{height:7,background:'rgba(255,255,255,0.06)',borderRadius:4}}>
                  <div style={{height:'100%',width:`${v.visitors/11568378*100}%`,background:v.year===2022?'#95a5a6':v.year===2023?'#2ecc71':'#e74c3c',borderRadius:4}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginTop:2}}>
                  <span style={{color:'rgba(255,255,255,0.3)'}}>숙박률</span>
                  <span style={{color:v.acc_rate>9?'#f0b429':'rgba(255,255,255,0.5)'}} className="mono">{v.acc_rate}%</span>
                </div>
              </div>
            ))}
            <div style={{marginTop:8,padding:'6px 8px',background:'rgba(26,86,219,0.1)',borderRadius:6,border:'1px solid rgba(26,86,219,0.2)'}}>
              <div style={{fontSize:10,color:'#7aadff',fontWeight:700,marginBottom:2}}>핵심 발견</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>방문자 +9.7% 증가 추세<br/>숙박률은 오히려 감소 (10.4%→8.4%)</div>
            </div>
          </ChartCard>

          <ChartCard title="체류시간 — 역설적 결과" mono="EDA 2" sub="출처: 한국관광데이터랩 실측">
            {data.stay.map(s=>(
              <div key={s.type} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                  <span style={{color:'rgba(255,255,255,0.5)'}}>{s.type}</span>
                  <span className="mono" style={{color:'rgba(255,255,255,0.85)'}}>{s.minutes}분 ({(s.minutes/60).toFixed(1)}h)</span>
                </div>
                <div style={{height:7,background:'rgba(255,255,255,0.06)',borderRadius:4}}>
                  <div style={{height:'100%',width:`${s.minutes/1478*100}%`,background:s.color,borderRadius:4}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,padding:'8px',background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.2)',borderRadius:6}}>
              <div style={{fontSize:10,color:'#e74c3c',fontWeight:700,marginBottom:3}}>역설 해석 (구성 효과)</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>3월은 장기체류 관광객 위주<br/>축제 달은 단기 당일 방문객 급증<br/>→ <span style={{color:'#f0b429'}}>Composition Effect</span></div>
            </div>
          </ChartCard>

          <ChartCard title="축제장 반경별 상가 수" mono="BUFFER" sub="출처: 소상공인진흥공단 2023Q2 · geopandas 공간 분석">
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                <thead>
                  <tr>{['축제','1km','3km','5km','평가'].map(h=>(
                    <th key={h} style={{padding:'4px 5px',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.4)',fontWeight:400,textAlign:'left',fontSize:9,borderBottom:'1px solid rgba(255,255,255,0.07)'}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {data.buffer.map((v,i)=>(
                    <tr key={v.festival}>
                      <td style={{padding:'5px 5px',color:`rgb(${v.color[0]},${v.color[1]},${v.color[2]})`,fontWeight:700}}>{['★','●','▲'][i]} {v.festival.slice(0,5)}</td>
                      <td className="mono" style={{padding:'5px 5px',color:v.km1===0?'#e74c3c':'#2ecc71',fontWeight:700}}>{v.km1.toLocaleString()}</td>
                      <td className="mono" style={{padding:'5px 5px',color:'rgba(255,255,255,0.6)'}}>{v.km3.toLocaleString()}</td>
                      <td className="mono" style={{padding:'5px 5px',color:'rgba(255,255,255,0.6)'}}>{v.km5.toLocaleString()}</td>
                      <td style={{padding:'5px 5px',fontSize:9,color:'rgba(255,255,255,0.38)'}}>{v.eval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.buffer.map(v=>{
              const max5=Math.max(...data.buffer.map(b=>b.km5));
              return (<div key={v.festival} style={{marginTop:6}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:2}}>
                  <span style={{color:'rgba(255,255,255,0.45)'}}>{v.festival.slice(0,8)}</span>
                  <span className="mono" style={{color:`rgb(${v.color[0]},${v.color[1]},${v.color[2]})`}}>5km {v.km5.toLocaleString()}</span>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:2}}>
                  <div style={{height:'100%',width:`${v.km5/max5*100}%`,background:`rgb(${v.color[0]},${v.color[1]},${v.color[2]})`,borderRadius:2}}/>
                </div>
              </div>);
            })}
          </ChartCard>
        </div>

        {/* 2행: 소비 + 유입 + 업종 + 읍면동 */}
        <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr 0.9fr 0.9fr',gap:14,marginBottom:14}}>
          <ChartCard title={`관광소비 업종별 (운송업 제외${selYear?', '+selYear+'년':' 평균'})`} mono="EDA 3" sub="출처: 한국관광데이터랩 관광소비_추이_외지인 실측">
            {consumeFiltered.map(({cat,avg})=>(
              <div key={cat} style={{marginBottom:7}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2}}>
                  <span style={{color:'rgba(255,255,255,0.6)'}}>{cat}</span>
                  <span className="mono" style={{color:'rgba(255,255,255,0.85)'}}>{avg}억원</span>
                </div>
                <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3}}>
                  <div style={{height:'100%',width:`${avg/consumeFiltered.reduce((m,d)=>Math.max(m,d.avg),0)*100}%`,background:CONSUME_COLORS[cat]||'#888',borderRadius:3}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,padding:'6px 8px',background:'rgba(214,79,42,0.1)',borderRadius:6,border:'1px solid rgba(214,79,42,0.2)'}}>
              <div style={{fontSize:10,color:'#d64f2a',fontWeight:700,marginBottom:2}}>낙수효과 진단</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>쇼핑·식음료 높음 · 숙박 소비 제한적</div>
            </div>
          </ChartCard>

          <ChartCard title="주요 유입 출발지 Top10" mono="EDA 4" sub="출처: 한국관광데이터랩 유입출발지 분석 결과">
            {data.inflow.slice(0,8).map((d,i)=>(
              <div key={d.region} style={{marginBottom:5}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:1}}>
                  <span style={{color:'rgba(255,255,255,0.55)'}}>{d.region}</span>
                  <span className="mono" style={{color:'rgba(255,255,255,0.82)'}}>{d.ratio}%</span>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:2}}>
                  <div style={{height:'100%',width:`${d.ratio/19.5*100}%`,background:`rgba(26,86,219,${0.9-i*0.07})`,borderRadius:2}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:8,padding:'5px 8px',background:'rgba(26,86,219,0.1)',borderRadius:5,border:'1px solid rgba(26,86,219,0.2)',fontSize:10,color:'rgba(255,255,255,0.45)'}}>
              상위 3개 지역 <span style={{color:'#7aadff',fontWeight:700}}>42%</span> — 대구·경북 근거리 집중
            </div>
          </ChartCard>

          <ChartCard title="업종별 상가 분포" mono="4,833개" sub="출처: 소상공인진흥공단 2023Q2">
            <MiniBarChart
              data={Object.entries(data.cat_counts).map(([k,v])=>({cat:k,val:v}))}
              labelKey="cat" valKey="val"
              color={d=>{const i=Object.keys(data.cat_counts).indexOf(d.cat);const c=[[214,79,42],[26,86,219],[124,58,237],[14,168,110],[240,180,41],[149,165,166],[231,76,60],[155,89,182],[52,152,219],[46,204,113]][i];return`rgb(${c})`;}}
            />
          </ChartCard>

          <ChartCard title="읍면동별 상가 Top10" mono="KDE" sub="출처: 소상공인진흥공단 공간조인">
            <MiniBarChart data={data.dong_top10} labelKey="dong" valKey="count" color="rgba(214,79,42,0.8)" unit="개"/>
          </ChartCard>
        </div>

        {/* 3행: Sankey (전체) */}
        {sankeyData&&(
          <div style={{marginBottom:14}}>
            <ChartCard
              title="방문객 여정 흐름 — Sankey 다이어그램"
              mono="출발지 → 교통수단 → 지출항목"
              sub="출처: 한국관광데이터랩 유입출발지·교통수단 실측 | 지출항목: 관광소비_추이_외지인 3개년 평균"
              fullWidth>
              <SankeyChart data={sankeyData}/>
            </ChartCard>
          </div>
        )}

        {/* 4행: 레이더 + 파이프라인 + 정책 */}
        <div style={{display:'grid',gridTemplateColumns:'260px 1fr 1fr',gap:14,marginBottom:14}}>
          {radarData&&(
            <ChartCard title="관광 지표 성장 다각형" mono="레이더 · 실측 3축" sub="방문객·소비·숙박률 원본값 정규화 (60–100점)">
              <RadarChart data={radarData}/>
            </ChartCard>
          )}

          <ChartCard title="체류인구 전환 방법론 — 6단계 파이프라인" mono="METHODOLOGY">
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[
                {id:'01',t:'기준인구 설정',d:'주민등록 인구 추출 (행정안전부)',c:'#d64f2a'},
                {id:'02',t:'생활인구 취득',d:'축제 달(5·10월) + 베이스라인(3월)',c:'#1a56db'},
                {id:'03',t:'거주자 제거',d:'순수 외부 방문객 추출',c:'#7c3aed'},
                {id:'04',t:'축제 효과 분리',d:'축제 달 – 베이스라인 = 순증 방문객',c:'#0ea86e'},
                {id:'05',t:'체류시간 필터',d:'1시간 이상 체류자만 집계',c:'#f0b429'},
                {id:'06',t:'보정계수 적용',d:'스마트폰 보급률 93% → ÷0.93',c:'#d64f2a'},
              ].map((s,i,arr)=>(
                <div key={s.id} style={{display:'flex',alignItems:'center',gap:7}}>
                  <div style={{flex:1,background:`rgba(${s.c==='#d64f2a'?'214,79,42':s.c==='#1a56db'?'26,86,219':s.c==='#7c3aed'?'124,58,237':s.c==='#0ea86e'?'14,168,110':s.c==='#f0b429'?'240,180,41':'214,79,42'},0.12)`,borderRadius:6,padding:'6px 9px',border:`1px solid ${s.c}2a`}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span className="mono" style={{fontSize:9,color:s.c,fontWeight:700}}>STEP {s.id}</span>
                      <span style={{fontSize:11,fontWeight:700,color:'white'}}>{s.t}</span>
                    </div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:1}}>{s.d}</div>
                  </div>
                  {i<arr.length-1&&<span style={{color:'rgba(255,255,255,0.12)',flexShrink:0}}>↓</span>}
                </div>
              ))}
            </div>
            <div style={{marginTop:8,padding:'6px 9px',background:'rgba(14,168,110,0.08)',borderRadius:6,border:'1px solid rgba(14,168,110,0.18)',fontSize:10,color:'rgba(255,255,255,0.4)',lineHeight:1.6}}>
              3월 베이스라인 선정: 추석 연휴 없는 비축제 평시 · 코로나 2020–2021 제외
            </div>
          </ChartCard>

          <ChartCard title="4대 정책 제언 — 공간 기반 개선 방향" mono="POLICY">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
              {[
                {n:'01',t:'보현산 연계 상권',d:'한시적 로컬마켓·푸드트럭, 도심 셔틀+쿠폰',c:'#7c3aed',tag:'공간 전략'},
                {n:'02',t:'체류형 관광 인프라',d:'야간 프로그램·숙박 패키지·2일권 도입',c:'#e74c3c',tag:'체류 유도'},
                {n:'03',t:'광역 유입 확대',d:'수도권·부산 광역 마케팅, KTX 연계 상품',c:'#2ecc71',tag:'마케팅'},
                {n:'04',t:'데이터 모니터링',d:'KTDB×소상공인×공간 정기 분석 체계',c:'#1a56db',tag:'거버넌스'},
              ].map(({n,t,d,c,tag})=>(
                <div key={n} style={{padding:'9px 10px',background:`rgba(${c==='#7c3aed'?'124,58,237':c==='#e74c3c'?'231,76,60':c==='#2ecc71'?'46,204,113':'26,86,219'},0.08)`,borderRadius:8,border:`1px solid ${c}2a`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span className="mono" style={{fontSize:10,color:c,fontWeight:700}}>{n}</span>
                    <span style={{fontSize:9,padding:'1px 5px',borderRadius:3,background:`${c}1a`,color:c}}>{tag}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:'white',marginBottom:3}}>{t}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>{d}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* 푸터 */}
        <div style={{padding:'13px 18px',background:'rgba(255,255,255,0.03)',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:'white',marginBottom:3}}>지역소멸 대응을 위한 영천시 공간정보 기반 축제 분석</div>
            <div className="mono" style={{fontSize:10,color:'rgba(255,255,255,0.3)'}}>영천시 공공데이터·AI 활용 창업 경진대회 · 데이터 시각화 부문 · 2026.05.14</div>
          </div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {['한국관광데이터랩','소상공인진흥공단','국가공간정보포털','행정안전부 주민등록통계'].map(s=>(
              <span key={s} className="chip" style={{background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.38)',border:'1px solid rgba(255,255,255,0.07)'}}>{s}</span>
            ))}
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>팀원</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.7)'}}>김연준 · 백승호 · 유현채</div>
          </div>
        </div>
      </div>
    </section>
  );
}
