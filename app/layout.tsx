import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "지역소멸 대응을 위한 영천시 공간정보 기반 축제 분석",
  description: "영천시 공공데이터·AI 활용 창업 경진대회 출품작 — 소상공인 상가 4,833개 · 축제장 3곳 · 공간정보 기반 낙수효과 분석",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
