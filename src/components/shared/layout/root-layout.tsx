import Navbar from "@/components/navbar";
import AppSidebar from "@/components/shared/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useFindWorkspaceMembers } from "@/features/workspace-member/query";
import { NotFoundPage } from "@/pages";
import { Outlet, useParams } from "react-router-dom";

export default function RootLayout() {
  const { workspaceId } = useParams();
  const { isError, isLoading } = useFindWorkspaceMembers(workspaceId);

  if (!workspaceId) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  return (
    <SidebarProvider>
      <div className="w-full flex h-screen bg-accent">
        <AppSidebar workspaceId={workspaceId} />
        <main className="w-full overflow-y-auto min-h-screen">
          <div className="p-0 md:p-2 min-h-[calc(100vh-64px)] xl:max-w-[1920px] mx-auto">
            <Navbar />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
