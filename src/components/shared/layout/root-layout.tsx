import AppSidebar from "@/components/shared/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import NavBar from "../header/nav-bar";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="w-full flex h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/50 via-background to-background overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <NavBar />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 md:px-8 min-h-[calc(100vh-65px)] xl:max-w-[1800px] mx-auto transition-all duration-300 flex flex-col">
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
