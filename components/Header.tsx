"use client";
import { useState } from "react";

const navItems = [
  { href: "#overview",    label: "개요" },
  { href: "#results",    label: "분석 결과" },
  { href: "#population",  label: "체류인구" },
  { href: "#sources",     label: "데이터 소스" },
  { href: "#viz",         label: "시각화 기법" },
  { href: "#methods",     label: "분석 방법론" },
  { href: "#workflow",    label: "워크플로" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,14,26,0.97)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 54,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: "#d64f2a", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>영</span>
          </div>
          <span className="mono" style={{ color: "white", fontSize: 12, letterSpacing: "0.04em" }}>
            영천시 축제 데이터랩
          </span>
          <span className="chip" style={{ background: "#0ea86e22", color: "#0ea86e", marginLeft: 4 }}>
            무료 only
          </span>
        </div>

        <nav style={{ display: "flex", gap: 24 }} className="sidebar-nav">
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{
              color: "rgba(255,255,255,0.55)", textDecoration: "none",
              fontSize: 13, fontWeight: 500, transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >{item.label}</a>
          ))}
        </nav>

        <button onClick={() => setOpen(!open)} style={{
          display: "none", background: "none", border: "none",
          color: "white", cursor: "pointer", fontSize: 20,
        }} className="mobile-menu-btn" aria-label="메뉴">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div style={{ background: "#0a0e1a", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 24px" }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{
                display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none",
                padding: "10px 0", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>{item.label}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; }
        }
      `}</style>
    </header>
  );
}
