import { useState } from "react";
import Footer from "./common/Footer";
import Header from "./common/Header";
import MenuDrawer from "./common/MenuDrawer";
import MobileBottomNav from "./common/MobileBottomNav";

export default function AdminLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="page">
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />
      <div className="page-wrapper">{children}</div>
      <MenuDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <MobileBottomNav onOpenDrawer={() => setIsDrawerOpen(true)} />
      <Footer />
    </div>
  );
}
