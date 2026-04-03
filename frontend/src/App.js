import { DesktopProvider, useDesktop } from "@/contexts/DesktopContext";
import { Toaster } from "sonner";
import LockScreen from "@/pages/LockScreen";
import Desktop from "@/pages/Desktop";
import "@/App.css";

function Shell() {
  const { unlocked } = useDesktop();
  if (!unlocked) return <LockScreen />;
  return <Desktop />;
}

function App() {
  return (
    <DesktopProvider>
      <Shell />
      <Toaster position="top-center" theme="dark" />
    </DesktopProvider>
  );
}

export default App;
