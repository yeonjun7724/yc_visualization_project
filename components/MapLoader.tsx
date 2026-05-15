"use client";
import dynamic from "next/dynamic";

const FestivalMap = dynamic(() => import("@/components/FestivalMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: 620,
      background: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "monospace" }}>
        지도 로딩 중...
      </div>
    </div>
  ),
});

export default function MapLoader() {
  return <FestivalMap />;
}
