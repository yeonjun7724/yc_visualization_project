import MapLoader from "@/components/MapLoader";
import EDAPanel from "@/components/EDAPanel";

export default function Home() {
  return (
    <main style={{ background: "#0a0e1a", minHeight: "100vh" }}>
      <MapLoader />
      <EDAPanel />
    </main>
  );
}
