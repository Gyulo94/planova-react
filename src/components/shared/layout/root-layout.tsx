import AppSidebar from "@/components/shared/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useParams } from "react-router-dom";

export default function RootLayout() {
  const { workspaceId } = useParams();
  return (
    <SidebarProvider>
      <div className="w-full flex h-screen bg-accent">
        <AppSidebar workspaceId={workspaceId} />
        <main className="w-full overflow-y-auto min-h-screen">
          <div className="p-0 md:p-4 pt-2 min-h-[calc(100vh-64px)] xl: max-w-[1920px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
